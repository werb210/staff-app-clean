import { Router } from "express";
const router = Router();
const automation: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(automation)));

router.post("/", (req, res) => {
  const id = `AUTO-${Date.now()}`;
  automation[id] = req.body;
  res.status(201).json(automation[id]);
});

export default router;
