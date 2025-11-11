import { Router } from "express";
const router = Router();

// GET stub
router.get("/", (_req, res) => {
  res.json({ message: "OK" });
});

// POST real
router.post("/", (req, res) => {
  const application = req.body;
  // TODO: Add validation, persistence (DB), and business logic
  res.json({ message: "Application received", data: application });
});

export default router;
