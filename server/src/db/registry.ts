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
 * EXPORT REGISTRY OBJECT
 * Your services expect this EXACT shape:
 *   import { registry } from "../db/registry.js"
 *
 * Since you removed the actual model definitions,
 * we provide stable empty objects to satisfy imports.
 */
export const registry = {
  applications: {},
  companies: {},
  deals: {},
  lenders: {},
};
