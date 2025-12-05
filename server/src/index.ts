import { createServer } from "http";
import app from "./app";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Staff Server running on port ${PORT}`);
});
