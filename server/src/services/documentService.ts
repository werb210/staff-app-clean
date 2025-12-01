import crypto from 'crypto';
import applicationsRepo from '../db/repositories/applications.repo.js';
import documentVersionsRepo from '../db/repositories/documentVersions.repo.js';
import documentsRepo from '../db/repositories/documents.repo.js';
import * as bankingService from './bankingService.js';
import * as blobService from './blobService.js';
import * as ocrService from './ocrService.js';

const BANKING_CATEGORIES = ['bank_statement', 'flinks_report'];

type UploadInput = {
  applicationId: string;
  documentId?: string | null;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  category?: string | null;
};

function buildBlobKey(applicationId: string, documentId: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${applicationId}/${documentId}/${Date.now()}_${safeName}`;
}

async function nextVersionNumber(documentId: string) {
  const latest = await documentVersionsRepo.findLatestVersion(documentId);
  return (latest?.versionNumber ?? 0) + 1;
}

async function updateApplicationDocStatus(applicationId: string) {
  const documents = await documentsRepo.findByApplication(applicationId);

  if (documents.length === 0) {
    return applicationsRepo.markApplicationDocStatus(applicationId, 'documents-required');
  }

  const allAccepted = documents.every((doc) => doc.status === 'accepted');
  return applicationsRepo.markApplicationDocStatus(
    applicationId,
    allAccepted ? 'documents-complete' : 'documents-required'
  );
}

async function runPostUploadPipelines(documentId: string, applicationId: string, category?: string | null) {
  await verifyChecksum(documentId);
  await ocrService.run(documentId);

  if (category && BANKING_CATEGORIES.includes(category)) {
    await bankingService.maybeRun(applicationId);
  }
}

export async function uploadDocument(input: UploadInput) {
  const { applicationId, documentId, fileName, mimeType, buffer, category } = input;

  const targetDocumentId = documentId || crypto.randomUUID();
  const blobKey = buildBlobKey(applicationId, targetDocumentId, fileName);
  const upload = await blobService.uploadBuffer(buffer, blobKey);
  const now = new Date();

  let current = documentId ? await documentsRepo.findById(documentId) : null;

  if (documentId && !current) {
    throw new Error('Document not found.');
  }

  if (current) {
    const versionNumber = await nextVersionNumber(current.id);
    await documentsRepo.saveVersion({
      documentId: current.id,
      versionNumber,
      azureBlobKey: current.azureBlobKey,
      checksum: current.checksum,
      sizeBytes: current.sizeBytes,
      createdAt: now,
    });

    current = await documentsRepo.update(current.id, {
      name: fileName,
      mimeType,
      category: category ?? current.category ?? null,
      azureBlobKey: upload.key,
      checksum: upload.checksum,
      sizeBytes: upload.sizeBytes,
      status: 'pending',
      rejectionReason: null,
      updatedAt: now,
    });
  } else {
    current = await documentsRepo.create({
      applicationId,
      name: fileName,
      category: category ?? null,
      mimeType,
      azureBlobKey: upload.key,
      checksum: upload.checksum,
      sizeBytes: upload.sizeBytes,
      status: 'pending',
      rejectionReason: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  await runPostUploadPipelines(current.id, applicationId, current.category);
  await updateApplicationDocStatus(applicationId);

  return current;
}

export async function getDocument(documentId: string) {
  const doc = await documentsRepo.findById(documentId);

  if (!doc) {
    throw new Error('Document not found.');
  }

  const downloadUrl = await blobService.getDownloadUrl(doc.azureBlobKey);

  return { ...doc, downloadUrl };
}

export async function listByApplication(applicationId: string) {
  return documentsRepo.findByApplication(applicationId);
}

export async function acceptDocument(documentId: string) {
  const doc = await documentsRepo.update(documentId, {
    status: 'accepted',
    rejectionReason: null,
    updatedAt: new Date(),
  });

  if (!doc) throw new Error('Document not found.');

  await updateApplicationDocStatus(doc.applicationId);
  return doc;
}

export async function rejectDocument(documentId: string, reason: string) {
  const doc = await documentsRepo.update(documentId, {
    status: 'rejected',
    rejectionReason: reason,
    updatedAt: new Date(),
  });

  if (!doc) throw new Error('Document not found.');

  await updateApplicationDocStatus(doc.applicationId);
  return doc;
}

export async function deleteDocument(documentId: string) {
  const doc = await documentsRepo.delete(documentId);

  if (!doc) throw new Error('Document not found.');

  await updateApplicationDocStatus(doc.applicationId);
  return doc;
}

export async function getDownloadUrl(documentId: string) {
  const doc = await documentsRepo.findById(documentId);
  if (!doc) throw new Error('Document not found.');

  return blobService.getDownloadUrl(doc.azureBlobKey);
}

export async function getVersionHistory(documentId: string) {
  const doc = await documentsRepo.findById(documentId);
  if (!doc) throw new Error('Document not found.');

  return documentsRepo.findVersions(documentId);
}

export async function verifyChecksum(documentId: string) {
  const doc = await documentsRepo.findById(documentId);
  if (!doc) throw new Error('Document not found.');

  const buffer = await blobService.getBuffer(doc.azureBlobKey);
  const computed = await blobService.sha256(buffer);

  const matches = computed === doc.checksum;

  if (!matches) {
    await documentsRepo.update(documentId, {
      status: 'rejected',
      rejectionReason: 'checksum_mismatch',
      updatedAt: new Date(),
    });
  }

  return { matches, checksum: computed };
}
