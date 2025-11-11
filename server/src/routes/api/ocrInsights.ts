import { Router } from "express";
const router = Router();
const ocrData: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(ocrData)));

router.post("/", (req, res) => {
  const id = `OCR-${Date.now()}`;
  ocrData[id] = req.body;
  res.status(201).json(ocrData[id]);
});

export default router;
