import { Router } from "express";
import { lenderService } from "../services/lenderService.js";

const router = Router();

// Returns the roster of available lenders.
router.get("/", (_req, res) => {
  const lenders = lenderService.listLenders();
  res.json({ message: "OK", data: lenders });
});

// Returns the products offered by a specific lender.
router.get("/:id/products", (req, res) => {
  const products = lenderService.listProducts(req.params.id);
  res.json({ message: "OK", data: products });
});

export default router;
