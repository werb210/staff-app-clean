// server/src/realtime/ws.ts
import { WebSocketServer, WebSocket, RawData } from "ws";
import { verifyToken } from "../utils/jwt.js";
import messagesRepo from "../db/repositories/messages.repo.js";

export function initWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket, req: any) => {
    try {
      const token = new URL(req.url!, "http://x").searchParams.get("token");
      const user = verifyToken(token || "");
      (ws as any).user = user;
    } catch {
      ws.close();
      return;
    }

    ws.on("message", async (raw: RawData) => {
      const msg = JSON.parse(raw.toString());
      await messagesRepo.create({
        applicationId: msg.applicationId,
        senderId: (ws as any).user.id,
        body: msg.body,
      });
    });
  });

  return wss;
}
