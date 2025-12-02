import smsQueueRepo from "../db/repositories/smsQueue.repo.js";

export const smsQueueService = {
  enqueue(data: any) {
    return smsQueueRepo.create({
      ...data,
      createdAt: new Date(),
      status: "pending",
    });
  },

  listPending() {
    return smsQueueRepo.findMany({ status: "pending" });
  },

  update(id: string, data: any) {
    return smsQueueRepo.update(id, data);
  },
};

export default smsQueueService;
