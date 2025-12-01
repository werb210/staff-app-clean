// server/src/controllers/authController.ts

import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import * as usersRepo from "../db/repositories/users.repo";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await usersRepo.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken;
  if (!token) return res.status(400).json({ success: false, message: "Missing refresh token" });

  const decoded = verifyRefreshToken(token);
  if (!decoded) return res.status(401).json({ success: false, message: "Invalid refresh token" });

  const user = await usersRepo.getUserById(decoded.id);
  if (!user) return res.status(401).json({ success: false, message: "User not found" });

  const newAccessToken = signAccessToken(user);

  res.json({
    success: true,
    data: { accessToken: newAccessToken },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out" });
});
