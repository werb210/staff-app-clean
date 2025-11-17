// server/src/db/schema/documents.ts
import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { applications } from "./applications";

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),

  applicationId: uuid("application_id")
    .references(() => applications.id)
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g. "Bank Statements"
  mimeType: varchar("mime_type", { length: 100 }),
  size: text("size"),
  azureBlobPath: text("azure_blob_path").notNull(),

  status: varchar("status", { length: 50 })
    .$type<"uploaded" | "accepted" | "rejected">()
    .default("uploaded"),

  createdAt: timestamp("created_at").defaultNow(),
});
