import { timelineRepo } from "../db/repositories/timeline.repo";

export const timelineService = {
  async add(applicationId: string, event: string, meta: any = {}) {
    return timelineRepo.insert({
      applicationId,
      event,
      meta,
      createdAt: new Date()
    });
  },

  async list(applicationId: string) {
    return timelineRepo.list(applicationId);
  }
};
