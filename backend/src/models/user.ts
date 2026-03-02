import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto-js";

export interface IUser extends Document {
  // Identity
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  bio?: string;
  country?: string;
  timezone?: string;

  title?:
    | "GM"
    | "IM"
    | "FM"
    | "CM"
    | "WGM"
    | "WIM"
    | "WFM"
    | "WCM"
    | "NM"
    | "None";

  chesscomUsername?: string;
  fideId?: string;
  isFideVerified: boolean;

  ratings: {
    classical: number;
    rapid: number;
    blitz: number;
  };

  stats: {
    tournamentsPlayed: number;
    tournamentsWon: number;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
  };

  isVerified: boolean;
  verificationOTP?: string;
  otpExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    bio: { type: String, maxLength: 500 },
    country: { type: String, default: "IND", uppercase: true, maxLength: 3 },
    timezone: { type: String, default: "Asia/Kolkata" },
    title: { type: String, default: "None" },

    chesscomUsername: { type: String, trim: true },
    fideId: { type: String, trim: true },
    isFideVerified: { type: Boolean, default: false },

    ratings: {
      classical: { type: Number, default: 1200 },
      rapid: { type: Number, default: 1200 },
      blitz: { type: Number, default: 1200 },
    },
    stats: {
      tournamentsPlayed: { type: Number, default: 0 },
      tournamentsWon: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      gamesDrawn: { type: Number, default: 0 },
      gamesLost: { type: Number, default: 0 },
    },

    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    otpExpiry: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
