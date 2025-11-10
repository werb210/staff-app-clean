/**
 * In-memory cache of feature flags to prevent repeated environment lookups.
 */
const cache = new Map<string, boolean>();

/**
 * Returns whether a feature flag is enabled. Flags are read from environment variables prefixed with `FF_`.
 */
export function isFeatureEnabled(flagName: string, defaultValue = false): boolean {
  if (cache.has(flagName)) {
    return cache.get(flagName) ?? defaultValue;
  }

  const envKey = `FF_${flagName.toUpperCase()}`;
  const value = process.env[envKey];
  const enabled = typeof value === "string" ? value.toLowerCase() === "true" : defaultValue;
  cache.set(flagName, enabled);
  return enabled;
}

/**
 * Returns all cached feature flags, including their resolved values.
 */
export function getAllFeatureFlags(): Record<string, boolean> {
  return Object.fromEntries(cache.entries());
}

/**
 * Clears the cache. Useful for tests.
 */
export function resetFeatureFlagCache(): void {
  cache.clear();
}
