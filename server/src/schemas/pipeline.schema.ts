import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";
import { ApplicationStatusSchema } from "./application.schema.js";

export const PipelineStageSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  status: ApplicationStatusSchema,
  count: z.number().int().nonnegative(),
});

export type PipelineStage = z.infer<typeof PipelineStageSchema>;
