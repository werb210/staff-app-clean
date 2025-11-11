import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.json([{ lenderId: "1", funded: true }]);
});

export default router;
