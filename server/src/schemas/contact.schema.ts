import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const TimelineEventTypeSchema = z.enum([
  "call",
  "sms",
  "email",
  "note",
  "system",
]);

export const ContactSchema = z.object({
  id: uuidSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(3, "Phone must have at least 3 characters")
    .max(32)
    .optional(),
  companyName: z
    .string()
    .min(1, "Company name cannot be empty")
    .max(120)
    .optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const ContactCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(3, "Phone must have at least 3 characters")
    .max(32)
    .optional(),
  companyName: z
    .string()
    .min(1, "Company name cannot be empty")
    .max(120)
    .optional(),
});

export const ContactUpdateSchema = ContactCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided to update",
  },
);

export const TimelineEventSchema = z.object({
  id: uuidSchema,
  contactId: uuidSchema,
  type: TimelineEventTypeSchema,
  message: z.string().min(1, "Message is required"),
  createdAt: z.string().datetime({ offset: true }),
});

export type Contact = z.infer<typeof ContactSchema>;
export type ContactCreateInput = z.infer<typeof ContactCreateSchema>;
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type TimelineEventType = z.infer<typeof TimelineEventTypeSchema>;
