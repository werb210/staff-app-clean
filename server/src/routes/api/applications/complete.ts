import { Router } from "express";
const router = Router();

router.post("/", (_req, res) => {
  res.json({ message: "Application marked complete" });
});

export default router;
