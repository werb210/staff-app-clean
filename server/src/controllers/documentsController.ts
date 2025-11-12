import type { Request, Response } from "express";
import {
  DocumentReuploadSchema,
  DocumentUploadMetadataSchema,
} from "../schemas/document.schema.js";
import {
  acceptDocument,
  downloadDocument,
  downloadMultipleDocuments,
  getDocumentById,
  getDocumentsForApplication,
  rejectDocument,
  reuploadDocument,
  saveNewDocument,
  streamDocument,
} from "../services/documentService.js";

export const uploadDocument = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }
  const parsedMetadata = DocumentUploadMetadataSchema.safeParse(req.body);
  if (!parsedMetadata.success) {
    return res.status(400).json({ message: "Invalid document metadata" });
  }
  try {
    const document = await saveNewDocument(
      parsedMetadata.data,
      file.buffer,
      file.mimetype || "application/octet-stream",
      file.originalname,
    );
    return res.status(201).json({ data: document });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getDocument = (req: Request, res: Response) => {
  try {
    const document = getDocumentById(req.params.id);
    return res.json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const previewDocument = async (req: Request, res: Response) => {
  try {
    const document = getDocumentById(req.params.id);
    res.setHeader("Content-Type", document.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${document.name}"`);
    await streamDocument(document.id, res);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const downloadDocumentHandler = async (req: Request, res: Response) => {
  try {
    const result = await downloadDocument(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.setHeader("Content-Type", result.document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.document.name}"`,
    );
    return res.send(result.buffer);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const acceptDocumentHandler = (req: Request, res: Response) => {
  try {
    const document = acceptDocument(req.params.id);
    return res.json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const rejectDocumentHandler = (req: Request, res: Response) => {
  try {
    const document = rejectDocument(req.params.id);
    return res.json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const reuploadDocumentHandler = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }
  const parsed = DocumentReuploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  try {
    const document = await reuploadDocument(
      req.params.id,
      file.buffer,
      file.mimetype || "application/octet-stream",
      file.originalname,
      parsed.data.category,
    );
    return res.json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const getDocumentsForApplicationHandler = (req: Request, res: Response) => {
  const { appId } = req.params;
  try {
    const documents = getDocumentsForApplication(appId);
    return res.json({ data: documents });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const downloadAllDocumentsHandler = async (req: Request, res: Response) => {
  const { appId } = req.params;
  try {
    const documents = getDocumentsForApplication(appId);
    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents available" });
    }
    const archive = await downloadMultipleDocuments(documents.map((doc) => doc.id));
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${appId}-documents.zip"`,
    );
    return res.send(archive);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
