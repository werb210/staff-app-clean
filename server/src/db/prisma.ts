import { PrismaClient } from "@prisma/client";

const hasDbUrl = Boolean(process.env.DATABASE_URL);

let prisma: PrismaClient;

if (hasDbUrl) {
  prisma = new PrismaClient();
} else {
  prisma = new Proxy(
    {},
    {
      get() {
        throw new Error("DATABASE_URL is not set.");
      }
    }
  ) as PrismaClient;
}

export default prisma;
export { prisma };
