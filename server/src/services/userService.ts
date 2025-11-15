import { prisma } from "./prisma.js";
import type { CreateUserData, UpdateUserData, UserRecord } from "./db.js";
import type { Silo } from "../types/index.js";

export async function createUserRecord(data: CreateUserData) {
  return prisma.user.create({ data });
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function assignUserSilos(id: string, silos: Silo[]) {
  const update: UpdateUserData = { silos };

  return prisma.user.update({
    where: { id },
    data: update,
  });
}
