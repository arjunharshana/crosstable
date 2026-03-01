import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";

dotenv.config();

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
