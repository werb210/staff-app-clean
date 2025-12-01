// server/src/controllers/ocrController.ts
import { Request, Response } from 'express';
import * as ocrService from '../services/ocrService.js';

export async function runOCR(req: Request, res: Response) {
  try {
    const { documentId } = req.params;

    const result = await ocrService.run(documentId);

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('runOCR error →', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getOCR(req: Request, res: Response) {
  try {
    const { documentId } = req.params;

    const result = await ocrService.getOCR(documentId);

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('getOCR error →', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listOCR(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;

    const list = await ocrService.listOCR(applicationId);

    return res.status(200).json(list);
  } catch (err: any) {
    console.error('listOCR error →', err);
    return res.status(500).json({ error: err.message });
  }
}
