import { randomUUID } from "node:crypto";
import {
  documentStatusSchema,
  documentUploadSchema,
  type DocumentStatus,
  type DocumentUploadInput
} from "../schemas/document.schema.js";
import {
  uploadToAzureBlob,
  type AzureBlobUploadResult
} from "../utils/azureBlobStorage.js";
import { logDebug, logInfo } from "../utils/logger.js";

/**
 * Service responsible for persisting and retrieving document metadata.
 * This stub stores data in memory for ease of testing.
 */
class DocumentService {
  private documents = new Map<string, DocumentStatus>();
  private blobLocations = new Map<string, AzureBlobUploadResult>();

  /**
   * Simulates uploading a document to Azure Blob Storage and returns normalized metadata.
   */
  async uploadDocument(payload: DocumentUploadInput): Promise<DocumentStatus> {
    const validated = documentUploadSchema.parse(payload);
    const buffer = Buffer.from(validated.content, "base64");

    const uploadResult = await uploadToAzureBlob(
      buffer,
      {
        container: process.env.AZURE_STORAGE_CONTAINER ?? "documents",
        blobName: `${validated.applicationId}/${validated.fileName}`
      },
      validated.mimeType
    );

    logInfo("Document uploaded to Azure Blob Storage");
    logDebug("Azure upload result", uploadResult);

    const document = documentStatusSchema.parse({
      id: randomUUID(),
      applicationId: validated.applicationId,
      fileName: validated.fileName,
      mimeType: validated.mimeType,
      status: "processing",
      uploadedAt: new Date().toISOString()
    });

    this.documents.set(document.id, document);
    this.blobLocations.set(document.id, uploadResult);
    return document;
  }

  /**
   * Returns the current status for a document if present.
   */
  async getDocumentStatus(id: string): Promise<DocumentStatus | undefined> {
    const document = this.documents.get(id);
    if (!document) {
      return undefined;
    }

    if (document.status === "processing") {
      const readyDocument = documentStatusSchema.parse({
        ...document,
        status: "ready"
      });
      this.documents.set(id, readyDocument);
      return readyDocument;
    }

    return document;
  }

  /**
   * Retrieves the Azure Blob Storage metadata for a previously uploaded document if available.
   */
  getBlobLocation(id: string): AzureBlobUploadResult | undefined {
    return this.blobLocations.get(id);
  }
}

export const documentService = new DocumentService();
