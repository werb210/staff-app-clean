// server/src/services/smsService.ts

export const smsService = {
  async list() {
    return [
      { id: 1, msg: "Test SMS", to: "+15555555555", ts: Date.now() },
    ];
  },

  async send(to: string, msg: string) {
    // TODO: integrate Twilio later
    return {
      ok: true,
      id: crypto.randomUUID(),
      to,
      msg,
      ts: Date.now(),
    };
  },
};
