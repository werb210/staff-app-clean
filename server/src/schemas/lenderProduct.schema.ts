import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const LenderSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  contactEmail: z.string().email(),
});

export type Lender = z.infer<typeof LenderSchema>;

export const LenderProductSchema = z.object({
  id: uuidSchema,
  lenderId: uuidSchema,
  name: z.string().min(1),
  rate: z.number().nonnegative(),
});

export type LenderProduct = z.infer<typeof LenderProductSchema>;

export const LenderReportSchema = z.object({
  id: uuidSchema,
  lenderId: uuidSchema,
  applicationId: uuidSchema,
  status: z.string().min(1),
  sentAt: z.string().datetime({ offset: true }),
  products: z.number().int().nonnegative().optional(),
});

export type LenderReport = z.infer<typeof LenderReportSchema>;
