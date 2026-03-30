import { Request, Response } from "express";
import Tournament from "../models/tournament";
import Match from "../models/match";
import { Activity } from "../models/activity";
import { generateRoundRobinPairings } from "../utils/roundRobin";
import {
  generateKnockoutRoundOne,
  generateNextKnockoutRound,
} from "../utils/knockout";
import { generateSwissPairings } from "../utils/swiss";
import { calculateStandings } from "../utils/standings";

export const startTournament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizerId = (req as any).user._id || (req as any).user.id;

    const tournament = await Tournament.findOne({
      _id: id,
      organizer: organizerId,
    }).populate("participants.user", "ratings");

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

  await Match.insertMany(matchDocuments);

  tournament.status = "Ongoing";
  const baseRounds =
    participantIds.length % 2 === 0
      ? participantIds.length - 1
      : participantIds.length;

  tournament.totalRounds = isDoubleRR ? baseRounds * 2 : baseRounds;
  await tournament.save();

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
  const participantIds = tournament.participants.map((p: any) =>
    p._id.toString(),
  );

  const pairings = generateKnockoutRoundOne(participantIds);

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

  await Match.insertMany(matchDocuments);

  tournament.status = "Ongoing";

  const numPlayers = participantIds.length;
  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
  tournament.totalRounds = Math.log2(powerOfTwo);
  await tournament.save();

  await Activity.create({
    type: "TOURNAMENT_STARTED",
    user: tournament.organizer,
    tournament: tournament._id,
    message: `Started Round 1 of ${tournament.name} (Knockout)`,
  });

  return res.status(200).json({
    message: "Knockout Round 1 generated successfully!",
    matchesGenerated: matchDocuments.length,
    totalRounds: tournament.totalRounds,
  });
};

const handleSwiss = async (tournament: any, res: Response) => {
  const pairings = generateSwissPairings(
    tournament.participants,
    [],
    1,
    tournament.formatType,
  );

  const matchDocuments = pairings.map((match) => {
    if (match.isBye) {
      return {
        tournament: tournament._id,
        round: match.round,
        board: match.boardNumber,
        whitePlayer: match.white,
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

  await Match.insertMany(matchDocuments);

  tournament.status = "Ongoing";
  await tournament.save();

  await Activity.create({
    type: "TOURNAMENT_STARTED",
    user: tournament.organizer,
    tournament: tournament._id,
    message: `Started Round 1 of ${tournament.name} (Swiss)`,
  });

  return res.status(200).json({
    message: "Swiss Round 1 generated successfully!",
    matchesGenerated: matchDocuments.length,
    totalRounds: tournament.totalRounds,
  });
};

export const advanceTournamentRound = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id || (req as any).user.id;

    // Fetch tournament and populate user ratings for the Swiss engine
    const tournament = await Tournament.findById(id).populate(
      "participants.user",
      "ratings username firstName lastName",
    );
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
        .json({ message: "Unauthorized. Only Arbiters can advance rounds." });
    }

    const allMatches = await Match.find({ tournament: id }).sort({
      round: 1,
      board: 1,
    });
    if (allMatches.length === 0) {
      return res
        .status(400)
        .json({ message: "No matches found. Start the tournament first." });
    }

    const currentRound = Math.max(...allMatches.map((m) => m.round));
    const currentRoundMatches = allMatches.filter(
      (m) => m.round === currentRound,
    );

    const unfinishedMatches = currentRoundMatches.filter(
      (m) => m.result === "*",
    );
    if (unfinishedMatches.length > 0) {
      return res.status(400).json({
        message:
          "Cannot advance. All matches in the current round must be completed.",
      });
    }

    if (currentRound >= tournament.totalRounds) {
      tournament.status = "Completed";
      await tournament.save();

      await Activity.create({
        type: "TOURNAMENT_UPDATE",
        user: userId,
        tournament: tournament._id,
        message: `${tournament.name} has concluded!`,
      });

      return res.status(200).json({
        message: "Tournament completed successfully!",
        status: "Completed",
      });
    }

    const nextRoundNumber = currentRound + 1;
    let nextRoundPairings: any[] = [];

    if (tournament.format === "Knockout") {
      const drawnMatches = currentRoundMatches.filter(
        (m) => m.result === "1/2-1/2",
      );
      if (drawnMatches.length > 0) {
        return res.status(400).json({
          message:
            "Knockout matches cannot end in a draw. Please resolve tiebreaks first.",
        });
      }

      const advancingPlayers = currentRoundMatches
        .sort((a, b) => a.board - b.board)
        .map((match) => {
          if (match.result === "1-0" || match.result === "BYE")
            return match.whitePlayer.toString();
          if (match.result === "0-1") return match.blackPlayer!.toString();
          throw new Error("Invalid knockout match state.");
        });

      nextRoundPairings = generateNextKnockoutRound(
        advancingPlayers,
        nextRoundNumber,
      );
    } else if (tournament.format === "Swiss") {
      nextRoundPairings = generateSwissPairings(
        tournament.participants,
        allMatches,
        nextRoundNumber,
        tournament.formatType,
      );
    } else if (tournament.format.includes("Round Robin")) {
      return res.status(400).json({
        message:
          "Round Robin generates all matches at the start. You do not need to advance rounds manually.",
      });
    }

    const matchDocuments = nextRoundPairings.map((match) => ({
      tournament: tournament._id,
      round: match.round,
      board: match.boardNumber,
      whitePlayer: match.white,
      blackPlayer: match.black,
      result: match.isBye ? "BYE" : "*",
    }));

    matchDocuments.forEach((doc) => {
      if (doc.blackPlayer === "BYE" || doc.result === "BYE") {
        doc.blackPlayer = null as any;
        doc.result = "BYE";
      }
    });

    await Match.insertMany(matchDocuments);

    await Activity.create({
      type: "TOURNAMENT_UPDATE",
      user: userId,
      tournament: tournament._id,
      message: `Advanced to Round ${nextRoundNumber} of ${tournament.name}`,
    });

    return res.status(200).json({
      message: `Successfully generated Round ${nextRoundNumber}!`,
      matchesGenerated: matchDocuments.length,
    });
  } catch (error) {
    console.error("Error advancing tournament round:", error);
    res.status(500).json({ message: "Server error advancing tournament." });
  }
};

export const getTournamentStandings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id).populate(
      "participants.user",
      "firstName lastName username ratings",
    );

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const matches = await Match.find({
      tournament: id,
      result: { $nin: ["*", "Pending"] },
    });

    const standings = calculateStandings(
      tournament.participants,
      matches,
      tournament.formatType,
    );

    res.status(200).json(standings);
  } catch (error) {
    console.error("Error generating standings:", error);
    res.status(500).json({ message: "Server error generating standings." });
  }
};
