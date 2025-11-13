// server/src/controllers/lenderProductController.ts
import type { Request, Response } from "express";
import {
  LenderProductCreateSchema,
  LenderProductUpdateSchema,
} from "../schemas/lenderProduct.schema.js";

import {
  lenderService,
  type LenderServiceType,
} from "../services/lenderService.js";

/* ---------------------------------------------------------
   Shared service instance
--------------------------------------------------------- */
const service: LenderServiceType = lenderService;

/* ---------------------------------------------------------
   LIST PRODUCTS
--------------------------------------------------------- */
export const listProducts = (_req: Request, res: Response) => {
  const products = service.listProducts();
  res.json({ data: products });
};

/* ---------------------------------------------------------
   CREATE PRODUCT
--------------------------------------------------------- */
export const createProduct = (req: Request, res: Response) => {
  const parsed = LenderProductCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid product payload" });
  }

  const created = service.createProduct(parsed.data);
  res.status(201).json({ data: created });
};

/* ---------------------------------------------------------
   UPDATE PRODUCT
--------------------------------------------------------- */
export const updateProduct = (req: Request, res: Response) => {
  const parsed = LenderProductUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid product payload" });
  }

  try {
    const updated = service.updateProduct(req.params.id, parsed.data);
    res.json({ data: updated });
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};

/* ---------------------------------------------------------
   DELETE PRODUCT
--------------------------------------------------------- */
export const deleteProduct = (req: Request, res: Response) => {
  try {
    service.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};
