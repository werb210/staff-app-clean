import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { auditLogs } from "../schema/audit.js";

const safe = (v: any) => (v && typeof v === "object" ? v : {});

const map = (r: any) =>
  !r
    ? null
    : {
        id: r.id,
        ...safe(r.details),
        createdAt: r.createdAt,
      };

export const productsRepo = {
  async create(data: Record<string, unknown>) {
    const [created] = await db
      .insert(auditLogs)
      .values({
        eventType: "product",
        details: safe(data),
      })
      .returning();

    return map(created);
  },

  async update(id: string, data: Record<string, unknown>) {
    const [existing] = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id));

    if (!existing || existing.eventType !== "product") return null;

    const merged = { ...safe(existing.details), ...safe(data) };

    const [updated] = await db
      .update(auditLogs)
      .set({ details: merged })
      .where(eq(auditLogs.id, id))
      .returning();

    return map(updated);
  },

  async delete(id: string) {
    const [deleted] = await db
      .delete(auditLogs)
      .where(eq(auditLogs.id, id))
      .returning();

    return map(deleted);
  },

  async findById(id: string) {
    const [record] = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id));

    if (!record || record.eventType !== "product") return null;

    return map(record);
  },

  async findMany() {
    const where = eq(auditLogs.eventType, "product");
    const results = await db.select().from(auditLogs).where(where);
    return results.map(map).filter(Boolean);
  },
};

export default productsRepo;
