import { documentVersionsRepo } from "../db/repositories/documentVersions.repo";

export const versioningService = {
  async list(docId: string) {
    return documentVersionsRepo.listVersions(docId);
  },

  async add(docId: string, data: any) {
    return documentVersionsRepo.createVersion(docId, data);
  }
};
