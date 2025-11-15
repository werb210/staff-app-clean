import { Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import { db } from "../db.js";
import { documents } from "../db/schema.js";
import { eq } from "drizzle-orm";

// All Azure Blob settings come directly from env vars
const AZURE_BLOB_CONNECTION_STRING = process.env.AZURE_BLOB_CONNECTION_STRING!;
const AZURE_BLOB_CONTAINER = process.env.AZURE_BLOB_CONTAINER || "documents";

if (!AZURE_BLOB_CONNECTION_STRING) {
  console.error("❌ Missing AZURE_BLOB_CONNECTION_STRING");
  process.exit(1);
}

const blobService = BlobServiceClient.fromConnectionString(
  AZURE_BLOB_CONNECTION_STRING
);
const containerClient = blobService.getContainerClient(AZURE_BLOB_CONTAINER);

// Ensure container exists
async function ensureContainer() {
  if (!(await containerClient.exists())) {
    await containerClient.create();
  }
}
ensureContainer();

/* --------------------------------------------------------
   UPLOAD DOCUMENT
--------------------------------------------------------- */
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { applicationId, category, documentType } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!applicationId) {
      return res.status(400).json({ error: "Missing applicationId" });
    }

    const blobName = `${applicationId}/${Date.now()}-${file.originalname}`;
    const blockBlob = containerClient.getBlockBlobClient(blobName);

    await blockBlob.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    const [inserted] = await db
      .insert(documents)
      .values({
        applicationId,
        name: file.originalname,
        category: category || null,
        documentType: documentType || null,
        s3Key: blobName, // legacy column name; storing Azure blob key
        sizeBytes: file.size,
        checksum: null,
      })
      .returning();

    return res.status(200).json({
      ok: true,
      document: inserted,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};

/* --------------------------------------------------------
   GET SIGNED DOWNLOAD URL
--------------------------------------------------------- */
export const getDownloadUrl = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!doc) return res.status(404).json({ error: "Document not found" });

    const blobClient = containerClient.getBlobClient(doc.s3Key!);

    const url = await blobClient.generateSasUrl({
      permissions: "r",
      expiresOn: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    });

    return res.json({ ok: true, url });
  } catch (err) {
    console.error("Signed URL error:", err);
    return res.status(500).json({ error: "Failed to generate URL" });
  }
};

/* --------------------------------------------------------
   LIST DOCUMENTS FOR APPLICATION
--------------------------------------------------------- */
export const listDocuments = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;

    const rows = await db
      .select()
      .from(documents)
      .where(eq(documents.applicationId, applicationId));

    return res.json({ ok: true, documents: rows });
  } catch (err) {
    console.error("List docs error:", err);
    return res.status(500).json({ error: "Failed to load documents" });
  }
};

/* --------------------------------------------------------
   DELETE DOCUMENT
--------------------------------------------------------- */
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!doc) return res.status(404).json({ error: "Document not found" });

    const blobClient = containerClient.getBlobClient(doc.s3Key!);

    await blobClient.deleteIfExists();

    await db.delete(documents).where(eq(documents.id, documentId));

    return res.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Failed to delete document" });
  }
};
