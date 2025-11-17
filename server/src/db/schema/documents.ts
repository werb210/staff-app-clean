// server/src/db/schema/documents.ts

export interface DocumentRecord {
  id: string;
  applicationId: string;

  name: string;
  category: string;   // e.g. "Bank Statements"
  type: string;       // MIME type
  sizeBytes: number;

  // Storage
  s3Key: string;
  checksum: string; // SHA-256
  version: number;

  // Status
  accepted: boolean | null;
  rejectedReason: string | null;

  createdAt: Date;
  updatedAt: Date;
}
