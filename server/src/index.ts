import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;

// --- ROOT ROUTE ---
app.get("/", (_req, res) => {
  res.send("Staff API is running");
});

// --- MOUNT OTHER ROUTES BELOW ---
import apiRouter from "./routes/index.js";
app.use("/api", apiRouter);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Staff API running on port ${PORT}`);
});
