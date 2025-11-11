import { Router } from "express";
const router = Router();

// GET stub
router.get("/", (_req, res) => {
  res.json({ message: "OK" });
});

// POST real
router.post("/", (req, res) => {
  const document = req.body;
  // TODO: Add validation, save to DB or storage, link to application
  res.json({ message: "Document received", data: document });
});

export default router;
