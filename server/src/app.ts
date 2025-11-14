// app.ts
// -----------------------------------------------------
// Minimal express app wrapper used ONLY for testing
// -----------------------------------------------------

import express from "express";

const app = express();

// This file no longer mounts routers or middleware.
// All real logic exists in src/index.ts.
// app.ts is now a lightweight test harness only.

export default app;
