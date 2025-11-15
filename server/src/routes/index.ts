import { Router } from "express";

// Middleware
import authMiddleware from "../middlewares/auth.js";
import siloGuard from "../middlewares/siloGuard.js";

// Routers
import aiRouter from "./ai.routes.js";
import applicationsRouter from "./applications.routes.js";
import authRouter from "./auth.js";
import communicationRouter from "./communication.js";
import companiesRouter from "./companies.js";
import contactsRouter from "./contacts.js";
import dealsRouter from "./deals.js";
import documentsRouter from "./documents.js";
import lendersRouter from "./lenders.routes.js";
import notificationsRouter from "./notifications.routes.js";
import pipelineRouter from "./pipeline.routes.js";

const router = Router();

/**
 * PUBLIC ROUTES (NO AUTH)
 */
router.use("/auth", authRouter);

/**
 * AUTHENTICATED ROUTES
 */
router.use(authMiddleware);

/**
 * TOP-LEVEL ROUTES (NO SILO)
 */
router.use("/ai", aiRouter);
router.use("/applications", applicationsRouter);
router.use("/communication", communicationRouter);
router.use("/companies", companiesRouter);
router.use("/contacts", contactsRouter);
router.use("/deals", dealsRouter);
router.use("/documents", documentsRouter);
router.use("/lenders", lendersRouter);
router.use("/notifications", notificationsRouter);
router.use("/pipeline", pipelineRouter);

/**
 * SILO ROUTES (BF / SLF)
 * Mounted exactly once — no duplicates.
 */
router.use("/:silo/applications", siloGuard, applicationsRouter);
router.use("/:silo/documents", siloGuard, documentsRouter);
router.use("/:silo/pipeline", siloGuard, pipelineRouter);
router.use("/:silo/lenders", siloGuard, lendersRouter);
router.use("/:silo/notifications", siloGuard, notificationsRouter);
router.use("/:silo/communication", siloGuard, communicationRouter);

export default router;
