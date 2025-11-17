// server/src/controllers/notificationController.ts
import { db } from "../db/registry.js";
import { notifications } from "../db/schema/notifications.js";
import { eq } from "drizzle-orm";

export const notificationsController = {
  async list(_req, res) {
    const rows = await db.select().from(notifications);
    res.json({ ok: true, data: rows });
  },

  async get(req, res) {
    const row = await db.query.notifications.findFirst({
      where: eq(notifications.id, req.params.id),
    });
    if (!row) return res.status(404).json({ ok: false });
    res.json({ ok: true, data: row });
  },

  async create(req, res) {
    const inserted = await db
      .insert(notifications)
      .values(req.body)
      .returning();
    res.json({ ok: true, data: inserted[0] });
  },

  async update(req, res) {
    const updated = await db
      .update(notifications)
      .set(req.body)
      .where(eq(notifications.id, req.params.id))
      .returning();
    res.json({ ok: true, data: updated[0] });
  },

  async remove(req, res) {
    await db.delete(notifications).where(eq(notifications.id, req.params.id));
    res.json({ ok: true });
  },
};
