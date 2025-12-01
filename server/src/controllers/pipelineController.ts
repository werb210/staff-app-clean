// server/src/controllers/pipelineController.ts
import type { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { db } from "../db/db.js";
import { applications } from "../db/schema/applications.js";
import { documents } from "../db/schema/documents.js";
import { documentVersions } from "../db/schema/documentVersions.js";
import { ocrResults } from "../db/schema/ocr.js";
import { bankingAnalysis } from "../db/schema/banking.js";
import * as pipelineService from "../services/pipelineService.js";
import { getDocumentUrl } from "../services/documentService.js";

//
// ======================================================
//  Get Pipeline History
// ======================================================
//
export async function getPipeline(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;

    const events = await pipelineService.getPipeline(applicationId);
    const [application] = await db.select().from(applications).where(eq(applications.id, applicationId));
    const docs = await db.select().from(documents).where(eq(documents.applicationId, applicationId));
    const docIds = docs.map((d) => d.id);

    const [banking] = await db
      .select()
      .from(bankingAnalysis)
      .where(eq(bankingAnalysis.applicationId, applicationId));

    const versions = docIds.length
      ? await db.select().from(documentVersions).where(inArray(documentVersions.documentId, docIds))
      : [];

    const ocr = docIds.length
      ? await db.select().from(ocrResults).where(inArray(ocrResults.documentId, docIds))
      : [];

    const docsWithMeta = await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        url: await getDocumentUrl(doc.id),
        versionCount: versions.filter((v) => v.documentId === doc.id).length,
        ocr: ocr.filter((o) => o.documentId === doc.id),
      }))
    );

    return res.status(200).json({
      application,
      pipelineStage: application?.pipelineStage,
      events,
      documents: docsWithMeta,
      ocrSummary: ocr,
      banking: banking?.data || null,
    });
  } catch (err: any) {
    console.error("getPipeline error →", err);
    return res.status(500).json({ error: err.message });
  }
}

//
// ======================================================
//  Update/Override Pipeline Stage (staff action)
// ======================================================
//
export async function updateStage(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;
    const { stage, reason } = req.body;

    if (!stage) return res.status(400).json({ error: "New stage required." });

    const updated = await pipelineService.updateStage(applicationId, stage, reason);

    return res.status(200).json(updated);
  } catch (err: any) {
    console.error("updateStage error →", err);
    return res.status(500).json({ error: err.message });
  }
}
