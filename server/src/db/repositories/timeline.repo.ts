import { randomUUID } from "crypto";

const timeline: any[] = [];

const timelineRepo = {
  async create(data: any) {
    const record = { id: randomUUID(), ...data };
    timeline.push(record);
    return record;
  },

  async findMany(filter: Record<string, any> = {}) {
    return timeline.filter((entry) =>
      Object.entries(filter).every(([key, value]) => entry[key] === value),
    );
  },
};

export default timelineRepo;
