import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In-memory store for testing
const applications: Record<string, any> = {};

// GET all applications
router.get("/", (_req, res) => {
  res.json(Object.values(applications));
});

// POST new application
router.post("/", (req, res) => {
  const id = uuidv4();
  const appData = { id, ...req.body };
  applications[id] = appData;
  res.status(201).json(appData);
});

export default router;
