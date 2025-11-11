import { randomUUID } from "crypto";
import {
  DocumentMetadata,
  DocumentStatus,
  DocumentSaveInput,
} from "../schemas/document.schema.js";

/**
 * DocumentService tracks uploaded document metadata in memory.
 */
class DocumentService {
  private readonly documents = new Map<string, DocumentMetadata>();

  /**
   * Returns all stored document metadata.
   */
  public listDocuments(): DocumentMetadata[] {
    return Array.from(this.documents.values());
  }

  /**
   * Retrieves a document by id, creating a placeholder when missing.
   */
  public getDocument(id: string): DocumentMetadata {
    const existing = this.documents.get(id);
    if (existing) {
      return existing;
    }

    const placeholder: DocumentMetadata = {
      id,
      applicationId: "00000000-0000-0000-0000-000000000000",
      fileName: "placeholder.pdf",
      contentType: "application/pdf",
      status: "uploaded",
      uploadedAt: new Date().toISOString(),
    };
    this.documents.set(id, placeholder);
    return placeholder;
  }

  /**
   * Saves metadata for an uploaded document.
   */
  public saveDocument(input: DocumentSaveInput): DocumentMetadata {
    const id = input.id ?? randomUUID();
    const metadata: DocumentMetadata = {
      id,
      applicationId: input.applicationId,
      fileName: input.fileName,
      contentType: input.contentType,
      status: input.status ?? "uploaded",
      uploadedAt: new Date().toISOString(),
    };
    this.documents.set(id, metadata);
    return metadata;
  }

  /**
   * Updates the status of a document (e.g. reviewed, rejected).
   */
  public updateStatus(id: string, status: DocumentStatus): DocumentMetadata {
    const document = this.getDocument(id);
    const updated: DocumentMetadata = { ...document, status };
    this.documents.set(id, updated);
    return updated;
  }
}

export const documentService = new DocumentService();

export type DocumentServiceType = DocumentService;
