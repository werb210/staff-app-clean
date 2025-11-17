// server/src/dtos/userDto.ts
import { z } from "zod";

export const userDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "staff", "lender", "referrer"]).optional(),
});

export type UserDto = z.infer<typeof userDto>;
