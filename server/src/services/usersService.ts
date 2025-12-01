import { usersRepo } from "../db/repositories/users.repo";

export const usersService = {
  async list() {
    return usersRepo.listAll();
  },

  async get(id: string) {
    return usersRepo.findById(id);
  },

  async create(data: any) {
    return usersRepo.create(data);
  },

  async update(id: string, data: any) {
    return usersRepo.update(id, data);
  }
};
