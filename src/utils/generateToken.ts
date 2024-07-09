import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/server.config";

export const generateToken = (userId: String, res: Response) => {
  const token = jwt.sign({ userId }, JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};
