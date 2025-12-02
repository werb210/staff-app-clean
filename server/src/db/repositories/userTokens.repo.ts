import { randomUUID } from "crypto";

const tokens: any[] = [];

const userTokensRepo = {
  async create(data: any) {
    const record = { id: randomUUID(), ...data };
    tokens.push(record);
    return record;
  },

  async findMany(filter: Record<string, any> = {}) {
    return tokens.filter((entry) =>
      Object.entries(filter).every(([key, value]) => entry[key] === value),
    );
  },

  async findOne(filter: Record<string, any> = {}) {
    return userTokensRepo.findMany(filter).then((rows) => rows[0] ?? null);
  },

  async delete(id: string) {
    const idx = tokens.findIndex((entry) => entry.id === id);
    if (idx === -1) return null;
    const [removed] = tokens.splice(idx, 1);
    return removed;
  },
};

export default userTokensRepo;
