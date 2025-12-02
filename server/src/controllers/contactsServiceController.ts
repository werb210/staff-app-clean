import contactsRepo from "../db/repositories/contacts.repo.js";

export const contactsService = {
  listAll: () => contactsRepo.findMany({}),
  get: (id: string) => contactsRepo.findById(id),
  create: (data: any) => contactsRepo.create(data),
  update: (id: string, data: any) => contactsRepo.update(id, data),
  remove: (id: string) => contactsRepo.delete(id),
};

export default contactsService;
