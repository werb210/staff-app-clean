import { Router } from "express";
const router = Router();
const messages: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(messages)));

router.post("/", (req, res) => {
  const id = `SMS-${Date.now()}`;
  messages[id] = req.body;
  res.status(201).json(messages[id]);
});

export default router;
