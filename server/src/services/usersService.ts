import { prisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";

export const userService = {
  async authenticate(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    return { token, user };
  },

  async create(data: any) {
    const hash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hash,
        role: data.role ?? "staff",
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  },

  list() {
    return prisma.user.findMany();
  },

  get(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
