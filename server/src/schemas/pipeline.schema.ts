import { z } from "zod";
import { uuidSchema } from "../utils/uuidValidator.js";
import { ApplicationSchema } from "./application.schema.js";

/**
 * FINAL CANONICAL PIPELINE STAGES
 * These MUST match Application.stage values in applicationService.ts
 */
export const PipelineStageNameSchema = z.enum([
  "new",
  "requires_docs",
  "in_review",
  "sent_to_lenders",
  "approved",
  "declined",
]);

export type PipelineStageName = z.infer<typeof PipelineStageNameSchema>;

/**
 * Pipeline stage column schema
 * Returned directly by GET /api/pipeline/board
 */
export const PipelineStageSchema = z.object({
  id: PipelineStageNameSchema,                 // same as stage name
  name: PipelineStageNameSchema,               // human-readable key
  stage: PipelineStageNameSchema,              // actual stage
  position: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  totalLoanAmount: z.number().nonnegative(),
  averageScore: z.number().min(0).max(100).optional(),
  lastUpdatedAt: z.string().datetime({ offset: true }),
  applications: z.array(ApplicationSchema).optional().default([]),
});

export type PipelineStage = z.infer<typeof PipelineStageSchema>;

/**
 * Entire board returned from pipelineService.buildPipeline()
 */
export const PipelineBoardSchema = z.object({
  stages: z.array(PipelineStageSchema),
  assignments: z.array(
    z.object({
      id: uuidSchema,
      applicationId: uuidSchema,
      assignedTo: z.string(),
      stage: PipelineStageNameSchema,
      assignedAt: z.string().datetime({ offset: true }),
      note: z.string().max(500).optional(),
    })
  ),
});

export type PipelineBoard = z.infer<typeof PipelineBoardSchema>;

/**
 * Stage transition
 * (Used by POST /api/pipeline/transition)
 */
export const PipelineTransitionSchema = z.object({
  applicationId: uuidSchema,
  fromStage: PipelineStageNameSchema.optional(),
  toStage: PipelineStageNameSchema,
  assignedTo: z.string().optional(),
  note: z.string().max(500).optional(),
});

export type PipelineTransitionInput = z.infer<typeof PipelineTransitionSchema>;

/**
 * Assignment input
 * (Used by POST /api/pipeline/assign)
 */
export const PipelineAssignmentSchema = z.object({
  id: uuidSchema,
  applicationId: uuidSchema,
  assignedTo: z.string(),
  stage: PipelineStageNameSchema,
  note: z.string().max(500).optional(),
});

export type PipelineAssignmentInput = z.infer<typeof PipelineAssignmentSchema>;
