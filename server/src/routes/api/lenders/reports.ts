import { Router } from "express";
import { lenderService } from "../../../services/lenderService.js";

const router = Router();

// Returns aggregated lender analytics from the stub service.
router.get("/", (_req, res) => {
  const report = lenderService.generateReports();
  res.json({ message: "OK", data: report });
});

export default router;
