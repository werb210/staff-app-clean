// controllers/documentsController.js
// -----------------------------------------------------
// Global Document Controller
// Backed by in-memory db.documents
// Azure Blob Storage-ready (placeholders included)
// -----------------------------------------------------

import { db } from "../services/db.js";
import { v4 as uuid } from "uuid";

// Placeholder for future Azure blob client
// import { blobClient } from "../services/azureBlob.js";

// -----------------------------------------------------
// Utility: get document by ID
// -----------------------------------------------------
function findDoc(id) {
  return db.documents.data.find((d) => d.id === id);
}

// -----------------------------------------------------
// GET /api/documents
// -----------------------------------------------------
export async function getDocuments(req, res) {
  res.status(200).json({
    ok: true,
    count: db.documents.data.length,
    documents: db.documents.data,
  });
}

// -----------------------------------------------------
// POST /api/documents (UPLOAD)
// For now: metadata-only upload (no file upload system yet)
// -----------------------------------------------------
export async function uploadDocument(req, res) {
  const body = req.body || {};

  const id = uuid();
  const version = 1;

  const record = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Document fields
    name: body.name || "Untitled Document",
    category: body.category || null,
    mimeType: body.mimeType || null,

    // Storage info: placeholder for Azure blob path
    blobPath: body.blobPath || null,

    // Versioning
    version,
    versions: [
      {
        version,
        createdAt: new Date().toISOString(),
        notes: body.notes || null,
      },
    ],

    // Meta
    tags: body.tags || [],
    description: body.description || "",

    // Application link
    applicationId: body.applicationId || null,
  };

  db.documents.data.push(record);

  res.status(201).json({
    ok: true,
    document: record,
  });
}

// -----------------------------------------------------
// GET /api/documents/:documentId
// -----------------------------------------------------
export async function getDocumentById(req, res) {
  const id = req.params.documentId;
  const doc = findDoc(id);

  if (!doc) {
    return res.status(404).json({
      ok: false,
      error: "Document not found",
    });
  }

  res.status(200).json({
    ok: true,
    document: doc,
  });
}

// -----------------------------------------------------
// PUT /api/documents/:documentId
// Update metadata only
// -----------------------------------------------------
export async function updateDocument(req, res) {
  const id = req.params.documentId;
  const updates = req.body || {};

  const index = db.documents.data.findIndex((d) => d.id === id);

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Document not found",
    });
  }

  const current = db.documents.data[index];

  // Version bump if needed
  if (updates.newVersion === true) {
    const newVer = current.version + 1;
    current.versions.push({
      version: newVer,
      createdAt: new Date().toISOString(),
      notes: updates.notes || null,
    });
    updates.version = newVer;
  }

  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.documents.data[index] = updated;

  res.status(200).json({
    ok: true,
    document: updated,
  });
}

// -----------------------------------------------------
// DELETE /api/documents/:documentId
// Soft-delete only (no file removal yet)
// -----------------------------------------------------
export async function deleteDocument(req, res) {
  const id = req.params.documentId;

  const index = db.documents.data.findIndex((d) => d.id === id);

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Document not found",
    });
  }

  const removed = db.documents.data.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    deleted: removed,
  });
}

// -----------------------------------------------------
// GET /api/documents/:documentId/download
// Placeholder download endpoint
// -----------------------------------------------------
export async function downloadDocument(req, res) {
  const id = req.params.documentId;
  const doc = findDoc(id);

  if (!doc) {
    return res.status(404).json({
      ok: false,
      error: "Document not found",
    });
  }

  // Placeholder behavior: return blob metadata
  // Later: return Azure Blob signed URL or stream binary
  res.status(200).json({
    ok: true,
    documentId: id,
    download: {
      blobPath: doc.blobPath,
      message: "Azure Blob download integration pending.",
    },
  });
}
