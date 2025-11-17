// server/src/db/migrator.ts
import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./registry.js";

async function run() {
  console.log("🚀 Running Drizzle migrations...");

  try {
    await migrate(db, { migrationsFolder: "server/src/db/migrations" });

    console.log("✅ Migrations complete");
    await pool.end();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    await pool.end();
    process.exit(1);
  }
}

run();
