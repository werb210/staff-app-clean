// server/src/dtos/companyDto.ts
import { z } from "zod";

export const companyDto = z.object({
  name: z.string(),
  legalName: z.string(),
  industry: z.string(),
  location: z.string(),
  yearsInBusiness: z.number().min(0),
});

export type CompanyDto = z.infer<typeof companyDto>;
