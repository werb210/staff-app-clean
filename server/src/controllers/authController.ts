// server/src/controllers/authController.ts
import type { Request, Response } from "express";
import { authService } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  }),
};
