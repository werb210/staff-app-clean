// routes/index.ts
// -----------------------------------------------------
// Unified API router for silo + non-silo routes.
// All global middleware is mounted in index.ts.
// -----------------------------------------------------

import { Router } from "express";
import { authMiddleware, siloGuard } from "../middlewares/index.js";

import applications from "./applications.routes.js";
import lenders from "./lenders.routes.js";
import pipeline from "./pipeline.routes.js";
import notifications from "./notifications.routes.js";
import ai from "./ai.routes.js";

const router = Router();

// -----------------------------------------------------
// AUTH REQUIRED FOR ALL ROUTES BELOW
// -----------------------------------------------------
router.use(authMiddleware);

// -----------------------------------------------------
// SILO ROUTES: /api/:silo/*
// -----------------------------------------------------
const siloRouter = Router({ mergeParams: true });

siloRouter.use("/applications", applications);
siloRouter.use("/lenders", lenders);
siloRouter.use("/pipeline", pipeline);
siloRouter.use("/notifications", notifications);

// Example:
// /api/bf/applications
// /api/slf/lenders
router.use("/:silo", siloGuard, siloRouter);

// -----------------------------------------------------
// NON-SILO AI ROUTES (GLOBAL)
// Example: /api/ai/summarize
// -----------------------------------------------------
router.use("/ai", ai);

export default router;
