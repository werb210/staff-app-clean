import { db } from "../db/db.js";
import { documentVersions } from "../db/schema/documentVersions.js";
import { eq } from "drizzle-orm";

export async function recordVersion({
  documentId,
  azureBlobKey,
  checksum,
  sizeBytes,
}: {
  documentId: string;
  azureBlobKey: string;
  checksum?: string | null;
  sizeBytes?: number | null;
}) {
  const existing = await db
    .select()
    .from(documentVersions)
    .where(eq(documentVersions.documentId, documentId));

  const versionNumber = existing.length + 1;

  const [inserted] = await db
    .insert(documentVersions)
    .values({
      documentId,
      versionNumber,
      azureBlobKey,
      checksum: checksum ?? null,
      sizeBytes: sizeBytes ?? null,
    })
    .returning();

  return inserted;
}
