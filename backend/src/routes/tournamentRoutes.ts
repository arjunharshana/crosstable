import express from "express";
import {
  createTournament,
  getAllTournaments,
  updateTournament,
  deleteTournament,
  getTournamentById,
  joinTournament,
  addPlayerManually,
  removePlayerManually,
  addArbiter,
  removeArbiter,
} from "../controllers/tournamentController";

import {
  startTournament,
  advanceTournamentRound,
} from "../controllers/pairingController";
import authMiddleware from "../middleware/authMiddleware";
import {
  getTournamentMatches,
  updateMatchResult,
} from "../controllers/matchController";

const router = express.Router();

router.post("/", authMiddleware, createTournament);
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);
router.put("/:id", authMiddleware, updateTournament);
router.delete("/:id", authMiddleware, deleteTournament);
router.post("/:id/join", authMiddleware, joinTournament);
router.post("/:id/add-arbiter", authMiddleware, addArbiter);
router.post("/:id/add-player", authMiddleware, addPlayerManually);
router.delete(
  "/:id/remove-player/:participantId",
  authMiddleware,
  removePlayerManually,
);
router.delete("/:id/remove-arbiter/:arbiterId", authMiddleware, removeArbiter);

// Pairing routes
router.post("/:id/start", authMiddleware, startTournament);
router.post("/:id/advance", authMiddleware, advanceTournamentRound);

// Match routes
router.get("/:id/matches", authMiddleware, getTournamentMatches);
router.put("/:id/matches/:matchId", authMiddleware, updateMatchResult);
export default router;
