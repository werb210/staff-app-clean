import { Router } from "express";

const router = Router();

// Returns a static set of operational tasks for the UI to render.
router.get("/", (_req, res) => {
  res.json({
    message: "OK",
    data: [
      { id: "task-1", name: "Review application", dueAt: new Date().toISOString() },
      { id: "task-2", name: "Call borrower", dueAt: new Date().toISOString() },
    ],
  });
});

export default router;
