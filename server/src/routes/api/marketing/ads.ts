import { Router } from "express";
const router = Router();
const ads: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(ads)));

router.post("/", (req, res) => {
  const id = `AD-${Date.now()}`;
  ads[id] = req.body;
  res.status(201).json(ads[id]);
});

export default router;
