import { Router } from "express";
const router = Router();
const products: Record<string, any> = {};

router.get("/", (_req, res) => res.json(Object.values(products)));

router.post("/", (req, res) => {
  const id = `LP-${Date.now()}`;
  products[id] = req.body;
  res.status(201).json(products[id]);
});

export default router;
