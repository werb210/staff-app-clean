// server/src/services/tokenService.ts
import { signToken, verifyToken } from "../utils/jwt.js";

export const tokenService = {
  issue(user: any) {
    return signToken({
      id: user.id,
      role: user.role,
      silo: user.silo,
    });
  },

  verify(token: string) {
    return verifyToken(token);
  },
};

export default tokenService;
