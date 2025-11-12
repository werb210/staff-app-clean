import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const TemplateTypeSchema = z.enum(["sms", "email"]);

export const MessageTemplateSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  type: TemplateTypeSchema,
  content: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type MessageTemplate = z.infer<typeof MessageTemplateSchema>;

export const MessageTemplateCreateSchema = MessageTemplateSchema.pick({
  name: true,
  type: true,
  content: true,
});

export const MessageTemplateUpdateSchema = MessageTemplateCreateSchema.partial();
