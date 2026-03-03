import express from "express";
import {
  getProfile,
  updateProfile,
  getPublicProfile,
  searchUsers,
} from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/search", searchUsers);
//Public profile route
router.get("/:username", getPublicProfile);

export default router;
