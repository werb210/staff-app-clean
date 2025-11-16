// server/src/routes/index.ts
import { Router } from "express";

import health from "./health.routes.js";
import auth from "./auth.routes.js";
import applications from "./applications.routes.js";

const router = Router();

router.use("/health", health);
router.use("/auth", auth);
router.use("/applications", applications);

export default router;
