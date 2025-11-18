import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ error: "Invalid login" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid login" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  },

  async me(req: Request, res: Response) {
    const id = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id } });
    res.json(user);
  },
};
