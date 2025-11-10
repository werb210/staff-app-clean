import crypto from "node:crypto";

/**
 * Calculates a deterministic SHA-256 checksum for the provided input.
 */
export function calculateChecksum(input: string | Buffer): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Generates a checksum with an optional salt, enabling differentiation between environments.
 */
export function calculateSaltedChecksum(input: string | Buffer, salt: string): string {
  return crypto.createHash("sha256").update(salt).update(input).digest("hex");
}
