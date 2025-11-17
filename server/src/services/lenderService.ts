// server/src/services/lenderService.ts

import { db, registry } from "../db/registry.js";

export const lenderService = {
  async all() {
    const result = await db.query(`
      SELECT * FROM lenders
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async get(id: string) {
    const result = await db.query(
      `SELECT * FROM lenders WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },
};
