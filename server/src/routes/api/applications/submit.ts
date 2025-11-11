import { Router } from "express";
const router = Router();
const submittedApps: Record<string, any> = {};

router.post("/", (req, res) => {
  const id = req.body.id ?? `SUB-${Date.now()}`;
  submittedApps[id] = req.body;
  res.status(200).json({ message: "Submitted", id });
});

router.get("/", (_req, res) => {
  res.json(Object.values(submittedApps));
});

export default router;
