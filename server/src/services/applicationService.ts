import { db, type Silo, type ApplicationRecord } from "./db.js";

// Helper for type-safe reads
const safe = <T>(value: any): T => value as T;

export const applicationService = {
  // -----------------------------------------------------
  // LIST APPLICATIONS FOR A SILO
  // -----------------------------------------------------
  listBySilo(silo: Silo): ApplicationRecord[] {
    const list = safe<ApplicationRecord[]>(db.applications[silo]?.data ?? []);
    return list;
  },

  // -----------------------------------------------------
  // CREATE APPLICATION
  // -----------------------------------------------------
  create(data: any): ApplicationRecord {
    const silo = data.silo as Silo;

    const record: ApplicationRecord = {
      id: db.id(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const list = safe<ApplicationRecord[]>(db.applications[silo]?.data ?? []);
    list.push(record);

    db.applications[silo].data = list;

    return record;
  },

  // -----------------------------------------------------
  // GET BY ID
  // -----------------------------------------------------
  getById(silo: Silo, id: string): ApplicationRecord | null {
    const list = safe<ApplicationRecord[]>(db.applications[silo]?.data ?? []);
    return list.find((a) => a.id === id) ?? null;
  },

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  update(
    silo: Silo,
    id: string,
    updates: Partial<ApplicationRecord>
  ): ApplicationRecord | null {
    const list = safe<ApplicationRecord[]>(db.applications[silo]?.data ?? []);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const updated: ApplicationRecord = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updated;
    db.applications[silo].data = list;

    return updated;
  },

  // -----------------------------------------------------
  // DELETE
  // -----------------------------------------------------
  remove(silo: Silo, id: string): boolean {
    const list = safe<ApplicationRecord[]>(db.applications[silo]?.data ?? []);
    const exists = list.some((a) => a.id === id);

    db.applications[silo].data = list.filter((a) => a.id !== id);
    return exists;
  },
};
