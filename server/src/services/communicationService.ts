import messagesRepo from "../db/repositories/messages.repo.js";

export const communicationService = {
  async sendMessage(payload: any) {
    return messagesRepo.create({
      ...payload,
      createdAt: new Date(),
    });
  },
};

export default communicationService;
