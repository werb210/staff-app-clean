// server/src/db/schema/pipeline.ts
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { applications } from "./applications";
import { users } from "./users";

export const pipeline = pgTable("pipeline", {
  id: uuid("id").primaryKey().defaultRandom(),

  applicationId: uuid("application_id")
    .references(() => applications.id)
    .notNull(),

  stage: varchar("stage", { length: 100 })
    .$type<
      | "new"
      | "in_review"
      | "requires_docs"
      | "docs_received"
      | "lender_review"
      | "approved"
      | "declined"
    >(),

  assignedTo: uuid("assigned_to").references(() => users.id),

  updatedAt: timestamp("updated_at").defaultNow(),
});
