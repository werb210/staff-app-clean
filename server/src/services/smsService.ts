import { smsLogsRepo } from "../db/repositories/smsLogs.repo";

export const smsService = {
  async send(to: string, text: string) {
    // actual sending is controller responsibility
    return smsLogsRepo.insert({
      to,
      text,
      createdAt: new Date()
    });
  }
};
