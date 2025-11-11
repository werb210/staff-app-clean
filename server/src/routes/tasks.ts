import { Router } from "express";

const router = Router();
const tasks: Record<string, any> = {};

// GET all tasks
router.get("/", (_req, res) => {
  res.json(Object.values(tasks));
});

// POST new task
router.post("/", (req, res) => {
  const id = `${Date.now()}`;
  const taskData = { id, ...req.body };
  tasks[id] = taskData;
  res.status(201).json(taskData);
});

export default router;
