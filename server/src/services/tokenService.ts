import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const tokenService = {
  issue(user: any) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        silo: user.silo,
      },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  },

  verify(token: string) {
    return jwt.verify(token, env.JWT_SECRET) as any;
  }
};
