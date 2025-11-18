import { prisma } from "../db/prisma.js";
import { v4 as uuid } from "uuid";

export const dealsService = {
  list() {
    return prisma.deal.findMany({ include: { application: true } });
  },

  get(id: string) {
    return prisma.deal.findUnique({
      where: { id },
      include: { application: true },
    });
  },

  create(data: any) {
    return prisma.deal.create({
      data: {
        id: uuid(),
        applicationId: data.applicationId,
        lenderId: data.lenderId,
        status: data.status,
        offerAmount: data.offerAmount,
        terms: data.terms,
      },
    });
  },

  update(id: string, data: any) {
    return prisma.deal.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.deal.delete({ where: { id } });
  },
};
