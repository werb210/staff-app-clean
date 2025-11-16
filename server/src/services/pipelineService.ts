// server/src/services/pipelineService.ts

export const pipelineService = {
  async list() {
    return [
      { id: 1, stage: "new", name: "Demo Application" }
    ];
  },
};
