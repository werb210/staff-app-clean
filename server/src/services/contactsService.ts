// server/src/services/contactsService.ts
import { db } from "../db/registry.js";
import { contacts } from "../db/schema/contacts.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const contactsService = {
  async list() {
    return db.select().from(contacts);
  },

  async get(id: string) {
    const rows = await db.select().from(contacts).where(eq(contacts.id, id));
    return rows[0] ?? null;
  },

  async create(data: any) {
    const id = uuid();
    await db.insert(contacts).values({ id, ...data });
    return this.get(id);
  },

  async update(id: string, data: any) {
    await db.update(contacts).set(data).where(eq(contacts.id, id));
    return this.get(id);
  },

  async remove(id: string) {
    await db.delete(contacts).where(eq(contacts.id, id));
  },
};
