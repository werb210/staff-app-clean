import { smsQueueRepo } from "../db/repositories/smsQueue.repo";

export const smsQueueService = {
  async enqueue(to: string, text: string, meta = {}) {
    return smsQueueRepo.insert({
      to,
      text,
      meta,
      status: "pending",
      createdAt: new Date()
    });
  },

  async listPending() {
    return smsQueueRepo.listByStatus("pending");
  },

  async markSent(id: string) {
    return smsQueueRepo.update(id, { status: "sent" });
  }
};
