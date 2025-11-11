import { Router } from "express";
import { z } from "zod";

const router = Router();

const AutomationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  trigger: z.string().min(1),
});

// Lists available marketing automation workflows.
router.get("/", (_req, res) => {
  res.json({
    message: "OK",
    data: [
      { id: "c4f0493a-8a93-4aa1-8f86-d49aa5e40f62", name: "Welcome", trigger: "signup" },
      { id: "032677f3-43f1-4f69-a821-4c7d2478087e", name: "Nurture", trigger: "abandoned" },
    ],
  });
});

// Validates automation definitions so front-end flows can test payloads.
router.post("/", (req, res) => {
  const automation = AutomationSchema.parse(req.body);
  res.status(201).json({ message: "OK", data: automation });
});

export default router;
