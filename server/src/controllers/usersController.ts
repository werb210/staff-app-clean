// server/src/controllers/usersController.ts

import { Request, Response } from "express";
import * as usersRepo from "../db/repositories/users.repo";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "staff", "marketing", "lender", "referrer"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await usersRepo.getAllUsers();
  res.json({ success: true, data: users });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await usersRepo.getUserById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createUserSchema.parse(req.body);
  const user = await usersRepo.createUser(parsed);
  res.status(201).json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parsed = createUserSchema.partial().parse(req.body);

  const updated = await usersRepo.updateUser(id, parsed);
  if (!updated) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, data: updated });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const deleted = await usersRepo.deleteUser(id);
  if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, data: true });
});
