import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.json({ ok: true, ts: Date.now() });
});

router.get("/ping", (_, res) => {
  res.json({ ok: true, msg: "pong" });
});

export default router;
