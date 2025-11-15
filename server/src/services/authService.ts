import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";
import { StoredUser } from "../types/user.js";

/**
 * Convert raw Prisma user → StoredUser
 */
function mapToStoredUser(user: any): StoredUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    silos: user.silos || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    passwordHash: user.passwordHash,
    name: typeof user.name === "string" && user.name.trim().length > 0
      ? user.name
      : "Unknown User",
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  return mapToStoredUser(user);
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  return mapToStoredUser(user);
}

interface CreateUserInput {
  email: string;
  password: string;
  role: string;
  silos: any[];
  name?: string | null;
}

export async function createUser(input: CreateUserInput): Promise<StoredUser> {
  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
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

  return mapToStoredUser(user);
}

export default {
  loginUser,
  getUserById,
  createUser,
};
