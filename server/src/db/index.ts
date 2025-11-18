// server/src/db/index.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to Azure Postgres via Prisma.");
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}
