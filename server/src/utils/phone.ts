const E164_REGEX = /^\+?[1-9]\d{6,14}$/;

/**
 * Sanitizes a phone number by removing whitespace and dash characters.
 */
export function sanitizePhoneNumber(input: string): string {
  return input.replace(/[\s-]+/g, "");
}

/**
 * Checks whether the provided phone number is in E.164 format.
 */
export function isE164PhoneNumber(phone: string): boolean {
  return E164_REGEX.test(phone);
}

/**
 * Obscures the middle digits of a phone number for logging or auditing purposes.
 */
export function maskPhoneNumber(phone: string): string {
  const sanitized = sanitizePhoneNumber(phone);
  if (sanitized.length <= 4) {
    return sanitized;
  }
  const visibleSegment = sanitized.slice(-4);
  return `${"*".repeat(Math.max(0, sanitized.length - 4))}${visibleSegment}`;
}
