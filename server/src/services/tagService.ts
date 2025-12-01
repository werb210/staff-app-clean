import { tagsRepo } from "../db/repositories/tags.repo";

export const tagService = {
  async list() {
    return tagsRepo.listAll();
  },

  async create(name: string) {
    return tagsRepo.create(name);
  },

  async remove(id: string) {
    return tagsRepo.remove(id);
  }
};
