import { Request, Response } from "express";
import {
  loginUser,
  getUserById,
  createUser as createUserService,
} from "../services/authService.js";

import { sanitizeUser } from "../utils/sanitizeUser.js";

/**
 * POST /auth/login
 */
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

    // Always sanitize the user before returning
    const publicUser = sanitizeUser({
      id: user.id,
      email: user.email,
      role: user.role,
      silos: user.silos,
      name: user.name ?? "Unnamed User",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return res.json(publicUser);
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /auth/me
 */
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

    const publicUser = sanitizeUser({
      id: user.id,
      email: user.email,
      role: user.role,
      silos: user.silos,
      name: user.name ?? "Unnamed User",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return res.json(publicUser);
  } catch (err: any) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /auth/users
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, password, role, silos, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const safeName =
      typeof name === "string" && name.trim().length > 0
        ? name.trim()
        : "Unnamed User";

    const newUser = await createUserService({
      email,
      password,
      role: role || "staff",
      silos: silos || [],
      name: safeName,
    });

    const publicUser = sanitizeUser({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      silos: newUser.silos,
      name: newUser.name ?? safeName,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    return res.status(201).json(publicUser);
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
