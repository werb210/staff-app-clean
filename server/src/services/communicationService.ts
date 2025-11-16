// server/src/services/communicationService.ts
export const communicationService = {
  async listSMS() {
    return [{ id: 1, msg: "Hello world", ts: Date.now() }];
  },

  async listEmails() {
    return [{ id: 1, subject: "Test Email", ts: Date.now() }];
  },
};
