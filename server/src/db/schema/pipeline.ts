import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { applications } from "./applications.js";
import { users } from "./users.js";

export const pipeline = pgTable("pipeline", {
  id: uuid("id").primaryKey().defaultRandom(),

  applicationId: uuid("application_id")
    .references(() => applications.id)
    .notNull(),

  stage: varchar("stage", { length: 100 }).notNull(),

  assignedTo: uuid("assigned_to").references(() => users.id),

  updatedAt: timestamp("updated_at").defaultNow()
});
