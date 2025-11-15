import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";
import { StoredUser } from "../types/user.js";

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

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    silos: user.silos || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    passwordHash: user.passwordHash,
    name: user.name ?? null,
  };
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    silos: user.silos || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    passwordHash: user.passwordHash,
    name: user.name ?? null,
  };
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
      name: input.name ?? null,
    },
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    silos: user.silos || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    passwordHash: user.passwordHash,
    name: user.name ?? null,
  };
}

export default {
  loginUser,
  getUserById,
  createUser,
};
