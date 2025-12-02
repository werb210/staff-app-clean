import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { contacts } from "../schema/contacts.js";

export const contactsRepo = {
  async create(data: {
    firstName: string;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    companyId?: string | null;
    position?: string | null;
  }) {
    const [created] = await db.insert(contacts).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof contacts.$inferInsert>) {
    const [updated] = await db
      .update(contacts)
      .set(data)
      .where(eq(contacts.id, id))
      .returning();

    return updated ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();
    return deleted ?? null;
  },

  async findById(id: string) {
    const [record] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id));

    return record ?? null;
  },

  async findMany(filter: Partial<typeof contacts.$inferSelect> = {}) {
    let query = db.select().from(contacts);

    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined) {
        query = query.where(eq((contacts as any)[key], value));
      }
    }

    return await query;
  },
};

export default contactsRepo;
