// server/src/services/notificationsService.ts

import { emailService } from "./emailService.js";
import { smsService } from "./smsService.js";

export const notificationsService = {
  async all() {
    return {
      sms: await smsService.list(),
      emails: await emailService.list(),
    };
  },
};
