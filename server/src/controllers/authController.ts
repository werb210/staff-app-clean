import { Request, Response } from "express";
import {
  loginUser,
  getUserById,
  createUser,
} from "../services/authService.js";
import { sanitizeUser } from "../utils/env.js";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await loginUser(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json(sanitizeUser(user));
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(sanitizeUser(user));
  } catch (err: any) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role, silos, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const newUser = await createUser({
      email,
      password,
      role: role || "staff",
      silos: silos || [],
      name: name || null, // name is optional
    });

    return res.status(201).json(sanitizeUser(newUser));
  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default {
  login,
  getProfile,
  register,
};
