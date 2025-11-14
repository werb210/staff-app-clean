// routes/lenders.routes.js
// -----------------------------------------------------
// Silo-scoped lender routes
// Mounted at: /api/:silo/lenders
// -----------------------------------------------------

import { Router } from "express";
import {
  getLenders,
  createLender,
  getLenderById,
  updateLender,
  deleteLender,
} from "../controllers/lendersController.js";

const router = Router({ mergeParams: true });

// -----------------------------------------------------
// Helper — async wrapper (Express 5 compatible)
// -----------------------------------------------------
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -----------------------------------------------------
// Validate lenderId param
// -----------------------------------------------------
router.param("lenderId", (req, res, next, value) => {
  if (!value || typeof value !== "string" || value.length < 6) {
    return res.status(400).json({
      ok: false,
      error: "Invalid lender ID",
      received: value,
    });
  }
  next();
});

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------
router.get("/", wrap(getLenders));
router.post("/", wrap(createLender));
router.get("/:lenderId", wrap(getLenderById));
router.put("/:lenderId", wrap(updateLender));
router.delete("/:lenderId", wrap(deleteLender));

export default router;
