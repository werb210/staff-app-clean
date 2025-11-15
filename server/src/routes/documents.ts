import express from "express";
import multer from "multer";

import {
  uploadDocument,
  listDocuments,
  getDownloadUrl,
  deleteDocument,
} from "../controllers/documentsController.js";

const router = express.Router();

// Multer in-memory buffer — required for Azure Blob upload
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/documents/upload
 * Upload a new document for an application
 */
router.post("/upload", upload.single("file"), uploadDocument);

/**
 * GET /api/documents/:applicationId
 * List all documents for an application
 */
router.get("/:applicationId", listDocuments);

/**
 * GET /api/documents/download/:documentId
 * Get a signed Azure URL for downloading
 */
router.get("/download/:documentId", getDownloadUrl);

/**
 * DELETE /api/documents/:documentId
 * Remove a document and delete from Azure Blob + DB
 */
router.delete("/:documentId", deleteDocument);

export default router;
