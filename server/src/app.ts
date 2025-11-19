// server/src/app.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// ROUTES (must use .js for CJS output)
import applicationsRoutes from "./routes/applications.routes.js";
import ocrRoutes from "./routes/ocr.routes.js";
import searchRoutes from "./routes/search.routes.js";
import tagsRoutes from "./routes/tags.routes.js";
import healthRoutes from "./routes/health.routes.js";

export const app = express();

// Global middleware
app.use(cors());
app.use(bodyParser.json());

// --- INTERNAL HEALTH CHECK (Azure liveness probes) ---
app.use("/api/_int/health", healthRoutes);

// --- MAIN API ROUTES ---
app.use("/api/applications", applicationsRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/tags", tagsRoutes);

// --- ROOT ROUTE ---
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "staff-server",
    dbReady: Boolean(app.locals.dbReady),
    uptime: process.uptime(),
  });
});
