import { Router } from "express";
import { createLenderProductSchema } from "../../schemas/lenderProduct.schema.js";
import { lenderService } from "../../services/lenderService.js";

const router = Router();

/**
 * GET /api/lender-products
 * Lists available lender products.
 */
router.get("/", async (_req, res) => {
  const products = await lenderService.listProducts();
  res.json({ products });
});

/**
 * POST /api/lender-products
 * Creates a new lender product definition.
 */
router.post("/", async (req, res) => {
  try {
    const payload = createLenderProductSchema.parse(req.body);
    const product = await lenderService.createProduct(payload);
    res.status(201).json({ product });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create lender product",
      error: (error as Error).message
    });
  }
});

export default router;
