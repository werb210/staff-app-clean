import { Router } from "express";
import { applicationService } from "../../../services/applicationService.js";
import { ApplicationSubmitSchema } from "../../../schemas/application.schema.js";

const router = Router();

// Marks an application as submitted by a staff member.
router.post("/", (req, res) => {
  const payload = ApplicationSubmitSchema.parse(req.body);
  const application = applicationService.submitApplication(
    payload.id,
    payload.submittedBy,
  );
  res.json({ message: "OK", data: application });
});

export default router;
