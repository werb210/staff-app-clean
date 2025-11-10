/**
 * Maps an object's keys using the provided mapping table.
 */
export function mapObjectKeys<T extends Record<string, unknown>>(
  input: T,
  mapping: Record<string, string>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const mappedKey = mapping[key] ?? key;
    result[mappedKey] = value;
  }
  return result;
}

/**
 * Picks a subset of keys from an object.
 */
export function pickKeys<T extends Record<string, unknown>, K extends keyof T>(input: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in input) {
      result[key] = input[key];
    }
  }
  return result;
}

/**
 * Omits the provided keys from an object.
 */
export function omitKeys<T extends Record<string, unknown>, K extends keyof T>(input: T, keys: K[]): Omit<T, K> {
  const result: Record<string, unknown> = { ...input };
  for (const key of keys) {
    delete result[key as string];
  }
  return result as Omit<T, K>;
}
