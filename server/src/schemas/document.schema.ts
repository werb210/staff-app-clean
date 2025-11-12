import { z } from "zod";

export const DocumentStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "processing",
  "review",
]);

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  name: z.string().min(1),
  fileName: z.string().min(1),
  category: z.string().min(1),
  mimeType: z.string().min(1),
  blobName: z.string().min(1),
  fileSize: z.number().int().nonnegative(),
  checksum: z.string().min(1),
  version: z.number().int().positive(),
  status: DocumentStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  ocrTextPreview: z.string().optional(),
});

export const DocumentWithVersionsSchema = DocumentSchema.extend({
  versions: z.array(
    z.object({
      id: z.string().uuid(),
      documentId: z.string().uuid(),
      blobName: z.string().min(1),
      mimeType: z.string().min(1),
      fileSize: z.number().int().nonnegative(),
      checksum: z.string().min(1),
      version: z.number().int().positive(),
      createdAt: z.string().datetime({ offset: true }),
    }),
  ),
});

export const DocumentUploadMetadataSchema = z.object({
  applicationId: z.string().uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
});

export const DocumentReuploadSchema = DocumentUploadMetadataSchema.pick({ category: true });

export const DocumentMetadataSchema = DocumentWithVersionsSchema;

export const DocumentUploadSchema = z.object({
  applicationId: z.string().uuid(),
  documentId: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  note: z.string().optional(),
  uploadedBy: z.string().optional(),
});

export const DocumentStatusResponseSchema = z.object({
  id: z.string().uuid(),
  status: DocumentStatusSchema,
  version: z.number().int().positive(),
  lastUpdatedAt: z.string().datetime({ offset: true }),
});

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type DocumentWithVersions = z.infer<typeof DocumentWithVersionsSchema>;
export type DocumentUploadMetadata = z.infer<typeof DocumentUploadMetadataSchema>;
export type DocumentReuploadInput = z.infer<typeof DocumentReuploadSchema>;
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
export type DocumentUpload = z.infer<typeof DocumentUploadSchema>;
export type DocumentStatusResponse = z.infer<typeof DocumentStatusResponseSchema>;
