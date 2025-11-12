import { createHash, randomUUID } from "crypto";
import JSZip from "jszip";
import type { Response } from "express";
import {
  type Document,
  type DocumentStatus,
  type DocumentUploadMetadata,
  type DocumentWithVersions,
  DocumentSchema,
  DocumentStatusSchema,
  DocumentUploadMetadataSchema,
  DocumentWithVersionsSchema,
} from "../schemas/document.schema.js";
import {
  type DocumentVersion,
  DocumentVersionSchema,
} from "../schemas/documentVersion.schema.js";
import { downloadBuffer, streamBlob, uploadBuffer } from "./azureBlob.js";

interface SaveDocumentVersionInput {
  documentId: string;
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  category?: string;
}

const documents = new Map<string, DocumentWithVersions>();

const computeChecksum = (buffer: Buffer): string =>
  createHash("sha256").update(buffer).digest("hex");

const sanitizeFileName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return "document";
  }
  return trimmed.replace(/[^a-zA-Z0-9._-]/g, "-");
};

const getNow = (): string => new Date().toISOString();

const createBlobName = (documentId: string, version: number, fileName: string): string => {
  const sanitized = sanitizeFileName(fileName);
  return `${documentId}/v${version}/${sanitized}`;
};

const toDocument = (record: DocumentWithVersions): Document => ({
  id: record.id,
  applicationId: record.applicationId,
  name: record.name,
  fileName: record.fileName,
  category: record.category,
  mimeType: record.mimeType,
  blobName: record.blobName,
  fileSize: record.fileSize,
  checksum: record.checksum,
  version: record.version,
  status: record.status,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  ocrTextPreview: record.ocrTextPreview,
});

const requireDocument = (id: string): DocumentWithVersions => {
  const record = documents.get(id);
  if (!record) {
    throw new Error(`Document ${id} not found`);
  }
  return record;
};

const persistDocument = (record: DocumentWithVersions) => {
  const parsed = DocumentWithVersionsSchema.parse(record);
  documents.set(parsed.id, parsed);
  return parsed;
};

const buildVersion = (
  params: Omit<DocumentVersion, "id" | "createdAt"> & { createdAt?: string },
): DocumentVersion => {
  const version: DocumentVersion = {
    id: randomUUID(),
    documentId: params.documentId,
    blobName: params.blobName,
    mimeType: params.mimeType,
    fileSize: params.fileSize,
    checksum: params.checksum,
    version: params.version,
    createdAt: params.createdAt ?? getNow(),
  };
  return DocumentVersionSchema.parse(version);
};

export const saveNewDocument = async (
  metadata: DocumentUploadMetadata,
  buffer: Buffer,
  mimeType: string,
  originalName?: string,
): Promise<DocumentWithVersions> => {
  const parsedMetadata = DocumentUploadMetadataSchema.parse(metadata);
  const now = getNow();
  const id = randomUUID();
  const versionNumber = 1;
  const fileName = sanitizeFileName(originalName ?? parsedMetadata.name);
  const blobName = createBlobName(id, versionNumber, fileName);
  await uploadBuffer(buffer, blobName, mimeType);
  const checksum = computeChecksum(buffer);
  const base: DocumentWithVersions = {
    id,
    applicationId: parsedMetadata.applicationId,
    name: parsedMetadata.name,
    fileName,
    category: parsedMetadata.category,
    mimeType,
    blobName,
    fileSize: buffer.length,
    checksum,
    version: versionNumber,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    ocrTextPreview: undefined,
    versions: [
      buildVersion({
        documentId: id,
        blobName,
        mimeType,
        fileSize: buffer.length,
        checksum,
        version: versionNumber,
        createdAt: now,
      }),
    ],
  };
  return persistDocument(base);
};

export const getDocumentById = (id: string): DocumentWithVersions => {
  const document = requireDocument(id);
  return DocumentWithVersionsSchema.parse({ ...document });
};

export const saveDocumentVersion = async (
  params: SaveDocumentVersionInput,
): Promise<DocumentWithVersions> => {
  const document = requireDocument(params.documentId);
  const versionNumber = document.version + 1;
  const now = getNow();
  const fileName = sanitizeFileName(params.fileName || document.name);
  const blobName = createBlobName(document.id, versionNumber, fileName);
  await uploadBuffer(params.buffer, blobName, params.mimeType);
  const checksum = computeChecksum(params.buffer);
  const version = buildVersion({
    documentId: document.id,
    blobName,
    mimeType: params.mimeType,
    fileSize: params.buffer.length,
    checksum,
    version: versionNumber,
    createdAt: now,
  });
  const updated: DocumentWithVersions = {
    ...document,
    name: fileName,
    fileName,
    category: params.category ?? document.category,
    mimeType: params.mimeType,
    blobName,
    fileSize: params.buffer.length,
    checksum,
    version: versionNumber,
    status: "pending",
    updatedAt: now,
    ocrTextPreview: document.ocrTextPreview,
    versions: [...document.versions, version],
  };
  return persistDocument(updated);
};

export const acceptDocument = (id: string): DocumentWithVersions => {
  const document = requireDocument(id);
  const updated: DocumentWithVersions = {
    ...document,
    status: "accepted",
    updatedAt: getNow(),
  };
  return persistDocument(updated);
};

export const rejectDocument = (id: string): DocumentWithVersions => {
  const document = requireDocument(id);
  const updated: DocumentWithVersions = {
    ...document,
    status: "rejected",
    updatedAt: getNow(),
  };
  return persistDocument(updated);
};

export const reuploadDocument = async (
  id: string,
  buffer: Buffer,
  mimeType: string,
  fileName: string,
  category?: string,
): Promise<DocumentWithVersions> =>
  saveDocumentVersion({
    documentId: id,
    buffer,
    mimeType,
    fileName,
    category,
  });

export const getDocumentsForApplication = (appId: string): Document[] => {
  const result: Document[] = [];
  for (const record of documents.values()) {
    if (record.applicationId === appId) {
      result.push(DocumentSchema.parse(toDocument(record)));
    }
  }
  return result;
};

export const downloadDocument = async (
  id: string,
): Promise<{ buffer: Buffer; document: DocumentWithVersions } | null> => {
  const document = documents.get(id);
  if (!document) {
    return null;
  }
  const buffer = await downloadBuffer(document.blobName);
  return { buffer, document };
};

export const downloadMultipleDocuments = async (
  ids: string[],
): Promise<Buffer> => {
  const zip = new JSZip();
  await Promise.all(
    ids.map(async (id) => {
      const document = documents.get(id);
      if (!document) {
        return;
      }
      const buffer = await downloadBuffer(document.blobName);
      const entryName = `${document.name.replace(/\s+/g, "-")}-v${document.version}`;
      zip.file(entryName, buffer);
    }),
  );
  return zip.generateAsync({ type: "nodebuffer" });
};

export const streamDocument = async (id: string, res: Response): Promise<void> => {
  const document = requireDocument(id);
  await streamBlob(document.blobName, res);
};

// Compatibility exports for legacy consumers relying on the service class API.
// These wrappers delegate to the new in-memory stores above so existing silo
// tooling continues to function during the migration to the dedicated API layer.

export class DocumentService {
  public listDocuments(applicationId?: string): DocumentWithVersions[] {
    if (!applicationId) {
      return Array.from(documents.values());
    }
    return Array.from(documents.values()).filter(
      (doc) => doc.applicationId === applicationId,
    );
  }

  public getDocument(id: string): DocumentWithVersions {
    return getDocumentById(id);
  }

  public async uploadDocument(input: {
    applicationId: string;
    documentId?: string;
    fileName: string;
    contentType: string;
    data: Buffer;
  }): Promise<DocumentWithVersions> {
    if (input.documentId) {
      return saveDocumentVersion({
        documentId: input.documentId,
        buffer: input.data,
        mimeType: input.contentType,
        fileName: input.fileName,
      });
    }
    return saveNewDocument(
      {
        applicationId: input.applicationId,
        name: input.fileName,
        category: "general",
      },
      input.data,
      input.contentType,
      input.fileName,
    );
  }

  public updateStatus(id: string, status: DocumentStatus): DocumentWithVersions {
    DocumentStatusSchema.parse(status);
    if (status === "accepted") {
      return acceptDocument(id);
    }
    if (status === "rejected") {
      return rejectDocument(id);
    }
    const document = requireDocument(id);
    const updated: DocumentWithVersions = {
      ...document,
      status,
      updatedAt: getNow(),
    };
    return persistDocument(updated);
  }

  public listVersions(id: string): DocumentVersion[] {
    return [...requireDocument(id).versions];
  }

  public async streamVersion(id: string, res: Response): Promise<void> {
    await streamDocument(id, res);
  }

  public async downloadDocument(id: string): Promise<{ buffer: Buffer }> {
    const result = await downloadDocument(id);
    if (!result) {
      throw new Error("Document not found");
    }
    return { buffer: result.buffer };
  }

  public saveDocument(input: {
    id?: string;
    applicationId: string;
    fileName: string;
    contentType: string;
    status?: DocumentStatus;
    uploadedBy?: string;
    note?: string;
  }): DocumentWithVersions {
    const id = input.id ?? randomUUID();
    const version = 1;
    const now = getNow();
    const fileName = sanitizeFileName(input.fileName);
    const blobName = createBlobName(id, version, fileName);
    const checksum = computeChecksum(Buffer.alloc(0));
    const versionEntry = buildVersion({
      documentId: id,
      blobName,
      mimeType: input.contentType,
      fileSize: 0,
      checksum,
      version,
      createdAt: now,
    });
    const record: DocumentWithVersions = {
      id,
      applicationId: input.applicationId,
      name: input.fileName,
      fileName,
      category: "general",
      mimeType: input.contentType,
      blobName,
      fileSize: 0,
      checksum,
      version,
      status: input.status ?? "pending",
      createdAt: now,
      updatedAt: now,
      ocrTextPreview: undefined,
      versions: [versionEntry],
    };
    return persistDocument(record);
  }
}

export const createDocumentService = (_options: unknown = {}): DocumentService =>
  new DocumentService();

export type DocumentServiceType = DocumentService;

export const documentService = new DocumentService();
