const pipelinePositions = new Map<string, string>();
const pipelineHistory: Array<{
  applicationId: string;
  fromStage: string | null;
  toStage: string;
  movedAt: Date;
}> = [];

export const pipelineRepo = {
  async findByApplication(applicationId: string) {
    const stage = pipelinePositions.get(applicationId) ?? null;
    return stage ? { applicationId, stageId: stage } : null;
  },

  async listByStage(stageId: string) {
    return Array.from(pipelinePositions.entries())
      .filter(([, stage]) => stage === stageId)
      .map(([applicationId, stage]) => ({ applicationId, stageId: stage }));
  },

  async move(applicationId: string, toStageId: string) {
    pipelinePositions.set(applicationId, toStageId);
    return { applicationId, stageId: toStageId };
  },

  async updateStage(applicationId: string, toStageId: string) {
    return pipelineRepo.move(applicationId, toStageId);
  },

  async moveWithHistory(applicationId: string, fromStage: string, toStage: string) {
    const previous = pipelinePositions.get(applicationId) ?? null;
    pipelinePositions.set(applicationId, toStage);
    pipelineHistory.push({
      applicationId,
      fromStage,
      toStage,
      movedAt: new Date()
    });
    return {
      applicationId,
      fromStage: previous ?? fromStage,
      toStage,
      movedAt: pipelineHistory[pipelineHistory.length - 1].movedAt
    };
  }
};

export default pipelineRepo;
