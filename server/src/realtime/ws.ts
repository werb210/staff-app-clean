import { WebSocketServer } from "ws";
import { verifyJwt } from "../services/authService.js";
import { saveChatMessage } from "../services/chatService.js";

const clients = new Map<string, any>(); // userId → ws

export function initWebsocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const token = new URL(req.url ?? "", "http://localhost").searchParams.get("token");
    if (!token) return ws.close();

    let user;
    try {
      user = verifyJwt(token);
    } catch {
      return ws.close();
    }

    clients.set((user as any).id, ws);

    ws.on("message", async (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      switch (msg.type) {
        case "chat:send":
          await saveChatMessage({
            senderId: (user as any).id,
            applicationId: msg.applicationId,
            body: msg.body,
            attachments: msg.attachments ?? [],
          });

          broadcast({
            type: "chat:new",
            applicationId: msg.applicationId,
            senderId: (user as any).id,
            body: msg.body,
            attachments: msg.attachments ?? [],
            createdAt: new Date().toISOString(),
          });
          break;

        case "pipeline:move":
          broadcast(msg); // staff pipeline UI refresh
          break;
      }
    });

    ws.on("close", () => {
      clients.delete((user as any).id);
    });
  });

  (global as any).broadcast = broadcast;
}

export function broadcast(data: any) {
  const json = JSON.stringify(data);
  for (const ws of clients.values()) {
    try {
      ws.send(json);
    } catch {}
  }
}
