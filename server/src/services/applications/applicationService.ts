import { db } from "../db";
import type { Silo } from "../db";
import { uuid } from "../../utils/uuid";
import type {
  ApplicationRecord,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "../../types/application";

/**
 * Silo-aware ApplicationService for in-memory DB.
 *
 * Mirrors the structure used by:
 *  - pipelineService.ts
 *  - lenderService.ts
 *  - documentService.ts (your working version)
 *  - notificationService.ts
 */

export const applicationService = {
  /**
   * List all applications for a silo
   */
  list(silo: Silo): ApplicationRecord[] {
    return db.applications[silo] ?? [];
  },

  /**
   * Get a single application by ID
   */
  get(silo: Silo, id: string): ApplicationRecord | null {
    const apps = db.applications[silo] ?? [];
    return apps.find((a) => a.id === id) ?? null;
  },

  /**
   * Create a new application
   */
  create(silo: Silo, input: CreateApplicationInput): ApplicationRecord {
    const record: ApplicationRecord = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    };

    if (!db.applications[silo]) db.applications[silo] = [];
    db.applications[silo].push(record);

    return record;
  },

  /**
   * Update existing application
   */
  update(
    silo: Silo,
    id: string,
    input: UpdateApplicationInput
  ): ApplicationRecord | null {
    const apps = db.applications[silo] ?? [];
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updated: ApplicationRecord = {
      ...apps[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    apps[index] = updated;
    return updated;
  },

  /**
   * Delete an application
   */
  delete(silo: Silo, id: string): boolean {
    const apps = db.applications[silo] ?? [];
    const before = apps.length;
    db.applications[silo] = apps.filter((a) => a.id !== id);
    return db.applications[silo].length < before;
  },

  /**
   * Internal helper — not exposed publicly
   * Ensures the application exists before attaching pipeline/doc/etc.
   */
  ensureExists(silo: Silo, id: string): ApplicationRecord {
    const app = this.get(silo, id);
    if (!app) {
      throw new Error(`Application ${id} not found in silo ${silo}`);
    }
    return app;
  },
};
