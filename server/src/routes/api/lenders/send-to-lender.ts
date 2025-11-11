import { Router } from "express";
const router = Router();

router.post("/", (_req, res) => {
  res.json({ message: "Sent to lender" });
});

export default router;
