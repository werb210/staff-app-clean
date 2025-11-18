import { prisma } from "../db/prisma.js";
import { v4 as uuid } from "uuid";

export const documentService = {
  list() {
    return prisma.document.findMany();
  },

  get(id: string) {
    return prisma.document.findUnique({ where: { id } });
  },

  create(data: any) {
    return prisma.document.create({
      data: {
        id: uuid(),
        applicationId: data.applicationId,
        name: data.name,
        category: data.category,
        mimeType: data.mimeType,
        size: data.size,
        storagePath: data.storagePath,
      },
    });
  },

  update(id: string, data: any) {
    return prisma.document.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.document.delete({ where: { id } });
  },
};
