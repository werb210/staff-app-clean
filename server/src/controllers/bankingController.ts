// server/src/controllers/bankingController.ts
import { Request, Response } from 'express';
import * as bankingService from '../services/bankingService.js';

export async function runAnalysis(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;

    const result = await bankingService.runAnalysis(applicationId);

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('runAnalysis error →', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getAnalysis(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;

    const result = await bankingService.getAnalysis(applicationId);

    return res.status(200).json(result || {});
  } catch (err: any) {
    console.error('getAnalysis error →', err);
    return res.status(500).json({ error: err.message });
  }
}
