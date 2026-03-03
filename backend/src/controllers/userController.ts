import { Request, Response } from "express";
import User from "../models/user";
import axios from "axios";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select(
      "-password -verificationOTP -otpExpiry -passwordResetToken -passwordResetExpires",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, bio, country, chesscomUsername, fideId } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      (req as any).user.id,
      {
        $set: {
          firstName,
          lastName,
          bio,
          country,
          fideId,
          chesscomUsername,
        },
      },
      { new: true, runValidators: true },
    ).select(
      "-password -verificationOTP -otpExpiry -passwordResetToken -passwordResetExpires",
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "username firstName lastName country fideId isFideVerified ratings stats createdAt",
    );

    if (!user) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get Public Profile Error:", error);
    res.status(500).json({ message: "Server error fetching player" });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") return res.status(200).json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    })
      .select("_id username firstName lastName")
      .limit(5);

    res.status(200).json(users);
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ message: "Server error searching users" });
  }
};
