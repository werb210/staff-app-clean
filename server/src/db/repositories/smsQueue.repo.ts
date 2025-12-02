import { randomUUID } from "crypto";

const queue: any[] = [];

const smsQueueRepo = {
  async create(data: any) {
    const record = { id: randomUUID(), ...data };
    queue.push(record);
    return record;
  },

  async update(id: string, data: any) {
    const idx = queue.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    queue[idx] = { ...queue[idx], ...data };
    return queue[idx];
  },

  async findMany(filter: Record<string, any> = {}) {
    return queue.filter((item) =>
      Object.entries(filter).every(([key, value]) => item[key] === value),
    );
  },
};

export default smsQueueRepo;
