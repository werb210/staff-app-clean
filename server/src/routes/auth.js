// routes/auth.js
// ---------------------------------------------------------
// Authentication Routes
// Mounted at: /api/auth
// ---------------------------------------------------------

import { Router } from "express";
import {
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/index.js";

const router = Router();

// Public route
router.post("/login", login);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;
