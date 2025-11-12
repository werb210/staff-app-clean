import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const CallDirectionSchema = z.enum(["incoming", "outgoing"]);
export const CallStatusSchema = z.enum([
  "initiated",
  "queued",
  "ringing",
  "in-progress",
  "completed",
  "failed",
  "canceled",
  "busy",
  "no-answer",
]);

export const CallTimelineEventSchema = z.object({
  id: uuidSchema,
  callId: uuidSchema,
  contactId: uuidSchema,
  event: z.enum(["initiated", "ringing", "in-progress", "completed", "failed"]),
  description: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
});

export type CallTimelineEvent = z.infer<typeof CallTimelineEventSchema>;

export const CallRecordSchema = z.object({
  id: uuidSchema,
  contactId: uuidSchema,
  to: z.string().min(1),
  from: z.string().min(1),
  direction: CallDirectionSchema,
  status: CallStatusSchema,
  duration: z.number().nonnegative(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  providerSid: z.string().optional(),
  initiatedBy: z.string().optional(),
  context: z.string().optional(),
  timeline: z.array(CallTimelineEventSchema),
});

export type CallRecord = z.infer<typeof CallRecordSchema>;
