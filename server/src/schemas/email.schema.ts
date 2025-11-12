import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const EmailDirectionSchema = z.enum(["incoming", "outgoing"]);
export const EmailStatusSchema = z.enum(["queued", "sent", "failed"]);
export const EmailProviderSchema = z.enum(["sendgrid", "graph", "manual"]);

export const EmailMessageSchema = z.object({
  id: uuidSchema,
  contactId: uuidSchema,
  to: z.string().email(),
  from: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  direction: EmailDirectionSchema,
  status: EmailStatusSchema,
  provider: EmailProviderSchema,
  createdAt: z.string().datetime({ offset: true }),
  sentBy: z.string().optional(),
  providerMessageId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type EmailMessage = z.infer<typeof EmailMessageSchema>;

export const EmailThreadSchema = z.object({
  contactId: uuidSchema,
  lastMessageAt: z.string().datetime({ offset: true }).nullable(),
  messages: z.array(EmailMessageSchema),
});

export type EmailThread = z.infer<typeof EmailThreadSchema>;
