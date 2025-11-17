// server/src/db/registry.ts

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Drizzle client
export const db = drizzle(pool);

/**
 * ------------------------------------------------------------------
 * REGISTRY EXPORT
 * ------------------------------------------------------------------
 * Your service files do:
 *   import { registry } from "../db/registry.js";
 *
 * Those imports require this named export to exist.
 * Until real model objects are wired up, we export
 * stable empty objects so TypeScript and Node are happy.
 * ------------------------------------------------------------------
 */

export const registry = {
  applications: {},
  companies: {},
  deals: {},
  lenders: {},
};
