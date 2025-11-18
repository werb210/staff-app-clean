// ============================================================================
// server/src/services/pipelineMoveService.ts
// BLOCK 20 — Complete rewrite for Prisma
// ============================================================================

import db from "../db/index.js";

const pipelineMoveService = {
  /**
   * Move an application from one pipeline stage to another
   * @param {string} applicationId
   * @param {string} newStageId
   */
  async moveToStage(applicationId, newStageId) {
    // Ensure target stage exists
    const stage = await db.pipelineStage.findUnique({
      where: { id: newStageId },
      select: { id: true },
    });

    if (!stage) {
      throw new Error(`Pipeline stage not found: ${newStageId}`);
    }

    // Move
    const updated = await db.application.update({
      where: { id: applicationId },
      data: { stageId: newStageId },
      select: {
        id: true,
        stageId: true,
        updatedAt: true,
      },
    });

    // Log movement
    await db.pipelineMoveLog.create({
      data: {
        applicationId,
        stageId: newStageId,
      },
    });

    return updated;
  },

  /**
   * Get move history for an application
   * @param {string} applicationId
   */
  async listMoves(applicationId) {
    return db.pipelineMoveLog.findMany({
      where: { applicationId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        stageId: true,
        createdAt: true,
        applicationId: true,
        stage: {
          select: { name: true, order: true },
        },
      },
    });
  },
};

export default pipelineMoveService;

// ============================================================================
// END OF FILE
// ============================================================================
