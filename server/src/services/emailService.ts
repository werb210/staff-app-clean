// server/src/services/emailService.ts
import crypto from "crypto";

export const emailService = {
  async list() {
    return [
      { id: 1, subject: "Welcome!", ts: Date.now(), to: "test@example.com" },
    ];
  },

  async send(to: string, subject: string, body: string) {
    return {
      ok: true,
      id: crypto.randomUUID(),
      to,
      subject,
      body,
      ts: Date.now(),
    };
  },
};
