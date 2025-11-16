// server/src/app.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ---- CORS (Azure + NodeNext safe) ----
app.use(
  cors({
    origin: "*",              // must NOT combine "*" with credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---- Body Parsing ----
app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ---- API Routes ----
app.use("/api", routes);

// ---- Global Error Handler ----
app.use(errorHandler);

export default app;
