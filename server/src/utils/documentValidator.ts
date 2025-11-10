import { calculateChecksum } from "./checksum.js";

const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg"
]);

/**
 * Determines if the provided MIME type is supported by the platform.
 */
export function isSupportedDocumentType(mimeType: string): boolean {
  return SUPPORTED_MIME_TYPES.has(mimeType.toLowerCase());
}

/**
 * Validates that the provided document size does not exceed the configured maximum.
 */
export function validateDocumentSize(bytes: number, maxBytes = 15 * 1024 * 1024): boolean {
  return bytes > 0 && bytes <= maxBytes;
}

/**
 * Validates that the checksum of the provided Buffer matches an expected checksum string.
 */
export function verifyChecksum(content: Buffer, expectedChecksum: string): boolean {
  const checksum = calculateChecksum(content);
  return checksum === expectedChecksum;
}
