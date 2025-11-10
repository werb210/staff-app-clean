/**
 * Describes a route signature for deduplication purposes.
 */
export interface RouteSignature {
  method: string;
  path: string;
}

/**
 * Deduplicates a list of route signatures, preserving the first occurrence of each unique combination.
 */
export function dedupeRoutes(routes: RouteSignature[]): RouteSignature[] {
  const seen = new Set<string>();
  const deduped: RouteSignature[] = [];

  for (const route of routes) {
    const key = `${route.method.toUpperCase()} ${route.path}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push({
      method: route.method.toUpperCase(),
      path: route.path
    });
  }

  return deduped;
}
