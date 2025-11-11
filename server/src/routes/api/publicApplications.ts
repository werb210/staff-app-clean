import { Router } from "express";
const router = Router();
const publicApps: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(publicApps)));

router.post("/", (req, res) => {
  const id = `PUB-${Date.now()}`;
  publicApps[id] = req.body;
  res.status(201).json(publicApps[id]);
});

export default router;
