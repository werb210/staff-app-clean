import { z } from "zod";

/* ---------------------------------------------------------------------------
   ENUMS — MUST MATCH STAFF APP + PIPELINE
--------------------------------------------------------------------------- */

export const DocumentStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "processing",
  "review",
]);

/*
Categories must match UI + pipeline filters:
- bank_statements
- financials
- government
- identification
- signed_application
- general
*/
export const DocumentCategorySchema = z.enum([
  "bank_statements",
  "financials",
  "government",
  "identification",
  "signed_application",
  "general",
]);

/* ---------------------------------------------------------------------------
   BASE DOCUMENT (single current document state)
--------------------------------------------------------------------------- */

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  name: z.string().min(1),
  fileName: z.string().min(1),
  category: DocumentCategorySchema,
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

/* ---------------------------------------------------------------------------
   VERSIONED DOCUMENT (history + rollback)
--------------------------------------------------------------------------- */

export const DocumentVersionSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  blobName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().int().nonnegative(),
  checksum: z.string().min(1),
  version: z.number().int().positive(),
  createdAt: z.string().datetime({ offset: true }),
});

export const DocumentWithVersionsSchema = DocumentSchema.extend({
  versions: z.array(DocumentVersionSchema),
});

/* ---------------------------------------------------------------------------
   DOCUMENT UPLOAD (new upload metadata)
--------------------------------------------------------------------------- */

export const DocumentUploadMetadataSchema = z.object({
  applicationId: z.string().uuid(),
  name: z.string().min(1),
  category: DocumentCategorySchema,
});

/* ---------------------------------------------------------------------------
   OPTIONAL PARTIALS
--------------------------------------------------------------------------- */

export const DocumentReuploadSchema = z.object({
  category: DocumentCategorySchema.optional(),
});

export const DocumentMetadataSchema = DocumentWithVersionsSchema;

export const DocumentUploadSchema = z.object({
  applicationId: z.string().uuid(),
  documentId: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  category: DocumentCategorySchema.optional(),
  note: z.string().optional(),
  uploadedBy: z.string().optional(),
});

/* ---------------------------------------------------------------------------
   STATUS RESPONSE
--------------------------------------------------------------------------- */

export const DocumentStatusResponseSchema = z.object({
  id: z.string().uuid(),
  status: DocumentStatusSchema,
  version: z.number().int().positive(),
  lastUpdatedAt: z.string().datetime({ offset: true }),
});

/* ---------------------------------------------------------------------------
   TYPES
--------------------------------------------------------------------------- */

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type DocumentCategory = z.infer<typeof DocumentCategorySchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type DocumentWithVersions = z.infer<typeof DocumentWithVersionsSchema>;
export type DocumentUploadMetadata = z.infer<typeof DocumentUploadMetadataSchema>;
export type DocumentReuploadInput = z.infer<typeof DocumentReuploadSchema>;
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
export type DocumentUpload = z.infer<typeof DocumentUploadSchema>;
export type DocumentStatusResponse = z.infer<typeof DocumentStatusResponseSchema>;
