// server/src/services/productsService.ts
import { db } from "../db/registry.js";
import { products } from "../db/schema/products.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const productsService = {
  async list() {
    return db.select().from(products);
  },

  async get(id: string) {
    const rows = await db.select().from(products).where(eq(products.id, id));
    return rows[0] ?? null;
  },

  async create(data: any) {
    const id = uuid();
    await db.insert(products).values({ id, ...data });
    return this.get(id);
  },

  async update(id: string, data: any) {
    await db.update(products).set(data).where(eq(products.id, id));
    return this.get(id);
  },

  async remove(id: string) {
    await db.delete(products).where(eq(products.id, id));
  },
};
