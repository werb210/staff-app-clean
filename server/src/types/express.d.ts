import type { Silo } from "@prisma/client";
import type { AuthTokenPayload } from "../auth/authService.js";

declare global {
  namespace Express {
    interface Request {
      silo?: Silo;
      user?: AuthTokenPayload;
    }
  }
}

export {};
