/**
 * Simple logging utilities that wrap console methods.
 */
export const logInfo = (message: string, meta?: unknown): void => {
  console.log(`[INFO] ${message}`, meta ?? "");
};

export const logError = (message: string, meta?: unknown): void => {
  console.error(`[ERROR] ${message}`, meta ?? "");
};

export const logDebug = (message: string, meta?: unknown): void => {
  console.debug(`[DEBUG] ${message}`, meta ?? "");
};
