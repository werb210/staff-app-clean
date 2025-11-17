import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// MOUNT API ROUTES
app.use("/api", router);

// ROOT PING
app.get("/", (_, res) => {
  res.json({ ok: true, message: "Staff API root reached" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Staff API running on port ${PORT}`);
});
