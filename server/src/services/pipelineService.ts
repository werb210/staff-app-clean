import { pipelineAssignmentSchema, pipelineStageSchema } from "../schemas/pipeline.schema.js";
import type { PipelineAssignment, PipelineStage } from "../schemas/pipeline.schema.js";

/**
 * Service representing the application pipeline workflow.
 */
export class PipelineService {
  private readonly stages: PipelineStage[] = [
    pipelineStageSchema.parse({
      id: "stage-intake",
      name: "Intake",
      order: 0,
      slaHours: 24,
      description: "Initial document collection"
    }),
    pipelineStageSchema.parse({
      id: "stage-review",
      name: "Review",
      order: 1,
      slaHours: 48,
      description: "Detailed underwriting review"
    })
  ];

  /**
   * Returns the pipeline stages.
   */
  async listStages(): Promise<PipelineStage[]> {
    return [...this.stages];
  }

  /**
   * Assigns an application to a pipeline stage.
   */
  async assignToStage(assignment: PipelineAssignment): Promise<PipelineAssignment> {
    return pipelineAssignmentSchema.parse(assignment);
  }
}

export const pipelineService = new PipelineService();
