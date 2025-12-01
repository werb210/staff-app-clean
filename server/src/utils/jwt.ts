// server/src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const getSecret = (): string => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return env.JWT_SECRET;
};

export function signToken(payload: object): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, getSecret()) as any;
}
