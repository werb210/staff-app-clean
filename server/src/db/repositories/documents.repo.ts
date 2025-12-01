import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db.js';
import { documentVersions } from '../schema/documentVersions.js';
import { documents } from '../schema/documents.js';

const buildWhere = (filter: Partial<typeof documents.$inferSelect> = {}) => {
  const conditions = Object.entries(filter)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => eq((documents as any)[key], value as any));
  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0] : and(...conditions);
};

export const documentsRepo = {
  async create(data: Partial<typeof documents.$inferInsert>) {
    const [created] = await db.insert(documents).values(data as any).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof documents.$inferInsert>) {
    const [updated] = await db
      .update(documents)
      .set(data)
      .where(eq(documents.id, id))
      .returning();
    return updated ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db
      .update(documents)
      .set({ status: 'rejected', rejectionReason: 'deleted', updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();

    return deleted ?? null;
  },

  async findById(id: string) {
    const [record] = await db.select().from(documents).where(eq(documents.id, id));
    return record ?? null;
  },

  async findByApplication(applicationId: string) {
    return db.select().from(documents).where(eq(documents.applicationId, applicationId));
  },

  async findMany(filter: Partial<typeof documents.$inferSelect> = {}) {
    const where = buildWhere(filter);
    const query = db.select().from(documents);
    if (where) query.where(where);
    return query;
  },

  async saveVersion(data: Partial<typeof documentVersions.$inferInsert>) {
    const [created] = await db.insert(documentVersions).values(data as any).returning();
    return created;
  },

  async findVersions(documentId: string) {
    return db
      .select()
      .from(documentVersions)
      .where(eq(documentVersions.documentId, documentId))
      .orderBy(desc(documentVersions.versionNumber), desc(documentVersions.createdAt));
  },
};

export default documentsRepo;
