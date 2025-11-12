import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const SMSDirectionSchema = z.enum(["incoming", "outgoing"]);
export const SMSDeliveryStatusSchema = z.enum(["queued", "sent", "failed"]);

export const SMSMessageSchema = z.object({
  id: uuidSchema,
  contactId: uuidSchema,
  to: z.string().min(1),
  from: z.string().min(1),
  message: z.string().min(1),
  direction: SMSDirectionSchema,
  status: SMSDeliveryStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  providerSid: z.string().optional(),
  sentBy: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type SMSMessage = z.infer<typeof SMSMessageSchema>;

export const SMSThreadSchema = z.object({
  contactId: uuidSchema,
  lastMessageAt: z.string().datetime({ offset: true }).nullable(),
  messages: z.array(SMSMessageSchema),
});

export type SMSThread = z.infer<typeof SMSThreadSchema>;
