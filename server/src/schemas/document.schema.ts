import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";

export const DocumentStatusSchema = z.enum([
  "uploaded",
  "review",
  "approved",
  "rejected",
]);

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

export const DocumentMetadataSchema = z.object({
  id: uuidSchema,
  applicationId: uuidSchema,
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  status: DocumentStatusSchema,
  uploadedAt: z.string().datetime({ offset: true }),
});

export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;

export const DocumentUploadSchema = z.object({
  applicationId: uuidSchema,
  documentId: uuidSchema,
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

export const DocumentStatusUpdateSchema = z.object({
  id: uuidSchema,
  status: DocumentStatusSchema,
});

export const DocumentSaveSchema = z.object({
  id: uuidSchema.optional(),
  applicationId: uuidSchema,
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  status: DocumentStatusSchema.optional(),
});

export type DocumentSaveInput = z.infer<typeof DocumentSaveSchema>;
