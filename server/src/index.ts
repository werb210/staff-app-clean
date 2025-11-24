import "dotenv/config";
import express from "express";
import { app } from "./app.js";
import prisma, { prismaInitError, prismaIsAvailable } from "./db/index.js";

// Azure injects PORT dynamically → always respect it
// Default fallback MUST be 8080 for App Service
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// Optional strict startup behavior
const REQUIRE_DB = process.env.REQUIRE_DATABASE === "true";

async function start() {
  app.locals.dbReady = false;

  // ------------------------------
  //  Attempt database connection
  // ------------------------------
  if (prisma) {
    try {
      await prisma.$connect();
      console.log("✅ Database connected");
      app.locals.dbReady = true;
    } catch (err) {
      console.error("❌ Database connection failed:", err);

      if (REQUIRE_DB) {
        console.error("REQUIRE_DATABASE=true → exiting.");
        process.exit(1);
      }

      // Allow server to run without DB
      console.warn("⚠️ Starting server WITHOUT database.");
      app.locals.dbReady = false;
    }
  }

  // ------------------------------
  //    Start HTTP server
  // ------------------------------
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Staff Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start HTTP server:", err);
    process.exit(1);
  }
}

start();
