import { userTokensRepo } from "../db/repositories/userTokens.repo";

export const userTokenService = {
  async save(userId: string, token: string, type: string) {
    return userTokensRepo.insert({
      userId,
      token,
      type,
      createdAt: new Date()
    });
  },

  async list(userId: string) {
    return userTokensRepo.listByUser(userId);
  }
};
