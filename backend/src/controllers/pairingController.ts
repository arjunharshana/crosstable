import { Request, Response } from "express";
import Tournament from "../models/tournament";
import Match from "../models/match";
import { Activity } from "../models/activity";
import { generateRoundRobinPairings } from "../utils/roundRobin";

export const startTournament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizerId = (req as any).user._id || (req as any).user.id;

    const tournament = await Tournament.findOne({
      _id: id,
      organizer: organizerId,
    });

    if (!tournament) {
      return res
        .status(404)
        .json({ message: "Tournament not found or unauthorized." });
    }

    if (tournament.status !== "Upcoming") {
      return res
        .status(400)
        .json({ message: "Tournament has already started or completed." });
    }

    if (tournament.participants.length < 2) {
      return res
        .status(400)
        .json({ message: "Need at least 2 players to start a tournament." });
    }

    if (tournament.format !== "Round Robin") {
      return res.status(400).json({
        message: "The pairing engine currently only supports Round Robin.",
      });
    }

    const participantIds = tournament.participants.map((p: any) =>
      p._id.toString(),
    );

    const pairings = generateRoundRobinPairings(participantIds);

    const matchDocuments = pairings.map((match) => {
      if (match.isBye) {
        const realPlayerId = match.white === "BYE" ? match.black : match.white;
        return {
          tournament: tournament._id,
          round: match.round,
          board: match.boardNumber,
          whitePlayer: realPlayerId,
          blackPlayer: null,
          result: "BYE",
        };
      }

      // Handle normal matches
      return {
        tournament: tournament._id,
        round: match.round,
        board: match.boardNumber,
        whitePlayer: match.white,
        blackPlayer: match.black,
        result: "*",
      };
    });

    await Match.insertMany(matchDocuments);

    tournament.status = "Ongoing";

    tournament.totalRounds =
      participantIds.length % 2 === 0
        ? participantIds.length - 1
        : participantIds.length;

    await tournament.save();

    await Activity.create({
      type: "TOURNAMENT_STARTED",
      user: organizerId,
      tournament: tournament._id,
      message: `Started Round 1 of ${tournament.name}`,
    });

    res.status(200).json({
      message: "Tournament started successfully!",
      matchesGenerated: matchDocuments.length,
      totalRounds: tournament.totalRounds,
    });
  } catch (error) {
    console.error("Error starting tournament:", error);
    res.status(500).json({ message: "Server error starting tournament." });
  }
};
