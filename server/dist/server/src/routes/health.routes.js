import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({
    ok: true,
    status: "healthy",
    ts: Date.now(),
  });
});

export default router;
