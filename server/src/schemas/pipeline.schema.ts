import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";
import {
  ApplicationAssignmentSchema,
  ApplicationSchema,
} from "./application.schema.js";

/**
 * FINAL, CANONICAL PIPELINE STAGES
 */
export const PipelineStageNameSchema = z.enum([
  "New",
  "Requires Docs",
  "In Review",
  "Sent to Lenders",
  "Approved",
  "Declined",
]);

export type PipelineStageName = z.infer<typeof PipelineStageNameSchema>;

/**
 * Pipeline stage structure (column)
 */
export const PipelineStageSchema = z.object({
  id: uuidSchema,                          // stage UUID
  name: PipelineStageNameSchema,           // UI name
  stage: PipelineStageNameSchema,          // duplicate for compatibility
  position: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  totalLoanAmount: z.number().nonnegative(),
  averageScore: z.number().min(0).max(100).optional(),
  lastUpdatedAt: z.string().datetime({ offset: true }),
  applications: z.array(ApplicationSchema),
});

export type PipelineStage = z.infer<typeof PipelineStageSchema>;

/**
 * Entire board with all columns + assignment history
 */
export const PipelineBoardSchema = z.object({
  stages: z.array(PipelineStageSchema),
  assignments: z.array(
    ApplicationAssignmentSchema.extend({
      assignedAt: z.string().datetime({ offset: true }),
      note: z.string().max(500).optional(),
    }),
  ),
});

export type PipelineBoard = z.infer<typeof PipelineBoardSchema>;

/**
 * Stage transition input
 */
export const PipelineTransitionSchema = z.object({
  applicationId: uuidSchema,
  fromStage: PipelineStageNameSchema.optional(),
  toStage: PipelineStageNameSchema,
  assignedTo: z.string().min(1).optional(),
  note: z.string().max(500).optional(),
});

export type PipelineTransitionInput = z.infer<typeof PipelineTransitionSchema>;

/**
 * Assignment
 */
export const PipelineAssignmentSchema = ApplicationAssignmentSchema.extend({
  note: z.string().max(500).optional(),
});

export type PipelineAssignmentInput = z.infer<typeof PipelineAssignmentSchema>;
