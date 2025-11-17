// server/src/services/pipelineService.ts
import { db } from "../db/registry.js";
import { pipelineStages } from "../db/schema/pipeline.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const pipelineService = {
  async list() {
    return db.select().from(pipelineStages);
  },

  async get(id: string) {
    const rows = await db.select().from(pipelineStages).where(eq(pipelineStages.id, id));
    return rows[0] ?? null;
  },

  async create(data: any) {
    const id = uuid();
    await db.insert(pipelineStages).values({ id, ...data });
    return this.get(id);
  },

  async update(id: string, data: any) {
    await db.update(pipelineStages).set(data).where(eq(pipelineStages.id, id));
    return this.get(id);
  },

  async remove(id: string) {
    await db.delete(pipelineStages).where(eq(pipelineStages.id, id));
  },
};
