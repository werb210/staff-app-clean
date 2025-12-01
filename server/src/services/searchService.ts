import { searchRepo } from "../db/repositories/search.repo";

export const searchService = {
  async global(term: string) {
    return searchRepo.global(term);
  }
};
