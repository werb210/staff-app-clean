// server/src/services/dealsService.ts

import { db, registry } from "../db/registry.js";

export const dealsService = {
  async all() {
    const result = await db.query(`
      SELECT * FROM deals
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async get(id: string) {
    const result = await db.query(
      `SELECT * FROM deals WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },
};
