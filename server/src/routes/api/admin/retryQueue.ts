import { Router } from "express";
const router = Router();
const queue: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(queue)));

router.post("/", (req, res) => {
  const id = `RQ-${Date.now()}`;
  queue[id] = req.body;
  res.status(201).json(queue[id]);
});

export default router;
