import { randomUUID } from "crypto";

const records: any[] = [];

const smsLogsRepo = {
  async create(data: any) {
    const record = { id: randomUUID(), ...data };
    records.push(record);
    return record;
  },

  async findMany() {
    return [...records];
  },
};

export default smsLogsRepo;
