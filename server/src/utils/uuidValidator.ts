import { validate as uuidValidate } from "uuid";
import { z } from "zod";

/**
 * Zod schema that validates UUID strings.
 */
export const uuidSchema = z.string().uuid();

/**
 * Convenience wrapper around the uuid validation utility.
 */
export const isValidUuid = (value: string): boolean => uuidValidate(value);
