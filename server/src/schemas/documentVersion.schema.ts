import { z } from "zod";

/**
 * A single historical version of an uploaded document.
 * Matches documentService.buildVersion() exactly.
 */
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

export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;
