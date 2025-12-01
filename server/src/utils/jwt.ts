import jwtLib from "jsonwebtoken";
import { ENV } from "../config/env.js";

const getSecret = (): string => {
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return ENV.JWT_SECRET;
};

const jwt = {
  sign(payload: any, options: { expiresIn?: string } = {}) {
    return jwtLib.sign(payload, getSecret(), {
      expiresIn: options.expiresIn ?? "7d",
    });
  },

  verify(token: string) {
    return jwtLib.verify(token, getSecret());
  },
};

export default jwt;
export { getSecret };
