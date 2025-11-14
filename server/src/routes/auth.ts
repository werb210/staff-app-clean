import { Router } from "express";
import type { Silo } from "@prisma/client";

import { authenticate, createUser } from "../auth/authService.js";
import { requireAuth, requireRole } from "../auth/authMiddleware.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authenticate(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/users",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const { email, password, roles = [], silos = [] } = req.body ?? {};
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      if (!Array.isArray(roles) || !Array.isArray(silos)) {
        return res
          .status(400)
          .json({ error: "Roles and silos must be arrays" });
      }

      const normalizedSilos = (silos as (Silo | string)[]).map(
        (silo) => silo as Silo
      );

      const user = await createUser({
        email,
        password,
        roles: roles.map(String),
        silos: normalizedSilos,
      });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
