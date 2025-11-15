import { Router } from "express";

// Middleware
import authMiddleware from "../middlewares/auth";
import siloGuard from "../middlewares/siloGuard";

// Routers (all valid, all using .ts internally)
import aiRouter from "./ai.routes";
import applicationsRouter from "./applications.routes";
import authRouter from "./auth";
import communicationRouter from "./communication";
import companiesRouter from "./companies";
import contactsRouter from "./contacts";
import dealsRouter from "./deals";
import documentsRouter from "./documents";
import lendersRouter from "./lenders.routes";
import notificationsRouter from "./notifications.routes";
import pipelineRouter from "./pipeline.routes"; // correct modern pipeline router

const router = Router();

/**
 * PUBLIC ROUTES
 */
router.use("/auth", authRouter);

/**
 * AUTHENTICATED ROUTES
 */
router.use(authMiddleware);

/**
 * TOP-LEVEL ROUTES (NO SILO REQUIRED)
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
 * SILO ROUTES (SLF / BF)
 */
router.use("/:silo", siloGuard, applicationsRouter);
router.use("/:silo", siloGuard, documentsRouter);
router.use("/:silo", siloGuard, pipelineRouter);
router.use("/:silo", siloGuard, lendersRouter);
router.use("/:silo", siloGuard, notificationsRouter);
router.use("/:silo", siloGuard, communicationRouter);

export default router;
