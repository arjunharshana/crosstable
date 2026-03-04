import { Request, Response } from "express";
import { Activity, Notification } from "../models/activity";
import Tournament from "../models/tournament";

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;

    const userTournaments = await Tournament.find({
      $or: [
        { organizer: userId },
        { arbiters: userId },
        { "participants.user": userId },
      ],
    }).select("_id");

    const tournamentIds = userTournaments.map((t) => t._id);

    const activities = await Activity.find({
      $or: [{ tournament: { $in: tournamentIds } }, { user: userId }],
    })
      .populate("user", "username firstName lastName")
      .populate("tournament", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Server error fetching activity feed" });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;

    const notifications = await Notification.find({ recipient: userId })
      .populate("relatedTournament", "name")
      .sort({ isRead: 1, createdAt: -1 })
      .limit(10);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    console.error("Error updating notification:", err);
    res
      .status(500)
      .json({ message: "Server error marking notification as read" });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } },
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications read:", err);
    res.status(500).json({ message: "Server error marking all as read" });
  }
};
