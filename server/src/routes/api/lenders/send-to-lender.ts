import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  res.json({ message: "OK" });
});

export default router;
