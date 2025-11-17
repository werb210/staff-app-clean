// server/src/services/lenderService.ts
import db, { registry } from "../db/registry.js";

export const lenderService = {
  async all() {
    return db.select().from(registry.lenders);
  },
};

export default lenderService;
