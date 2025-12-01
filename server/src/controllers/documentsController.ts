// server/src/controllers/documentsController.ts

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import documentsRepo from "../db/repositories/documents.repo.js";
import documentVersionsRepo from "../db/repositories/documentVersions.repo.js";

export const documentsController = {
  // GET /documents/:id
  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const doc = await documentsRepo.findById(id);

    if (!doc) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(doc);
  }),

  // GET /documents?applicationId=
  list: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const docs = await documentsRepo.findMany({ applicationId });
    res.json(docs);
  }),

  // POST /documents
  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await documentsRepo.create(req.body);

    // Create version 1
    await documentVersionsRepo.create({
      documentId: created.id,
      versionNumber: 1,
      azureBlobKey: created.azureBlobKey,
      checksum: created.checksum,
      sizeBytes: created.sizeBytes,
    });

    res.status(201).json(created);
  }),

  // PUT /documents/:id
  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await documentsRepo.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  }),

  // DELETE /documents/:id
  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await documentsRepo.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ success: true });
  }),

  // POST /documents/upload   (via multer)
  uploadDocument: asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;

    const created = await documentsRepo.create(payload);

    await documentVersionsRepo.create({
      documentId: created.id,
      versionNumber: 1,
      azureBlobKey: created.azureBlobKey,
      checksum: created.checksum,
      sizeBytes: created.sizeBytes,
    });

    res.status(201).json(created);
  }),

  // GET /documents/:documentId
  getDocument: asyncHandler(async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const doc = await documentsRepo.findById(documentId);

    if (!doc) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(doc);
  }),

  // GET /documents/application/:applicationId
  listDocuments: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const docs = await documentsRepo.findMany({ applicationId });
    res.json(docs);
  }),

  // POST /documents/:documentId/accept
  acceptDocument: asyncHandler(async (req: Request, res: Response) => {
    const { documentId } = req.params;

    const updated = await documentsRepo.update(documentId, {
      status: "accepted",
    });

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  }),

  // POST /documents/:documentId/reject
  rejectDocument: asyncHandler(async (req: Request, res: Response) => {
    const { documentId } = req.params;

    const updated = await documentsRepo.update(documentId, {
      status: "rejected",
    });

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  }),
};

export default documentsController;
