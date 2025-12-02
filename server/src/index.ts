import http from "http";
import { app } from "./app.js";
import { ENV } from "./config/env.js";
import { initWebSocket } from "./realtime/ws.js";

const server = http.createServer(app);

const PORT = ENV.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Staff-Server running on port ${PORT}`);
});

initWebSocket(server);
