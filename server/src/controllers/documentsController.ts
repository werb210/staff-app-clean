// server/src/controllers/documentsController.ts
import type { Request, Response } from "express";
import { documentsService } from "../services/documentsService.js";
import { getDocumentUrl } from "../services/documentService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const documentsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const docs = await documentsService.list();
    const withUrls = await Promise.all(
      docs.map(async (doc) => ({ ...doc, url: await getDocumentUrl(doc.id) }))
    );
    res.json(withUrls);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const doc = await documentsService.get(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ...doc, url: await getDocumentUrl(doc.id) });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      azureBlobKey: req.body.azureBlobKey,
    };

    if (!payload.applicationId) {
      return res.status(400).json({ error: "applicationId is required" });
    }

    if (!payload.originalName && !payload.name) {
      return res.status(400).json({ error: "originalName is required" });
    }

    if (!payload.azureBlobKey) {
      return res.status(400).json({ error: "azureBlobKey is required" });
    }

    res.json(await documentsService.create(payload));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      azureBlobKey: req.body.azureBlobKey,
    };

    res.json(await documentsService.update(req.params.id, payload));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    res.json(await documentsService.delete(req.params.id));
  }),
};
