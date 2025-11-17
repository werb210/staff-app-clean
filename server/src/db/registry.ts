// server/src/db/registry.ts

// (Removed drizzle-orm entirely)
// import { drizzle } from "drizzle-orm/node-postgres";

import pg from "pg";
const { Pool } = pg;

// Ensure database URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

// Create Postgres connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ---------------------------------------------------------
// REGISTRY EXPORT
// ---------------------------------------------------------
//
// Your service files do:
//   import { registry } from "../db/registry.js";
//
// This object MUST exist.  
// Until real model objects are wired up, we export
// stable empty objects so TypeScript and Node are happy.

export const registry = {
  applications: {},
  companies: {},
  deals: {},
  lenders: {},
};
