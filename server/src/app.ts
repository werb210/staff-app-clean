import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Unified API router
import apiRouter from "./routes/index.js";

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// --- Mount all API routes ---
app.use("/api", apiRouter);

// --- Fallback (should never hit if routes work) ---
app.get("/", (_, res) => {
  res.status(200).send("Boreal Staff API");
});

export default app;
