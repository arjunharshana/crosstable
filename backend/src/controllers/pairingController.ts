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

    if (!tournament)
      return res
        .status(404)
        .json({ message: "Tournament not found or unauthorized." });
    if (tournament.status !== "Upcoming")
      return res
        .status(400)
        .json({ message: "Tournament has already started." });
    if (tournament.participants.length < 2)
      return res.status(400).json({ message: "Need at least 2 players." });

    switch (tournament.format) {
      case "Round Robin":
      case "Double Round Robin":
        return await handleRoundRobin(tournament, res);

      case "Knockout":
        return await handleKnockout(tournament, res);

      case "Swiss":
        return await handleSwiss(tournament, res);

      default:
        return res
          .status(400)
          .json({ message: "Unsupported tournament format." });
    }
  } catch (error) {
    console.error("Error starting tournament:", error);
    res.status(500).json({ message: "Server error starting tournament." });
  }
};

const handleRoundRobin = async (tournament: any, res: Response) => {
  const isDoubleRR = tournament.format === "Double Round Robin";
  const participantIds = tournament.participants.map((p: any) =>
    p._id.toString(),
  );

  const pairings = generateRoundRobinPairings(participantIds, isDoubleRR);

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

    return {
      tournament: tournament._id,
      round: match.round,
      board: match.boardNumber,
      whitePlayer: match.white,
      blackPlayer: match.black,
      result: "*",
    };
  });

  // Save Matches
  await Match.insertMany(matchDocuments);

  // Update Tournament State
  tournament.status = "Ongoing";
  const baseRounds =
    participantIds.length % 2 === 0
      ? participantIds.length - 1
      : participantIds.length;

  tournament.totalRounds = isDoubleRR ? baseRounds * 2 : baseRounds;
  await tournament.save();

  // Log Activity
  await Activity.create({
    type: "TOURNAMENT_STARTED",
    user: tournament.organizer,
    tournament: tournament._id,
    message: `Started Round 1 of ${tournament.name}`,
  });

  return res.status(200).json({
    message: `${tournament.format} started successfully!`,
    matchesGenerated: matchDocuments.length,
    totalRounds: tournament.totalRounds,
  });
};

const handleKnockout = async (tournament: any, res: Response) => {
  return res.status(501).json({ message: "Knockout engine coming soon!" });
};

const handleSwiss = async (tournament: any, res: Response) => {
  return res.status(501).json({ message: "Swiss engine coming soon!" });
};
