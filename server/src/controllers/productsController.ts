// server/src/controllers/productsController.ts

import { Request, Response } from "express";
import * as productsRepo from "../db/repositories/products.repo";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";

const productSchema = z.object({
  lenderId: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  interestRate: z.number().optional(),
  terms: z.string().optional(),
});

export const listProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await productsRepo.getAllProducts();
  res.json({ success: true, data: products });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await productsRepo.getProductById(id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const parsed = productSchema.parse(req.body);
  const created = await productsRepo.createProduct(parsed);
  res.status(201).json({ success: true, data: created });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parsed = productSchema.partial().parse(req.body);

  const updated = await productsRepo.updateProduct(id, parsed);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: updated });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const deleted = await productsRepo.deleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: true });
});
