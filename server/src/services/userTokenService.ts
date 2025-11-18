// ============================================================================
// server/src/services/userTokenService.ts
// BLOCK 24 — Complete Prisma rewrite
// ============================================================================

import crypto from "crypto";
import db from "../db/index.js";

const userTokenService = {
  /**
   * Create a verification or reset token for a user
   * Types: "EMAIL_VERIFY" | "PASSWORD_RESET" | "MFA"
   */
  async createToken(
    userId: string,
    type: "EMAIL_VERIFY" | "PASSWORD_RESET" | "MFA",
    expiresInMinutes = 30
  ) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60_000);

    await db.userToken.create({
      data: {
        userId,
        token,
        type,
        expiresAt,
      },
    });

    return token;
  },

  /**
   * Validate a token (must exist, match type, not expired)
   */
  async validateToken(
    token: string,
    type: "EMAIL_VERIFY" | "PASSWORD_RESET" | "MFA"
  ) {
    const record = await db.userToken.findFirst({
      where: {
        token,
        type,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
    });

    return record;
  },

  /**
   * Mark token as used (soft invalidation)
   */
  async consumeToken(tokenId: string) {
    return db.userToken.update({
      where: { id: tokenId },
      data: {
        expiresAt: new Date(0), // force expired
      },
    });
  },

  /**
   * Delete a specific token
   */
  async deleteToken(tokenId: string) {
    return db.userToken.delete({
      where: { id: tokenId },
    });
  },

  /**
   * Delete all tokens for a user (logout from all devices, clear resets, etc.)
   */
  async purgeUserTokens(userId: string) {
    return db.userToken.deleteMany({
      where: { userId },
    });
  },

  /**
   * Cleanup expired tokens (recommended cron)
   */
  async cleanupExpiredTokens() {
    return db.userToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },
};

export default userTokenService;

// ============================================================================
// END OF FILE
// ============================================================================
