import lendersRepo from "../db/repositories/lenders.repo.js";
import applicationsRepo from "../db/repositories/applications.repo.js";

export const dealsService = {
  match: async (applicationId: string) => {
    const application = await applicationsRepo.findById(applicationId);
    if (!application) return null;

    const lenders = await lendersRepo.findMany({});
    return { application, lenders };
  },
};

export default dealsService;
