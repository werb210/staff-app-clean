// controllers/applicationsController.js
// -----------------------------------------------------
// Application CRUD controller (silo-aware)
// Backed by the in-memory DB (db.services.js)
// -----------------------------------------------------

import { db } from "../services/db.js";
import { v4 as uuid } from "uuid";

// -----------------------------------------------------
// Utility: ensure silo exists
// -----------------------------------------------------
function assertSilo(req) {
  const silo = req.params?.silo;
  if (!silo) {
    throw new Error("Missing silo in route parameters");
  }
  return silo;
}

// -----------------------------------------------------
// GET /api/:silo/applications
// -----------------------------------------------------
export async function getApplications(req, res) {
  const silo = assertSilo(req);
  const results = db.applications.data.filter((a) => a.silo === silo);

  res.status(200).json({
    ok: true,
    count: results.length,
    applications: results,
  });
}

// -----------------------------------------------------
// POST /api/:silo/applications
// -----------------------------------------------------
export async function createApplication(req, res) {
  const silo = assertSilo(req);
  const body = req.body || {};

  const id = uuid();

  const record = {
    id,
    silo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };

  db.applications.data.push(record);

  res.status(201).json({
    ok: true,
    application: record,
  });
}

// -----------------------------------------------------
// GET /api/:silo/applications/:appId
// -----------------------------------------------------
export async function getApplicationById(req, res) {
  const silo = assertSilo(req);
  const appId = req.params.appId;

  const found = db.applications.data.find(
    (a) => a.id === appId && a.silo === silo
  );

  if (!found) {
    return res.status(404).json({
      ok: false,
      error: "Application not found",
    });
  }

  res.status(200).json({
    ok: true,
    application: found,
  });
}

// -----------------------------------------------------
// PUT /api/:silo/applications/:appId
// -----------------------------------------------------
export async function updateApplication(req, res) {
  const silo = assertSilo(req);
  const appId = req.params.appId;
  const updates = req.body || {};

  const index = db.applications.data.findIndex(
    (a) => a.id === appId && a.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Application not found",
    });
  }

  const updated = {
    ...db.applications.data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.applications.data[index] = updated;

  res.status(200).json({
    ok: true,
    application: updated,
  });
}

// -----------------------------------------------------
// DELETE /api/:silo/applications/:appId
// -----------------------------------------------------
export async function deleteApplication(req, res) {
  const silo = assertSilo(req);
  const appId = req.params.appId;

  const index = db.applications.data.findIndex(
    (a) => a.id === appId && a.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Application not found",
    });
  }

  const removed = db.applications.data.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    deleted: removed,
  });
}
