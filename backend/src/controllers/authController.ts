import { Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User from "../models/user";
import generateToken from "../utils/generateToken";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/sendEmail";
import crypto from "crypto";
import dotenv from "dotenv";

const RegisterUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password } = req.body;
  const lowerEmail = email.toLowerCase().trim();

  try {
    let user = await User.findOne({ email: lowerEmail });

    if (user) {
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "User already exists and is verified." });
      }
    } else {
      const existingUsername = await User.findOne({
        username: username.trim(),
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: lowerEmail,
        password: hashedPassword,
        isVerified: false,
      });
    }

    const otp = await sendVerificationEmail(firstName, lowerEmail);
    user.verificationOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save();

    res
      .status(200)
      .json({ message: "Registration successful. Please verify your email." });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const VerifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const lowerEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email is already verified. Please log in." });
    }

    if (
      user.verificationOTP === otp &&
      user.otpExpiry &&
      user.otpExpiry > new Date()
    ) {
      user.isVerified = true;
      user.verificationOTP = undefined;
      user.otpExpiry = undefined;

      await user.save();

      const token = generateToken(res, user.id);

      res.status(200).json({
        message: "Email verified successfully.",
        token,
        user: {
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Server error during verification." });
  }
};

const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(res, user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const logoutUser = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully" });
};

const ResendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const otp = await sendVerificationEmail(user.username, email);
    user.verificationOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.status(200).json({
      message: "OTP resent successfully",
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.username, email, resetToken);

    res.status(200).json({
      message: "Password reset email sent successfully",
      id: user.id,
      name: user.username,
      email: user.email,
    });
  } catch (error) {
    const userToClear = await User.findOne({ email });
    if (userToClear) {
      userToClear.passwordResetToken = undefined;
      userToClear.passwordResetExpires = undefined;
      await userToClear.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};
const ResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(user.username, email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};

//chesscom oauth routes
const chesscomOAuthInitiate = (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "User ID is required to link an account." });
  }

  const clientId = process.env.CHESSCOM_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.CHESSCOM_REDIRECT_URI as string,
  );

  const authUrl = `https://chess.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${userId}`;

  res.redirect(authUrl);
};

const chesscomOAuthCallback = async (req: Request, res: Response) => {
  // Chess.com hands back the code AND the state (which is our userId)
  const { code, state } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!code || !state) {
    return res.redirect(`${frontendUrl}/settings?error=Authorization_Failed`);
  }

  const userId = state as string;

  try {
    const tokenResponse = await axios.post(
      "https://chess.com/oauth/token",
      {
        grant_type: "authorization_code",
        code: code as string,
        client_id: process.env.CHESSCOM_CLIENT_ID,
        client_secret: process.env.CHESSCOM_CLIENT_SECRET,
        redirect_uri: process.env.CHESSCOM_REDIRECT_URI,
      },
      { headers: { "Content-Type": "application/json" } },
    );

    const accessToken = tokenResponse.data.access_token;

    const profileResponse = await axios.get("https://api.chess.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const chessData = profileResponse.data;
    const chessUsername = chessData.username;

    const user = await User.findById(userId);

    if (!user) {
      return res.redirect(`${frontendUrl}/settings?error=User_Not_Found`);
    }

    const existingLink = await User.findOne({
      chesscomUsername: chessUsername,
    });
    if (existingLink && existingLink._id.toString() !== userId) {
      return res.redirect(
        `${frontendUrl}/settings?error=Chess_Account_Already_Linked_To_Another_User`,
      );
    }

    user.chesscomUsername = chessUsername;
    await user.save();

    res.redirect(`${frontendUrl}/settings?success=chesscom_linked`);
  } catch (error) {
    console.error("Chess.com OAuth Linking Error:", error);
    res.redirect(`${frontendUrl}/settings?error=OAuth_Failed`);
  }
};

export {
  RegisterUser,
  VerifyEmail,
  LoginUser,
  logoutUser,
  ResendVerificationEmail,
  forgotPassword,
  ResetPassword,
  chesscomOAuthInitiate,
  chesscomOAuthCallback,
};
