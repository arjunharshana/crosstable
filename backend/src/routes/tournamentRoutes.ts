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
} from "../controllers/tournamentController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createTournament);
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);
router.put("/:id", authMiddleware, updateTournament);
router.delete("/:id", authMiddleware, deleteTournament);
router.post("/:id/join", authMiddleware, joinTournament);
router.post("/:id/add-player", authMiddleware, addPlayerManually);
router.delete(
  "/:id/remove-player/:participantId",
  authMiddleware,
  removePlayerManually,
);

export default router;
