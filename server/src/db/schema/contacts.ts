// server/src/db/schema/contacts.ts
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey(),
  companyId: varchar("company_id"),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
