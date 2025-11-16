// server/src/services/emailService.ts

export const emailService = {
  async list() {
    return [
      { id: 1, subject: "Welcome!", ts: Date.now(), to: "test@example.com" },
    ];
  },

  async send(to: string, subject: string, body: string) {
    // TODO: integrate SendGrid later
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
