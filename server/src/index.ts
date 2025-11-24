import "dotenv/config";
import { app } from "./app.js";
import prisma from "./db/index.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const REQUIRE_DB = process.env.REQUIRE_DATABASE === "true";

async function start() {
  app.locals.dbReady = false;

  try {
    await prisma.$connect();
    app.locals.dbReady = true;
  } catch (err) {
    if (REQUIRE_DB) process.exit(1);
    app.locals.dbReady = false;
  }

  app.listen(PORT, () => {});
}

start();
