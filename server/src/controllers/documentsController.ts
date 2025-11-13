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
  deleteDocument,               // ✔ ADDED
} from "../services/documentService.js";

/* ---------------------------------------------------------
   UPLOAD
--------------------------------------------------------- */
export const uploadDocument = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "File is required" });

  const parsed = DocumentUploadMetadataSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid document metadata" });

  try {
    const document = await saveNewDocument(
      parsed.data,
      file.buffer,
      file.mimetype || "application/octet-stream",
      file.originalname
    );
    return res.status(201).json({ data: document });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

/* ---------------------------------------------------------
   GET SINGLE
--------------------------------------------------------- */
export const getDocument = (req: Request, res: Response) => {
  try {
    const document = getDocumentById(req.params.id);
    return res.json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

/* ---------------------------------------------------------
   PREVIEW INLINE
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   DOWNLOAD SINGLE
--------------------------------------------------------- */
export const downloadDocumentHandler = async (req: Request, res: Response) => {
  try {
    const result = await downloadDocument(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Document not found" });

    res.setHeader("Content-Type", result.document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.document.name}"`
    );
    return res.send(result.buffer);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

/* ---------------------------------------------------------
   ACCEPT / REJECT
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   REUPLOAD
--------------------------------------------------------- */
export const reuploadDocumentHandler = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "File is required" });

  const parsed = DocumentReuploadSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid payload" });

  try {
    const document = await reuploadDocument(
      req.params.id,
      file.buffer,
      file.mimetype || "application/octet-stream",
      file.originalname,
      parsed.data.category
    );
    return res.json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

/* ---------------------------------------------------------
   GET ALL FOR APPLICATION
--------------------------------------------------------- */
export const getDocumentsForApplicationHandler = (
  req: Request,
  res: Response
) => {
  const { appId } = req.params;
  try {
    const documents = getDocumentsForApplication(appId);
    return res.json({ data: documents });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

/* ---------------------------------------------------------
   DOWNLOAD ALL AS ZIP
--------------------------------------------------------- */
export const downloadAllDocumentsHandler = async (
  req: Request,
  res: Response
) => {
  const { appId } = req.params;
  try {
    const documents = getDocumentsForApplication(appId);
    if (documents.length === 0)
      return res.status(404).json({ message: "No documents available" });

    const archive = await downloadMultipleDocuments(
      documents.map((doc) => doc.id)
    );

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${appId}-documents.zip"`
    );
    return res.send(archive);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

/* ---------------------------------------------------------
   DELETE (✔ ADDED)
--------------------------------------------------------- */
export const deleteDocumentHandler = (req: Request, res: Response) => {
  try {
    const document = deleteDocument(req.params.id);
    return res.status(200).json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};
