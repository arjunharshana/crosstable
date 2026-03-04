import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  getRecentActivity,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/activityController";

const router = express.Router();

router.get("/feed", authMiddleware, getRecentActivity);

router.get("/notifications", authMiddleware, getUserNotifications);
router.patch("/notifications/:id/read", authMiddleware, markNotificationRead);
router.patch(
  "/notifications/read-all",
  authMiddleware,
  markAllNotificationsRead,
);

export default router;
