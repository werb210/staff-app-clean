// routes/applications.routes.js
// -----------------------------------------------------
// Silo-scoped application routes
// Mounted at: /api/:silo/applications
// -----------------------------------------------------

import { Router } from "express";
import {
  getApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationsController.js";

const router = Router({ mergeParams: true });

// -----------------------------------------------------
// Helper — async wrapper to prevent unhandled rejections
// -----------------------------------------------------
const wrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// -----------------------------------------------------
// Validate appId parameter
// -----------------------------------------------------
router.param("appId", (req, res, next, value) => {
  if (!value || typeof value !== "string" || value.length < 8) {
    return res.status(400).json({
      ok: false,
      error: "Invalid application ID",
      received: value,
    });
  }
  next();
});

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------
router.get("/", wrap(getApplications));
router.post("/", wrap(createApplication));
router.get("/:appId", wrap(getApplicationById));
router.put("/:appId", wrap(updateApplication));
router.delete("/:appId", wrap(deleteApplication));

export default router;
