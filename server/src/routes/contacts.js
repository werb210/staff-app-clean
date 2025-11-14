// routes/contacts.js
// -----------------------------------------------------
// Global Contacts Routes (NOT silo-based)
// Mounted at: /api/contacts
// -----------------------------------------------------

import { Router } from "express";
import {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactsController.js";

const router = Router();

// -----------------------------------------------------
// Async wrapper (Express 5 safe)
// -----------------------------------------------------
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -----------------------------------------------------
// Param validator
// -----------------------------------------------------
router.param("contactId", (req, res, next, value) => {
  if (!value || typeof value !== "string" || value.length < 6) {
    return res.status(400).json({
      ok: false,
      error: "Invalid contact ID",
      received: value,
    });
  }
  next();
});

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------

// GET all contacts
router.get("/", wrap(getContacts));

// CREATE a new contact
router.post("/", wrap(createContact));

// GET single contact
router.get("/:contactId", wrap(getContactById));

// UPDATE contact
router.put("/:contactId", wrap(updateContact));

// DELETE contact
router.delete("/:contactId", wrap(deleteContact));

export default router;
