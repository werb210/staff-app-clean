import { randomUUID } from "crypto";

export interface Contact {
  id: string;
  companyId?: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contacts: Contact[] = [];

function matchesFilter(row: Contact, filter?: any) {
  if (!filter) return true;
  return Object.entries(filter).every(([k, v]) => {
    if (typeof v === "string") {
      return row[k]?.toString().toLowerCase().includes(v.toLowerCase());
    }
    return row[k] === v;
  });
}

export default {
  async findMany(filter?: any): Promise<Contact[]> {
    return contacts.filter(c => matchesFilter(c, filter));
  },

  async findById(id: string): Promise<Contact | null> {
    return contacts.find(c => c.id === id) || null;
  },

  async create(data: any): Promise<Contact> {
    const row: Contact = {
      id: randomUUID(),
      companyId: data.companyId || null,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contacts.push(row);
    return row;
  },

  async update(id: string, data: any): Promise<Contact | null> {
    const row = contacts.find(c => c.id === id);
    if (!row) return null;

    Object.assign(row, data, { updatedAt: new Date() });
    return row;
  },

  async delete(id: string): Promise<{ id: string } | null> {
    const idx = contacts.findIndex(c => c.id === id);
    if (idx === -1) return null;

    contacts.splice(idx, 1);
    return { id };
  }
};
