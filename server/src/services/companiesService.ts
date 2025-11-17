// server/src/services/companiesService.ts
import { registry } from "../db/registry.js";

export const companiesService = {
  async all() {
    const { rows } = await registry.pool.query(
      `SELECT * FROM companies ORDER BY created_at DESC`
    );
    return rows;
  },

  async get(id: string) {
    const { rows } = await registry.pool.query(
      `SELECT * FROM companies WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data: any) {
    const { rows } = await registry.pool.query(
      `INSERT INTO companies (name, address, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.address, data.phone]
    );
    return rows[0];
  },

  async update(id: string, data: any) {
    const { rows } = await registry.pool.query(
      `UPDATE companies
       SET name = $1,
           address = $2,
           phone = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [data.name, data.address, data.phone, id]
    );
    return rows[0] || null;
  },
};
