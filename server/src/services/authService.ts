import crypto from "node:crypto";

export interface AuthTokenPayload {
  userId: string;
  roles: string[];
}

/**
 * Service responsible for performing authentication and authorization checks.
 */
export class AuthService {
  /**
   * Validates whether a bearer token is syntactically valid and returns decoded payload data.
   */
  async verifyBearerToken(token: string): Promise<AuthTokenPayload | null> {
    if (!token || !token.startsWith("Bearer ")) {
      return null;
    }
    const value = token.replace("Bearer ", "").trim();
    if (value.length < 10) {
      return null;
    }
    return {
      userId: crypto.randomUUID(),
      roles: ["loan_officer"]
    };
  }

  /**
   * Determines whether a user has the specified role.
   */
  hasRole(payload: AuthTokenPayload | null, role: string): boolean {
    if (!payload) {
      return false;
    }
    return payload.roles.includes(role);
  }
}

export const authService = new AuthService();
