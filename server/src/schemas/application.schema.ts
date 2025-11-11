import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const ApplicationStatusSchema = z.enum([
  "draft",
  "submitted",
  "review",
  "approved",
  "completed",
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const ApplicationSchema = z.object({
  id: uuidSchema,
  applicantName: z.string().min(1),
  productId: uuidSchema,
  status: ApplicationStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const ApplicationCreateSchema = z.object({
  applicantName: z.string().min(1),
  productId: uuidSchema,
  status: ApplicationStatusSchema.optional(),
});

export type ApplicationCreateInput = z.infer<typeof ApplicationCreateSchema>;

export const ApplicationStatusUpdateSchema = z.object({
  id: uuidSchema,
  status: ApplicationStatusSchema,
});

export const ApplicationSubmitSchema = z.object({
  id: uuidSchema,
  submittedBy: z.string().min(1),
});

export const ApplicationCompleteSchema = z.object({
  id: uuidSchema,
  completedBy: z.string().min(1),
});
