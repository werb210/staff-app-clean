import { Router } from "express";
import { applicationService } from "../../../services/applicationService.js";
import { ApplicationCompleteSchema } from "../../../schemas/application.schema.js";

const router = Router();

// Marks an application as fully completed.
router.post("/", (req, res) => {
  const payload = ApplicationCompleteSchema.parse(req.body);
  const application = applicationService.completeApplication(
    payload.id,
    payload.completedBy,
  );
  res.json({ message: "OK", data: application });
});

export default router;
