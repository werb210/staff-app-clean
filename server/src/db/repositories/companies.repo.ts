import { randomUUID } from "crypto";

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companies: Company[] = [];

function matchesFilter(row: Company, filter?: any) {
  if (!filter) return true;
  return Object.entries(filter).every(([k, v]) => {
    if (typeof v === "string") {
      return row[k]?.toString().toLowerCase().includes(v.toLowerCase());
    }
    return row[k] === v;
  });
}

export default {
  async findMany(filter?: any): Promise<Company[]> {
    return companies.filter(c => matchesFilter(c, filter));
  },

  async findById(id: string): Promise<Company | null> {
    return companies.find(c => c.id === id) || null;
  },

  async create(data: any): Promise<Company> {
    const row: Company = {
      id: randomUUID(),
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    companies.push(row);
    return row;
  },

  async update(id: string, data: any): Promise<Company | null> {
    const row = companies.find(c => c.id === id);
    if (!row) return null;

    Object.assign(row, data, { updatedAt: new Date() });
    return row;
  },

  async delete(id: string): Promise<{ id: string } | null> {
    const idx = companies.findIndex(c => c.id === id);
    if (idx === -1) return null;

    companies.splice(idx, 1);
    return { id };
  }
};
