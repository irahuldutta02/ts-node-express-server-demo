import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        fullName: string;
        username: string;
        gender: string;
        profilePic: string;
      };
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized, Token Not Found",
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized, Token Invalid",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        gender: true,
        profilePic: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized, User Not Found",
      });
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.error("Error in protectRoute : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export { protectRoute };
