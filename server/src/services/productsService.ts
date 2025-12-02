import productsRepo from "../db/repositories/products.repo.js";

export const productsService = {
  list() {
    return productsRepo.findMany({});
  },

  create(data: any) {
    return productsRepo.create(data);
  },

  update(id: string, data: any) {
    return productsRepo.update(id, data);
  },

  remove(id: string) {
    return productsRepo.delete(id);
  },

  get(id: string) {
    return productsRepo.findById(id);
  },
};

export default productsService;
