import { Router } from "express";

const router = Router();

// In-memory store for testing
const documents: Record<string, any> = {};

// GET all documents
router.get("/", (_req, res) => {
  res.json(Object.values(documents));
});

// POST new document
router.post("/", (req, res) => {
  const { applicationId, fileName, mimeType, content } = req.body;

  if (!applicationId || !fileName || !mimeType || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = `${applicationId}-${Date.now()}`;
  const docData = { id, applicationId, fileName, mimeType, content };
  documents[id] = docData;

  res.status(201).json(docData);
});

export default router;
