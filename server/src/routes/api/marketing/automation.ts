import { Router } from "express";
import { z } from "zod";
import { schedulerService } from "../../../services/schedulerService.js";
import { integrationsService } from "../../../services/integrationsService.js";

const createAutomationSchema = z.object({
  name: z.string().min(1, "name is required"),
  cronExpression: z.string().min(1, "cronExpression is required"),
  enabled: z.boolean().default(true)
});

const router = Router();

/**
 * GET /api/marketing/automation
 * Lists available integration webhooks relevant to marketing automations.
 */
router.get("/", async (_req, res) => {
  const webhooks = await integrationsService.listWebhooks();
  res.json({ webhooks });
});

/**
 * POST /api/marketing/automation
 * Registers a new marketing automation schedule.
 */
router.post("/", async (req, res) => {
  try {
    const payload = createAutomationSchema.parse(req.body);
    const task = {
      id: `automation-${Date.now()}`,
      name: payload.name,
      cronExpression: payload.cronExpression,
      enabled: payload.enabled
    };
    await schedulerService.registerTask(task);
    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({
      message: "Failed to register marketing automation",
      error: (error as Error).message
    });
  }
});

export default router;
