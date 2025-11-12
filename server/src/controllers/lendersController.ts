import type { Request, Response } from "express";
import { z } from "zod";
import {
  create,
  getAll,
  remove,
  update,
} from "../services/lendersService.js";

const LenderPayloadSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(2),
  minAmount: z.number().nonnegative(),
  maxAmount: z.number().positive(),
  productType: z.string().min(1),
  interestRate: z.number().min(0),
  requirements: z.record(z.any()).optional(),
});

export const getLenders = (_req: Request, res: Response) => {
  const lenders = getAll();
  res.json({ data: lenders });
};

export const createLender = (req: Request, res: Response) => {
  const parsed = LenderPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid lender payload" });
  }
  const lender = create(parsed.data);
  res.status(201).json({ data: lender });
};

export const updateLender = (req: Request, res: Response) => {
  const parsed = LenderPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid lender payload" });
  }
  try {
    const lender = update(req.params.id, parsed.data);
    return res.json({ data: lender });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const deleteLender = (req: Request, res: Response) => {
  try {
    remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};
