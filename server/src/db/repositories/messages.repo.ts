import { and, eq } from 'drizzle-orm';
import { db } from '../db.js';
import { messages } from '../schema/messages.js';

const buildWhere = (filter: Record<string, any> = {}) => {
  const conditions = Object.entries(filter)
    .filter(([, value]) => value !== undefined)
    .flatMap(([key, value]) => {
      const column = (messages as any)[key];
      if (!column) return [];
      return eq(column, value as any);
    });
  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? (conditions[0] as any) : and(...conditions as any);
};

export const messagesRepo = {
  async findOne(filter: Record<string, any> = {}) {
    const rows = await messagesRepo.findMany(filter);
    return rows[0] ?? null;
  },

  async thread(applicationId: string) {
    return messagesRepo.findMany({ applicationId });
  },

  async create(data: Partial<typeof messages.$inferInsert>) {
    const [created] = await db.insert(messages).values(data as any).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof messages.$inferInsert>) {
    const [updated] = await db
      .update(messages)
      .set(data)
      .where(eq(messages.id, id))
      .returning();
    return updated ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db.delete(messages).where(eq(messages.id, id)).returning();
    return deleted ?? null;
  },

  async findById(id: string) {
    const [record] = await db.select().from(messages).where(eq(messages.id, id));
    return record ?? null;
  },

  async findMany(filter: Record<string, any> = {}) {
    const where = buildWhere(filter);
    const query = db.select().from(messages);
    if (where) query.where(where);
    return query;
  },
};

export default messagesRepo;
