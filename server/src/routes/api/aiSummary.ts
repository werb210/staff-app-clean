import { Router } from "express";
const router = Router();
const summaries: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(summaries)));

router.post("/", (req, res) => {
  const id = `AI-${Date.now()}`;
  summaries[id] = req.body;
  res.status(201).json(summaries[id]);
});

export default router;
