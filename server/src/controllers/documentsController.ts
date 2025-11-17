// server/src/controllers/documentController.ts
import { db } from "../db/registry.js";
import { documents } from "../db/schema/documents.js";
import { eq } from "drizzle-orm";

export const documentController = {
  async list(_req, res) {
    const rows = await db.select().from(documents);
    res.json({ ok: true, data: rows });
  },

  async get(req, res) {
    const row = await db.query.documents.findFirst({
      where: eq(documents.id, req.params.id),
    });
    if (!row) return res.status(404).json({ ok: false });
    res.json({ ok: true, data: row });
  },

  async create(req, res) {
    const inserted = await db.insert(documents).values(req.body).returning();
    res.json({ ok: true, data: inserted[0] });
  },

  async update(req, res) {
    const updated = await db
      .update(documents)
      .set(req.body)
      .where(eq(documents.id, req.params.id))
      .returning();
    res.json({ ok: true, data: updated[0] });
  },

  async remove(req, res) {
    await db.delete(documents).where(eq(documents.id, req.params.id));
    res.json({ ok: true });
  },
};
