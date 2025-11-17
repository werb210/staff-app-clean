// server/src/db/schema/documents.ts
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey(),
  applicationId: varchar("application_id").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: varchar("size").notNull(),
  blobPath: varchar("blob_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow()
});
