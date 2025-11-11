import { Router } from "express";
const router = Router();
const calls: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(calls)));

router.post("/", (req, res) => {
  const id = `CALL-${Date.now()}`;
  calls[id] = req.body;
  res.status(201).json(calls[id]);
});

export default router;
