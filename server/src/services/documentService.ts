import { prisma } from "../db/prisma.js";

export const documentService = {
  list() {
    return prisma.document.findMany();
  },

  get(id: string) {
    return prisma.document.findUnique({ where: { id } });
  },

  create(data: any) {
    return prisma.document.create({ data });
  },

  update(id: string, data: any) {
    return prisma.document.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.document.delete({ where: { id } });
  },
};
