// server/src/services/companiesService.ts
import { registry } from "../db/registry.js";

export const companiesService = {
  async all() {
    const result = await registry.system.query("SELECT * FROM companies LIMIT 200");
    return result.rows;
  },
  async get(id: string) {
    const result = await registry.system.query("SELECT * FROM companies WHERE id = $1", [id]);
    return result.rows[0] || null;
  },
};
