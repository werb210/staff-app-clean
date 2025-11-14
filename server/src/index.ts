import "dotenv/config";
import express, { type RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import morgan from "morgan";

import serverPackageJson from "../package.json" with { type: "json" };
import { errorHandler } from "./middlewares/errorHandler.js";
import apiRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import contactsRouter from "./routes/contacts.js";
import companiesRouter from "./routes/companies.js";
import dealsRouter from "./routes/deals.js";
import documentsRouter from "./routes/documents.js";
import pipelineRouter from "./routes/pipeline.js";
import communicationRouter from "./routes/communication.js";
import { db, type Silo } from "./services/db.js";
import { describeDatabaseUrl } from "./utils/env.js";
import appModule from "./app.js";

// -----------------------------------------------
// EXPRESS APP INITIALIZATION
// -----------------------------------------------
const app = express();
const SERVICE_NAME = "staff-backend";
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000; // Ensure 5000 for Codespaces

// -----------------------------------------------
// REQUIRED ENV VALIDATION
// -----------------------------------------------
const requiredEnv = ["DATABASE_URL"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}

// -----------------------------------------------
// GLOBAL MIDDLEWARE
// -----------------------------------------------
app.use(cors({ origin: true, credentials: true }));
app.use(helmet() as unknown as RequestHandler);
app.use(compression() as unknown as RequestHandler);
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));

// -----------------------------------------------
// HELPERS
// -----------------------------------------------
const resolveBuildCommit = () =>
  process.env.GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.COMMIT_HASH ??
  null;

const summariseSiloTables = (records: Record<Silo, { data: unknown[] }>) =>
  Object.fromEntries(
    (Object.entries(records) as [Silo, { data: unknown[] }][]).map(
      ([silo, table]) => [silo, table.data.length]
    )
  );

// -----------------------------------------------
// INTERNAL HEALTH CHECKS
// -----------------------------------------------
app.get("/api/_int/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
    service: SERVICE_NAME,
  });
});

// -----------------------------------------------
// MAIN API ROUTER
// -----------------------------------------------
app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/pipeline", pipelineRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/comm", communicationRouter);
app.use("/api", apiRouter);

// -----------------------------------------------
// GLOBAL ERROR HANDLER
// -----------------------------------------------
app.use(errorHandler);

// -----------------------------------------------
// SERVER START
// -----------------------------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Staff API running on port ${PORT} and accessible externally`);
});
