// server/src/index.ts
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";

import env from "./utils/env.js";
import { registry } from "./db/registry.js";       // FIXED: unified SafeTable registry
import apiRouter from "./routes/index.js";

// ---- dirname fix for ESM ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- create app ----
const app = express();
const PORT = env.PORT || 5000;

// ---- middleware ----
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ---- internal health checks ----
app.get("/api/_int/health", (_, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

app.get("/api/_int/build", (_, res) => {
  res.status(200).json({ ok: true, source: "build-check" });
});

app.get("/api/_int/db", async (_, res) => {
  try {
    const now = await registry.system.query("SELECT NOW()");   // FIXED
    res.status(200).json({ ok: true, dbTime: now.rows[0] });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---- route inspector ----
app.get("/api/_int/routes", (_, res) => {
  const routes: any[] = [];

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) routes.push(middleware.route.path);
    if (middleware.name === "router" && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) routes.push(handler.route.path);
      });
    }
  });

  res.status(200).json({ ok: true, routes });
});

// ---- API router ----
app.use("/api", apiRouter);

// ---- fallback ----
app.get("/", (_, res) => {
  res.status(200).send("Boreal Staff API is running");
});

// ---- start server ----
app.listen(PORT, () => {
  console.log(`🚀 Staff API running on port ${PORT}`);
});

export default app;
