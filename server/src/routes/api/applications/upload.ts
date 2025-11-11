import { Router } from "express";
import { documentService } from "../../../services/documentService.js";
import { DocumentUploadSchema } from "../../../schemas/document.schema.js";

const router = Router();

// Allows the front-end to register a document upload against an application.
router.post("/", (req, res) => {
  const payload = DocumentUploadSchema.parse(req.body);
  const stored = documentService.saveDocument({
    id: payload.documentId,
    applicationId: payload.applicationId,
    fileName: payload.fileName,
    contentType: payload.contentType,
    status: "uploaded",
  });
  res.status(201).json({ message: "OK", data: stored });
});

export default router;
