// controllers/contactsController.js
// -----------------------------------------------------
// Global Contacts Controller
// Backed by in-memory db.contacts
// -----------------------------------------------------

import { db } from "../services/db.js";
import { v4 as uuid } from "uuid";

// -----------------------------------------------------
// GET /api/contacts
// -----------------------------------------------------
export async function getContacts(req, res) {
  const results = db.contacts.data;

  res.status(200).json({
    ok: true,
    count: results.length,
    contacts: results,
  });
}

// -----------------------------------------------------
// POST /api/contacts
// -----------------------------------------------------
export async function createContact(req, res) {
  const body = req.body || {};

  const id = uuid();

  const record = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Basic CRM fields
    firstName: body.firstName || "",
    lastName: body.lastName || "",
    email: body.email || "",
    phone: body.phone || "",
    company: body.company || "",
    position: body.position || "",
    notes: body.notes || "",

    // Optional metadata support
    tags: body.tags || [],
    source: body.source || null,
  };

  db.contacts.data.push(record);

  res.status(201).json({
    ok: true,
    contact: record,
  });
}

// -----------------------------------------------------
// GET /api/contacts/:contactId
// -----------------------------------------------------
export async function getContactById(req, res) {
  const cid = req.params.contactId;

  const found = db.contacts.data.find((c) => c.id === cid);

  if (!found) {
    return res.status(404).json({
      ok: false,
      error: "Contact not found",
    });
  }

  res.status(200).json({
    ok: true,
    contact: found,
  });
}

// -----------------------------------------------------
// PUT /api/contacts/:contactId
// -----------------------------------------------------
export async function updateContact(req, res) {
  const cid = req.params.contactId;
  const updates = req.body || {};

  const index = db.contacts.data.findIndex((c) => c.id === cid);

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Contact not found",
    });
  }

  const updated = {
    ...db.contacts.data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.contacts.data[index] = updated;

  res.status(200).json({
    ok: true,
    contact: updated,
  });
}

// -----------------------------------------------------
// DELETE /api/contacts/:contactId
// -----------------------------------------------------
export async function deleteContact(req, res) {
  const cid = req.params.contactId;

  const index = db.contacts.data.findIndex((c) => c.id === cid);

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Contact not found",
    });
  }

  const removed = db.contacts.data.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    deleted: removed,
  });
}
