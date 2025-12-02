import applicationsRepo from "../db/repositories/applications.repo.js";
import contactsRepo from "../db/repositories/contacts.repo.js";
import companiesRepo from "../db/repositories/companies.repo.js";

export const searchService = {
  async global(term: string) {
    const apps = await applicationsRepo.search(term);
    const contacts = await contactsRepo.search(term);
    const companies = await companiesRepo.search(term);

    return { apps, contacts, companies };
  },
};

export default searchService;
