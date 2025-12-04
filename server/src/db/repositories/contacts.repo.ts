// server/src/db/repositories/contacts.repo.ts
// Temporary stub implementation so the server compiles and runs.
// Controllers and services can call these methods; they will clearly throw
// until we wire them to the real database.

export type ContactPayload = {
  id?: string;
  companyId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  [key: string]: unknown;
};

const notImplemented = (method: string) => {
  throw new Error(`contactsRepo.${method} is not implemented yet`);
};

const contactsRepo = {
  async getAll(): Promise<ContactPayload[]> {
    notImplemented("getAll");
  },

  async getById(id: string): Promise<ContactPayload | null> {
    notImplemented("getById");
  },

  async create(payload: ContactPayload): Promise<ContactPayload> {
    notImplemented("create");
  },

  async update(id: string, payload: ContactPayload): Promise<ContactPayload> {
    notImplemented("update");
  },

  async delete(id: string): Promise<{ id: string }> {
    notImplemented("delete");
  },

  // Optional helper for searchService etc.
  async searchByQuery(_q: string): Promise<ContactPayload[]> {
    notImplemented("searchByQuery");
  },
};

export default contactsRepo;
