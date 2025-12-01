import { productsRepo } from "../db/repositories/products.repo";

export const productsService = {
  async list() {
    return productsRepo.listAll();
  },

  async get(id: string) {
    return productsRepo.findById(id);
  },

  async create(data: any) {
    return productsRepo.create(data);
  },

  async update(id: string, data: any) {
    return productsRepo.update(id, data);
  }
};
