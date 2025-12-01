import { Request, Response } from 'express';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/db.js';
import { documents } from '../db/schema/documents.js';
import { documentVersions } from '../db/schema/documentVersions.js';
import applicationsRepo from '../db/repositories/applications.repo.js';
import pipelineEventsRepo from '../db/repositories/pipelineEvents.repo.js';
import { saveUploadedDocument, getDocumentUrl } from '../services/documentService.js';
import { recordVersion } from '../services/versioningService.js';
import { logDocumentEvent } from '../services/auditService.js';

export async function uploadDocument(req: Request, res: Response) {
  try {
    const { applicationId, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname;

    const doc = await saveUploadedDocument({
      applicationId,
      originalName: fileName,
      buffer,
      mimeType,
      category: category || null,
    });

    await recordVersion({
      documentId: doc.id,
      azureBlobKey: doc.azureBlobKey,
      checksum: doc.checksum,
      sizeBytes: doc.sizeBytes,
    });

    await logDocumentEvent(applicationId, (req as any).user?.id ?? null, {
      action: 'upload',
      documentId: doc.id,
      originalName: fileName,
    });

    return res.status(200).json(doc);
  } catch (err: any) {
    console.error('uploadDocument error →', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getDocument(req: Request, res: Response) {
  try {
    const { documentId } = req.params;
    const [doc] = await db.select().from(documents).where(eq(documents.id, documentId));
    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    const url = await getDocumentUrl(doc.id);
    return res.status(200).json({ ...doc, url });
  } catch (err: any) {
    console.error('getDocument error →', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listDocuments(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;
    const docs = await db.select().from(documents).where(eq(documents.applicationId, applicationId));
    const docIds = docs.map((d) => d.id);
    const versions = docIds.length
      ? await db.select().from(documentVersions).where(inArray(documentVersions.documentId, docIds))
      : [];

    const withUrls = await Promise.all(
      docs.map(async (d) => ({
        ...d,
        url: await getDocumentUrl(d.id),
        versionCount: versions.filter((v) => v.documentId === d.id).length,
      }))
    );

    return res.status(200).json(withUrls);
  } catch (err: any) {
    console.error('listDocuments error →', err);
    return res.status(500).json({ error: err.message });
  }
}

//
// ======================================================
//  ACCEPT DOCUMENT
// ======================================================
//
export async function acceptDocument(req: Request, res: Response) {
  try {
    const { documentId } = req.params;
    const [doc] = await db
      .update(documents)
      .set({ status: 'accepted', rejectionReason: null, updatedAt: new Date() })
      .where(eq(documents.id, documentId))
      .returning();

    if (!doc) return res.status(404).json({ error: 'Document not found.' });

    await checkIfAllDocsAccepted(doc.applicationId);

    await logDocumentEvent(doc.applicationId, (req as any).user?.id ?? null, {
      action: 'accept',
      documentId,
    });

    return res.status(200).json(doc);
  } catch (err: any) {
    console.error('acceptDocument error →', err);
    return res.status(500).json({ error: err.message });
  }
}

//
// ======================================================
//  REJECT DOCUMENT
// ======================================================
//
export async function rejectDocument(req: Request, res: Response) {
  try {
    const { documentId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason required.' });
    }

    const [doc] = await db
      .update(documents)
      .set({ status: 'rejected', rejectionReason: reason, updatedAt: new Date() })
      .where(eq(documents.id, documentId))
      .returning();

    if (!doc) return res.status(404).json({ error: 'Document not found.' });

    await pipelineEventsRepo.create({
      applicationId: doc.applicationId,
      stage: 'Documents Required',
      reason: `Document rejected: ${reason}`,
    });

    await applicationsRepo.update(doc.applicationId, {
      pipelineStage: 'Documents Required',
      updatedAt: new Date(),
    });

    await logDocumentEvent(doc.applicationId, (req as any).user?.id ?? null, {
      action: 'reject',
      documentId,
      reason,
    });

    return res.status(200).json(doc);
  } catch (err: any) {
    console.error('rejectDocument error →', err);
    return res.status(500).json({ error: err.message });
  }
}

async function checkIfAllDocsAccepted(applicationId: string) {
  const docs = await db.select().from(documents).where(eq(documents.applicationId, applicationId));
  if (!docs.length) return false;

  const allAccepted = docs.every((d) => d.status === 'accepted');
  if (!allAccepted) return false;

  await pipelineEventsRepo.create({
    applicationId,
    stage: 'Ready for Signing',
    reason: 'All documents accepted',
  });

  await applicationsRepo.update(applicationId, {
    pipelineStage: 'Ready for Signing',
    updatedAt: new Date(),
  });

  return true;
}
