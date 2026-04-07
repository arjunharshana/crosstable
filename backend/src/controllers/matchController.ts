import { Request, Response } from "express";
import Match from "../models/match";
import Tournament from "../models/tournament";

export const getTournamentMatches = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const matches = await Match.find({ tournament: id }).sort({
      round: -1,
      board: 1,
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Server error fetching matches." });
  }
};

export const updateMatchResult = async (req: Request, res: Response) => {
  try {
    const { id, matchId } = req.params;
    const { result } = req.body;
    const userId = (req as any).user._id || (req as any).user.id;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found." });
    }

    const isOrganizer = tournament.organizer.toString() === userId.toString();
    const isArbiter = tournament.arbiters?.some(
      (a) => a.toString() === userId.toString(),
    );

    if (!isOrganizer && !isArbiter) {
      return res
        .status(403)
        .json({ message: "Unauthorized. Only Arbiters can update scores." });
    }

    const validResults = ["1-0", "0-1", "1/2-1/2", "*", "BYE"];
    if (!validResults.includes(result)) {
      return res.status(400).json({ message: "Invalid match result." });
    }

    const match = await Match.findOneAndUpdate(
      { _id: matchId, tournament: id },
      { result },
      { new: true },
    );

    if (!match) return res.status(404).json({ message: "Match not found." });

    res.status(200).json(match);
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ message: "Server error updating match." });
  }
};

export const getMyGames = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;

    const matches = await Match.find({
      $or: [{ whitePlayer: userId }, { blackPlayer: userId }],
    })

      .populate("whitePlayer", "name rating title")
      .populate("blackPlayer", "name rating title")
      .sort({ createdAt: -1 });
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching user games:", error);
    res.status(500).json({ message: "Server error fetching your games." });
  }
};
