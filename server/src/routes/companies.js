// routes/companies.js
// -----------------------------------------------------
// Global Companies Routes (NOT silo-based)
// Mounted at: /api/companies
// -----------------------------------------------------

import { Router } from "express";
import {
  getCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/companiesController.js";

const router = Router();

// -----------------------------------------------------
// Async wrapper (Express 5-safe)
// -----------------------------------------------------
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -----------------------------------------------------
// Param validator
// -----------------------------------------------------
router.param("companyId", (req, res, next, value) => {
  if (!value || typeof value !== "string" || value.length < 6) {
    return res.status(400).json({
      ok: false,
      error: "Invalid company ID",
      received: value,
    });
  }
  next();
});

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------

// GET all companies
router.get("/", wrap(getCompanies));

// CREATE a new company
router.post("/", wrap(createCompany));

// GET single company
router.get("/:companyId", wrap(getCompanyById));

// UPDATE company
router.put("/:companyId", wrap(updateCompany));

// DELETE company
router.delete("/:companyId", wrap(deleteCompany));

export default router;
