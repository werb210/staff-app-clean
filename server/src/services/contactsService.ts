// server/src/services/contactsService.ts
import { prisma } from "../db/index.js";

export const contactsService = {
  list() {
    return prisma.contact.findMany({ include: { company: true, user: true } });
  },

  get(id) {
    return prisma.contact.findUnique({
      where: { id },
      include: { company: true, user: true },
    });
  },

  create(data) {
    return prisma.contact.create({ data });
  },

  update(id, data) {
    return prisma.contact.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.contact.delete({ where: { id } });
  },
};
