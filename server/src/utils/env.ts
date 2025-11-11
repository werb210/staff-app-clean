import dotenv from "dotenv";
import { logDebug, logError } from "./logger.js";

let loaded = false;

/**
 * Loads environment variables once for the process.
 */
export const loadEnv = (): void => {
  if (loaded) {
    return;
  }

  const result = dotenv.config();
  if (result.error) {
    logError("Failed to load .env file", result.error);
  } else {
    logDebug("Environment variables loaded");
  }

  loaded = true;
};
