import { Router } from "express";
import { applicationService } from "../../../services/applicationService.js";
import { ApplicationCreateSchema } from "../../../schemas/application.schema.js";

const router = Router();

// Endpoint used by onboarding flows to create an application draft.
router.post("/", (req, res) => {
  const payload = ApplicationCreateSchema.parse(req.body);
  const application = applicationService.createApplication(payload);
  res.status(201).json({ message: "OK", data: application });
});

export default router;
