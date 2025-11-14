// controllers/companiesController.js
// -----------------------------------------------------
// Global Companies Controller
// Backed by in-memory db.companies
// -----------------------------------------------------

import { db } from "../services/db.js";
import { v4 as uuid } from "uuid";

// -----------------------------------------------------
// GET /api/companies
// -----------------------------------------------------
export async function getCompanies(req, res) {
  const results = db.companies.data;

  res.status(200).json({
    ok: true,
    count: results.length,
    companies: results,
  });
}

// -----------------------------------------------------
// POST /api/companies
// -----------------------------------------------------
export async function createCompany(req, res) {
  const body = req.body || {};

  const id = uuid();

  const record = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Core company fields
    name: body.name || "",
    website: body.website || "",
    phone: body.phone || "",
    email: body.email || "",
    address: body.address || "",
    industry: body.industry || "",
    size: body.size || null,

    // CRM fields
    notes: body.notes || "",
    tags: body.tags || [],

    // Optional: link contacts
    contacts: body.contacts || [],
  };

  db.companies.data.push(record);

  res.status(201).json({
    ok: true,
    company: record,
  });
}

// -----------------------------------------------------
// GET /api/companies/:companyId
// -----------------------------------------------------
export async function getCompanyById(req, res) {
  const cid = req.params.companyId;

  const found = db.companies.data.find((c) => c.id === cid);

  if (!found) {
    return res.status(404).json({
      ok: false,
      error: "Company not found",
    });
  }

  res.status(200).json({
    ok: true,
    company: found,
  });
}

// -----------------------------------------------------
// PUT /api/companies/:companyId
// -----------------------------------------------------
export async function updateCompany(req, res) {
  const cid = req.params.companyId;
  const updates = req.body || {};

  const index = db.companies.data.findIndex((c) => c.id === cid);

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Company not found",
    });
  }

  const updated = {
    ...db.companies.data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.companies.data[index] = updated;

  res.status(200).json({
    ok: true,
    company: updated,
  });
}

// -----------------------------------------------------
// DELETE /api/companies/:companyId
// -----------------------------------------------------
export async function deleteCompany(req, res) {
  const cid = req.params.companyId;

  const index = db.companies.data.findIndex((c) => c.id === cid);

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Company not found",
    });
  }

  const removed = db.companies.data.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    deleted: removed,
  });
}
