import { Request, Response } from "express";
import signaturesRepo from "../db/repositories/signatures.repo.js";
import documentsRepo from "../db/repositories/documents.repo.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signingController = {
  requestSignature: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const payload = req.body ?? {};

    const created = await signaturesRepo.create({
      applicationId,
      signNowDocumentId: payload.signNowDocumentId ?? "",
      signedBlobKey: null,
    });

    res.status(201).json(created);
  }),

  listForApplication: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const rows = await signaturesRepo.findMany({ applicationId });
    res.json(rows);
  }),

  getSignedDocuments: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const docs = await documentsRepo.findMany({
      applicationId,
      category: "signed_application",
    });

    res.json(docs);
  }),
};

export default signingController;
