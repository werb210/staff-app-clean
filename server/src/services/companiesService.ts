import companiesRepo from "../db/repositories/companies.repo.js";

export const companiesService = {
  create(data: any) {
    return companiesRepo.create(data);
  },

  update(id: string, data: any) {
    return companiesRepo.update(id, data);
  },

  get(id: string) {
    return companiesRepo.findById(id);
  },

  list() {
    return companiesRepo.findMany({});
  },
};

export default companiesService;
