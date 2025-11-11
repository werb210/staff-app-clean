import { Router } from "express";
import { applicationService } from "../services/applicationService.js";
import {
  ApplicationCreateSchema,
  ApplicationStatusUpdateSchema,
} from "../schemas/application.schema.js";

const router = Router();

// Lists every application currently tracked by the service.
router.get("/", (_req, res) => {
  const applications = applicationService.listApplications();
  res.json({ message: "OK", data: applications });
});

// Fetches a single application by identifier.
router.get("/:id", (req, res) => {
  const application = applicationService.getApplication(req.params.id);
  res.json({ message: "OK", data: application });
});

// Creates a new application after validating the input payload.
router.post("/", (req, res) => {
  const payload = ApplicationCreateSchema.parse(req.body);
  const created = applicationService.createApplication(payload);
  res.status(201).json({ message: "OK", data: created });
});

// Updates the status of an existing application.
router.post("/:id/status", (req, res) => {
  const payload = ApplicationStatusUpdateSchema.parse({
    id: req.params.id,
    status: req.body.status,
  });
  const updated = applicationService.updateStatus(payload.id, payload.status);
  res.json({ message: "OK", data: updated });
});

export default router;
