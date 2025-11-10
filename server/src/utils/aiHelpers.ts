/**
 * Sanitizes an AI prompt by trimming whitespace and ensuring it does not exceed the configured length.
 */
export function sanitizePrompt(prompt: string, maxLength = 4096): string {
  const trimmed = prompt.trim();
  return trimmed.slice(0, maxLength);
}

/**
 * Produces a confidence score rounded to two decimal places.
 */
export function normalizeConfidence(score: number): number {
  const bounded = Math.min(Math.max(score, 0), 1);
  return Math.round(bounded * 100) / 100;
}

/**
 * Generates a fallback summary when the AI service is unavailable.
 */
export function buildFallbackSummary(context: string): string {
  return `Summary unavailable. Context: ${context.slice(0, 200)}...`;
}
