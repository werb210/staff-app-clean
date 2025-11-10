const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Checks whether the provided value is a syntactically valid RFC 4122 UUID.
 */
export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}
