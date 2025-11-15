import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";
import { StoredUser, Silo } from "../types/user.js";

/**
 * Normalize Prisma user → StoredUser
 */
function mapToStoredUser(record: any): StoredUser {
  return {
    id: record.id,
    email: record.email,
    role: record.role,
    silos: Array.isArray(record.silos) ? record.silos : [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    passwordHash: record.passwordHash,
    name:
      typeof record.name === "string" && record.name.trim().length > 0
        ? record.name.trim()
        : "Unknown User",
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const record = await prisma.user.findUnique({
    where: { email },
  });

  if (!record) return null;

  const match = await bcrypt.compare(password, record.passwordHash);
  if (!match) return null;

  return mapToStoredUser(record);
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const record = await prisma.user.findUnique({
    where: { id },
  });

  if (!record) return null;

  return mapToStoredUser(record);
}

interface CreateUserInput {
  email: string;
  password: string;
  role: string;
  silos: Silo[];
  name?: string | null;
}

export async function createUser(input: CreateUserInput): Promise<StoredUser> {
  const passwordHash = await bcrypt.hash(input.password, 10);

  const record = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      role: input.role,
      silos: input.silos,
      name:
        typeof input.name === "string" && input.name.trim().length > 0
          ? input.name.trim()
          : "Unknown User",
    },
  });

  return mapToStoredUser(record);
}

export default {
  loginUser,
  getUserById,
  createUser,
};
