import { pipelineStageRepo } from "../db/repositories/pipelineStage.repo";

export const pipelineStageService = {
  async list() {
    return pipelineStageRepo.list();
  },

  async get(id: string) {
    return pipelineStageRepo.findById(id);
  },

  async create(data: any) {
    return pipelineStageRepo.create(data);
  },

  async update(id: string, data: any) {
    return pipelineStageRepo.update(id, data);
  }
};
