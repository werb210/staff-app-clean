import { uploadBuffer, getBlobUrl } from "./azureBlob.js";
import { db } from "../db/db.js";
import { documents } from "../db/schema/documents.js";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function saveUploadedDocument({
  applicationId,
  originalName,
  buffer,
  mimeType,
  category,
}: {
  applicationId: string;
  originalName: string;
  buffer: Buffer;
  mimeType: string;
  category?: string | null;
}) {
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

  const { key, url } = await uploadBuffer(buffer, mimeType);

  const inserted = await db.insert(documents).values({
    applicationId,
    originalName,
    category,
    azureBlobKey: key,
    mimeType,
    sizeBytes: buffer.length,
    checksum,
    status: "pending",
    rejectionReason: null
  }).returning();

  return { ...inserted[0], url };
}

export async function getDocumentUrl(id: string) {
  const [doc] = await db.select().from(documents).where(eq(documents.id, id));
  if (!doc) return null;
  return getBlobUrl(doc.azureBlobKey);
}
