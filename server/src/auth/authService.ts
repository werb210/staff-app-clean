import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, type Silo, type User } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME";
const JWT_EXPIRES = "7d";

export type PublicUser = Omit<User, "password">;

export interface AuthTokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  roles: string[];
  silos: Silo[];
}

function sanitizeUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

export async function createUser(data: {
  email: string;
  password: string;
  roles: string[];
  silos: Silo[];
}): Promise<PublicUser> {
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      roles: data.roles,
      silos: data.silos,
    },
  });

  return sanitizeUser(user);
}

export async function authenticate(email: string, password: string): Promise<
  | {
      token: string;
      user: PublicUser;
    }
  | null
> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      roles: user.roles,
      silos: user.silos,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return { token, user: sanitizeUser(user) };
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
