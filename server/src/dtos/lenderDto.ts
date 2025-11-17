// server/src/dtos/lenderDto.ts
import { z } from "zod";

export const lenderDto = z.object({
  name: z.string(),
  country: z.string(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

export type LenderDto = z.infer<typeof lenderDto>;
