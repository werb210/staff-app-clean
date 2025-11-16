// server/src/index.ts
import "dotenv/config";

// Azure/NodeNext safe import
import app from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

try {
  app.listen(PORT, () => {
    console.log(`🚀 Staff API running on port ${PORT}`);
  });
} catch (err) {
  console.error("❌ Failed to start Staff API:", err);
  process.exit(1);
}
