import { Router } from "express";
import { documentService } from "../services/documentService.js";
import {
  DocumentMetadataSchema,
  DocumentStatusUpdateSchema,
} from "../schemas/document.schema.js";

const router = Router();

// Returns metadata for all documents stored in memory.
router.get("/", (_req, res) => {
  const documents = documentService.listDocuments();
  res.json({ message: "OK", data: documents });
});

// Retrieves metadata for a single document.
router.get("/:id", (req, res) => {
  const document = documentService.getDocument(req.params.id);
  res.json({ message: "OK", data: document });
});

// Accepts an upload request and stores document metadata in memory.
router.post("/", (req, res) => {
  const payload = DocumentMetadataSchema.parse(req.body);
  const stored = documentService.saveDocument(payload);
  res.status(201).json({ message: "OK", data: stored });
});

// Updates the status of a document, e.g. to mark it as reviewed.
router.post("/:id/status", (req, res) => {
  const payload = DocumentStatusUpdateSchema.parse({
    id: req.params.id,
    status: req.body.status,
  });
  const updated = documentService.updateStatus(payload.id, payload.status);
  res.json({ message: "OK", data: updated });
});

export default router;
