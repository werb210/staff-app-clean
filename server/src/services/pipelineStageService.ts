import pipelineStageRepo from "../db/repositories/pipelineStage.repo.js";

export const pipelineStageService = {
  list() {
    return pipelineStageRepo.list();
  },
};

export default pipelineStageService;
