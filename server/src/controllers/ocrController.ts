import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ocrRepo from "../db/repositories/ocrResults.repo.js";

export const ocrController = {
  runOCR: asyncHandler(async (req: Request, res: Response) => {
    const { documentId } = req.params;

    // No OCR engine here — this controller only mirrors stored results
    const record = await ocrRepo.create({
      documentId,
      results: req.body ?? {},
    });

    res.json(record);
  }),

  getOCR: asyncHandler(async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const rows = await ocrRepo.findMany({ documentId });
    res.json(rows);
  }),

  listOCR: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const rows = await ocrRepo.findMany({ applicationId });
    res.json(rows);
  }),
};

export default ocrController;
