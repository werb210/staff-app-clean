// server/src/services/communicationService.ts
import { addActivity } from "./timelineService.js";

export const communicationService = {
  async listSMS() {
    return [{ id: 1, msg: "Hello world", ts: Date.now() }];
  },

  async listEmails() {
    return [{ id: 1, subject: "Test Email", ts: Date.now() }];
  },

  async logChatActivity({ applicationId, body, senderId }: any) {
    await addActivity({
      applicationId,
      type: "chat",
      message: body,
      userId: senderId,
    });
  },
};
