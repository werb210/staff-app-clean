import { Router } from "express";
import { requireAuth } from "../auth/authMiddleware.js";
import {
  getApplicationsForSilos,
  getApplicationSafe,
  moveApplicationToStage,
} from "../pipeline/pipelineService.js";

const router = Router();

/* ---------------------------------------------------------
   GET ALL APPLICATIONS (for the user's silos only)
--------------------------------------------------------- */
router.get("/", requireAuth, async (req, res) => {
  // @ts-ignore
  const silos = req.user.silos;

  const apps = await getApplicationsForSilos(silos);
  return res.json(apps);
});

/* ---------------------------------------------------------
   GET SINGLE APPLICATION (silo-locked)
--------------------------------------------------------- */
router.get("/:id", requireAuth, async (req, res) => {
  // @ts-ignore
  const silos = req.user.silos;

  const app = await getApplicationSafe(req.params.id, silos);
  if (!app) return res.status(404).json({ error: "Not found or silo blocked" });

  return res.json(app);
});

/* ---------------------------------------------------------
   MOVE APPLICATION TO A NEW STAGE
--------------------------------------------------------- */
router.post("/:id/move", requireAuth, async (req, res) => {
  // @ts-ignore
  const silos = req.user.silos;

  const { stage } = req.body;

  const app = await getApplicationSafe(req.params.id, silos);
  if (!app) return res.status(404).json({ error: "Not found or silo blocked" });

  const updated = await moveApplicationToStage(req.params.id, stage);
  return res.json(updated);
});

export default router;
