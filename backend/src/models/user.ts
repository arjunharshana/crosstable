import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto-js";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;

  chesscomUsername?: string;
  fideId?: string;
  isVerified?: boolean;
  verificationOTP?: string;
  otpExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  stats: {
    tournamentsPlayed: number;
    tournamentsWon: number;
    gamesPlayed: number;
    gamesWon: number;
  };
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    chesscomUsername: { type: String },
    fideId: { type: String },
    stats: {
      tournamentsPlayed: { type: Number, default: 0 },
      tournamentsWon: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
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
