import type { Request, Response } from "express";

// DocumentStatus is optional — if Prisma is removed, fall back to string union
type DocumentStatus = "pending" | "accepted" | "rejected";

import {
  downloadDocument,
  getDocument as getDocumentService,
  getDocumentStatus as getDocumentStatusService,
  getDocumentVersions,
  getDocumentsForApplication,
  getDownloadUrl,
  getUploadUrl,
  listDocuments,
  registerDocumentFromPayload,
  updateDocumentStatus,
  uploadDocumentFromFile,
} from "../services/documentService.js";

/* -------------------------------------------------------------
   HELPERS
------------------------------------------------------------- */

const getUserSilos = (req: Request): string[] => {
  const silos = (req as any).user?.silos;
  return Array.isArray(silos) ? silos : [];
};

const parseStatus = (value: unknown): DocumentStatus | null => {
  if (typeof value !== "string") return null;
  const normalized = value.toLowerCase();
  return ["pending", "accepted", "rejected"].includes(normalized)
    ? (normalized as DocumentStatus)
    : null;
};

/* -------------------------------------------------------------
   LIST DOCUMENTS
------------------------------------------------------------- */
export const listDocumentsHandler = async (req: Request, res: Response) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const applicationId =
    typeof req.query.applicationId === "string" ? req.query.applicationId : undefined;

  const documents = await listDocuments(silos, applicationId);
  return res.json(documents);
};

/* -------------------------------------------------------------
   REGISTER DOCUMENT FROM PAYLOAD (base64 or text)
------------------------------------------------------------- */
export const registerDocumentHandler = async (req: Request, res: Response) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const payload = req.body;
  if (!payload || typeof payload !== "object")
    return res.status(400).json({ error: "Invalid payload" });

  const required = ["id", "applicationId", "fileName", "fileContent"] as const;
  const missing = required.filter(
    (key) => typeof (payload as any)[key] !== "string"
  );

  if (missing.length)
    return res
      .status(400)
      .json({ error: `Missing fields: ${missing.join(", ")}` });

  const document = await registerDocumentFromPayload(
    {
      id: payload.id,
      applicationId: payload.applicationId,
      fileName: payload.fileName,
      fileContent: payload.fileContent,
      contentType:
        typeof payload.contentType === "string"
          ? payload.contentType
          : undefined,
      note: typeof payload.note === "string" ? payload.note : undefined,
      uploadedBy:
        typeof payload.uploadedBy === "string"
          ? payload.uploadedBy
          : (req as any).user?.email,
      documentType:
        typeof payload.documentType === "string"
          ? payload.documentType
          : undefined,
    },
    silos
  );

  if (!document)
    return res
      .status(404)
      .json({ error: "Application not found or silo blocked" });

  return res.status(201).json(document);
};

/* -------------------------------------------------------------
   UPLOAD DOCUMENT FROM FILE (req.file NOT USED – fallback only)
------------------------------------------------------------- */

export const uploadDocumentHandler = async (req: Request, res: Response) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  // No Multer installed → no req.file
  const file = (req as any).file;
  const appId = req.body?.appId ?? req.body?.applicationId;

  if (!file)
    return res
      .status(400)
      .json({ error: "File upload not enabled (missing multer)" });

  if (typeof appId !== "string")
    return res.status(400).json({ error: "applicationId is required" });

  const document = await uploadDocumentFromFile(appId, file, silos);
  if (!document)
    return res
      .status(404)
      .json({ error: "Application not found or silo blocked" });

  return res.status(201).json(document);
};

/* -------------------------------------------------------------
   GET DOCUMENT BY ID
------------------------------------------------------------- */
export const getDocumentHandler = async (req: Request, res: Response) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const document = await getDocumentService(req.params.id, silos);
  if (!document) return res.status(404).json({ error: "Not found" });

  return res.json(document);
};

/* -------------------------------------------------------------
   GET DOCUMENTS FOR APPLICATION
------------------------------------------------------------- */
export const getDocumentsForApplicationHandler = async (
  req: Request,
  res: Response
) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const documents = await getDocumentsForApplication(req.params.appId, silos);
  if (!documents) return res.status(404).json({ error: "Not found" });

  return res.json(documents);
};

/* -------------------------------------------------------------
   GET DOCUMENT VERSIONS
------------------------------------------------------------- */
export const getDocumentVersionsHandler = async (
  req: Request,
  res: Response
) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const versions = await getDocumentVersions(req.params.id, silos);
  if (!versions) return res.status(404).json({ error: "Not found" });

  return res.json(versions);
};

/* -------------------------------------------------------------
   GET DOCUMENT STATUS
------------------------------------------------------------- */
export const getDocumentStatusHandler = async (
  req: Request,
  res: Response
) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const status = await getDocumentStatusService(req.params.id, silos);
  if (!status) return res.status(404).json({ error: "Not found" });

  return res.json(status);
};

/* -------------------------------------------------------------
   UPDATE DOCUMENT STATUS
------------------------------------------------------------- */
export const updateDocumentStatusHandler = async (
  req: Request,
  res: Response
) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const status = parseStatus(req.body?.status);
  if (!status) return res.status(400).json({ error: "Invalid status" });

  const document = await updateDocumentStatus(req.params.id, status, silos);
  if (!document) return res.status(404).json({ error: "Not found" });

  return res.json(document);
};

/* -------------------------------------------------------------
   GET DOWNLOAD URL
------------------------------------------------------------- */
export const getDownloadUrlHandler = async (req: Request, res: Response) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const version =
    typeof req.query.version === "string"
      ? Number.parseInt(req.query.version, 10)
      : undefined;

  const payload = await getDownloadUrl(
    req.params.id,
    silos,
    Number.isNaN(version) ? undefined : version
  );

  if (!payload) return res.status(404).json({ error: "Not found" });

  return res.json(payload);
};

/* -------------------------------------------------------------
   GET UPLOAD URL
------------------------------------------------------------- */
export const getUploadUrlHandler = async (req: Request, res: Response) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const uploadUrl = await getUploadUrl(req.params.id, silos);
  if (!uploadUrl) return res.status(404).json({ error: "Not found" });

  return res.json(uploadUrl);
};

/* -------------------------------------------------------------
   DOWNLOAD DOCUMENT CONTENT (binary)
------------------------------------------------------------- */
export const downloadDocumentContentHandler = async (
  req: Request,
  res: Response
) => {
  const silos = getUserSilos(req);
  if (!silos.length) return res.status(403).json({ error: "No silo access" });

  const version =
    typeof req.query.version === "string"
      ? Number.parseInt(req.query.version, 10)
      : undefined;

  const result = await downloadDocument(
    req.params.id,
    silos,
    Number.isNaN(version) ? undefined : version
  );

  if (!result) return res.status(404).json({ error: "Not found" });

  res.setHeader("Content-Type", result.mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${result.fileName}"`
  );
  return res.send(result.buffer);
};
