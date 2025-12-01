/**
 * Remove password, tokens, and other sensitive fields from user records.
 */

export function sanitizeUser<
  T extends { password?: unknown; passwordHash?: unknown }
>(user: T | null): Omit<T, "password" | "passwordHash"> | null {
  if (!user) return null;

  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
}
