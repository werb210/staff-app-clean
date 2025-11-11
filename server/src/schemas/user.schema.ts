import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const UserSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "agent"]),
});

export type User = z.infer<typeof UserSchema>;
