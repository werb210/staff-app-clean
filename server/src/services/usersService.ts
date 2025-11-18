import { prisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";

export const userService = {
  async create(data: { email: string; password: string; role: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: { email: data.email, password: hashed, role: data.role },
    });
  },

  async authenticate(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    return { user, token };
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
