import { prisma } from "../db/prisma.js";

export const applicationService = {
  list() {
    return prisma.application.findMany({
      include: { documents: true, contact: true, company: true },
    });
  },

  get(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: { documents: true, contact: true, company: true },
    });
  },

  create(data: any) {
    return prisma.application.create({ data });
  },

  update(id: string, data: any) {
    return prisma.application.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.application.delete({ where: { id } });
  },
};
