// server/src/dtos/contactDto.ts
import { z } from "zod";

export const contactDto = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  companyId: z.string().uuid().optional(),
});

export type ContactDto = z.infer<typeof contactDto>;
