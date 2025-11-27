import http from "http";
import app from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

async function startServer() {
  try {
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log("=== STAFF SERVER STARTED ===");
      console.log("PORT:", PORT);
      console.log("NODE_ENV:", process.env.NODE_ENV);
      console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
      console.log("=================================");
    });

    server.on("error", (err) => {
      console.error("SERVER ERROR:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("FATAL STARTUP ERROR:", err);
    process.exit(1);
  }
}

startServer();
