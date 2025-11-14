// controllers/lendersController.js
// -----------------------------------------------------
// Lender CRUD controller (silo-aware)
// Backed by the in-memory DB (db.lenders)
// -----------------------------------------------------

import { db } from "../services/db.js";
import { v4 as uuid } from "uuid";

// -----------------------------------------------------
// Utility — ensure silo is provided
// -----------------------------------------------------
function assertSilo(req) {
  const silo = req.params?.silo;
  if (!silo) {
    throw new Error("Missing silo in route parameters");
  }
  return silo;
}

// -----------------------------------------------------
// GET /api/:silo/lenders
// -----------------------------------------------------
export async function getLenders(req, res) {
  const silo = assertSilo(req);

  const results = db.lenders.data.filter((l) => l.silo === silo);

  res.status(200).json({
    ok: true,
    count: results.length,
    lenders: results,
  });
}

// -----------------------------------------------------
// POST /api/:silo/lenders
// -----------------------------------------------------
export async function createLender(req, res) {
  const silo = assertSilo(req);
  const body = req.body || {};

  const id = uuid();

  const record = {
    id,
    silo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Basic lender fields
    name: body.name || "Unnamed Lender",
    email: body.email || null,
    phone: body.phone || null,
    website: body.website || null,
    description: body.description || null,

    // Ready for future product-based expansions
    products: body.products || [],
  };

  db.lenders.data.push(record);

  res.status(201).json({
    ok: true,
    lender: record,
  });
}

// -----------------------------------------------------
// GET /api/:silo/lenders/:lenderId
// -----------------------------------------------------
export async function getLenderById(req, res) {
  const silo = assertSilo(req);
  const lenderId = req.params.lenderId;

  const found = db.lenders.data.find(
    (l) => l.id === lenderId && l.silo === silo
  );

  if (!found) {
    return res.status(404).json({
      ok: false,
      error: "Lender not found",
    });
  }

  res.status(200).json({
    ok: true,
    lender: found,
  });
}

// -----------------------------------------------------
// PUT /api/:silo/lenders/:lenderId
// -----------------------------------------------------
export async function updateLender(req, res) {
  const silo = assertSilo(req);
  const lenderId = req.params.lenderId;
  const updates = req.body || {};

  const index = db.lenders.data.findIndex(
    (l) => l.id === lenderId && l.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Lender not found",
    });
  }

  const updated = {
    ...db.lenders.data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.lenders.data[index] = updated;

  res.status(200).json({
    ok: true,
    lender: updated,
  });
}

// -----------------------------------------------------
// DELETE /api/:silo/lenders/:lenderId
// -----------------------------------------------------
export async function deleteLender(req, res) {
  const silo = assertSilo(req);
  const lenderId = req.params.lenderId;

  const index = db.lenders.data.findIndex(
    (l) => l.id === lenderId && l.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Lender not found",
    });
  }

  const removed = db.lenders.data.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    deleted: removed,
  });
}
