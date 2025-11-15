import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";

import appRouter from "./app.js";
import env from "./utils/env.js";
import { query } from "./db.js";

// --- ESM dirname fix ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Create server instance ---
const app = express();
const PORT = env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// --- Internal Health Checks ---
app.get("/api/_int/health", (_, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

app.get("/api/_int/build", (_, res) => {
  res.status(200).json({ ok: true, source: "build-check" });
});

app.get("/api/_int/db", async (_, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.status(200).json({ ok: true, dbTime: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/_int/routes", (_, res) => {
  const routes: any[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(middleware.route.path);
    }
  });
  res.status(200).json({ ok: true, routes });
});

// --- Mount API ---
app.use("/api", appRouter);

// --- Root fallback ---
app.get("/", (_, res) => {
  res.status(200).send("Boreal Staff API is running");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Staff API running on port ${PORT}`);
});
