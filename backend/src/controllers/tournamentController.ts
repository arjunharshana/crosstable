import { Request, Response } from "express";
import Tournament from "../models/tournament";

export const createTournament = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      format,
      timeControl,
      totalRounds,
      startDate,
      endDate,
      location,
      access,
    } = req.body;
    const tournament = new Tournament({
      name,
      description,
      organizer: (req as any).user._id,
      format,
      timeControl,
      totalRounds,
      startDate,
      endDate,
      location,
      status: "Upcoming",
      access,
      participants: [],
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (err) {
    console.error("Create Tournament Error:", err);
    res.status(500).json({ message: "Server error while creating tournament" });
  }
};

export const getAllTournaments = async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.find()
      .populate("organizer", "username firstName lastName")
      .sort({ startDate: -1 });
    res.status(200).json(tournaments);
  } catch (err) {
    console.error("Get Tournaments Error:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching tournaments" });
  }
};

export const getTournamentById = async (req: Request, res: Response) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("organizer", "username firstName lastName")
      .populate("participants.user", "username firstName lastName");
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.status(200).json(tournament);
  } catch (err) {
    console.error("Get Tournament Error:", err);
    res.status(500).json({ message: "Server error while fetching tournament" });
  }
};

export const updateTournament = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const tournament = await Tournament.findOneAndUpdate(
      { _id: req.params.id, organizer: userId },
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!tournament) {
      return res
        .status(404)
        .json({ message: "Tournament not found or unauthorized" });
    }

    res.status(200).json(tournament);
  } catch (error) {
    console.error("Error updating tournament:", error);
    res.status(500).json({ message: "Server error updating tournament" });
  }
};

export const deleteTournament = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const tournament = await Tournament.findOneAndDelete({
      _id: req.params.id,
      organizer: userId,
    });

    if (!tournament) {
      return res
        .status(404)
        .json({ message: "Tournament not found or unauthorized" });
    }

    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    res.status(500).json({ message: "Server error deleting tournament" });
  }
};

export const joinTournament = async (req: Request, res: Response) => {
  try {
    const tournamentId = req.params.id;
    const userId = (req as any).user.id;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.status !== "Upcoming") {
      return res
        .status(400)
        .json({ message: "Registration is closed for this event." });
    }

    if (tournament.access === "Private") {
      return res.status(403).json({
        message: "This tournament is private. Please contact the organizer.",
      });
    }

    const isAlreadyRegistered = tournament.participants.some(
      (p) => p.user?.toString() === userId,
    );

    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "You are already registered for this tournament." });
    }

    tournament.participants.push({
      user: userId as any,
      isGuest: false,
      joinedAt: new Date(),
      score: 0,
      buchholz: 0,
    });

    await tournament.save();

    res
      .status(200)
      .json({ message: "Successfully joined the tournament!", tournament });
  } catch (error) {
    console.error("Error joining tournament:", error);
    res.status(500).json({ message: "Server error joining tournament" });
  }
};

export const addPlayerManually = async (req: Request, res: Response) => {
  try {
    const tournamentId = req.params.id;
    const organizerId = (req as any).user.id;
    const { isGuest, guestName, guestRating, userId } = req.body;

    const tournament = await Tournament.findOne({
      _id: tournamentId,
      organizer: organizerId,
    });

    if (!tournament) {
      return res
        .status(404)
        .json({ message: "Tournament not found or unauthorized" });
    }

    if (tournament.status !== "Upcoming") {
      return res
        .status(400)
        .json({ message: "Cannot add players after tournament starts" });
    }

    if (!isGuest) {
      if (!userId)
        return res
          .status(400)
          .json({ message: "User ID is required for registered players" });

      const isAlreadyRegistered = tournament.participants.some(
        (p) => p.user?.toString() === userId,
      );
      if (isAlreadyRegistered)
        return res.status(400).json({ message: "Player already registered" });

      tournament.participants.push({
        user: userId as any,
        isGuest: false,
        joinedAt: new Date(),
        score: 0,
        buchholz: 0,
      });
    } else {
      if (!guestName)
        return res.status(400).json({ message: "Guest name is required" });

      tournament.participants.push({
        isGuest: true,
        guestName,
        guestRating: guestRating || 1200,
        joinedAt: new Date(),
        score: 0,
        buchholz: 0,
      } as any);
    }

    await tournament.save();
    res.status(200).json({ message: "Player added successfully", tournament });
  } catch (error) {
    console.error("Error adding player manually:", error);
    res.status(500).json({ message: "Server error adding player" });
  }
};

export const removePlayerManually = async (req: Request, res: Response) => {
  try {
    const tournamentId = req.params.id;
    const participantId = req.params.participantId;
    const organizerId = (req as any).user.id;

    const tournament = await Tournament.findOne({
      _id: tournamentId,
      organizer: organizerId,
    });

    if (!tournament) {
      return res
        .status(404)
        .json({ message: "Tournament not found or unauthorized" });
    }

    if (tournament.status !== "Upcoming") {
      return res.status(400).json({
        message:
          "Cannot completely remove players after the tournament has started. (Withdrawal feature coming soon)",
      });
    }

    const updatedTournament = await Tournament.findOneAndUpdate(
      { _id: tournamentId, organizer: organizerId },
      { $pull: { participants: { _id: participantId } } },
      { new: true },
    );

    res.status(200).json({
      message: "Player removed successfully",
      tournament: updatedTournament,
    });
  } catch (error) {
    console.error("Error removing player:", error);
    res.status(500).json({ message: "Server error removing player" });
  }
};
