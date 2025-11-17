import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),

  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 200 })
});
