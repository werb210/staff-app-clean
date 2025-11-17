import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";

export const lenders = pgTable("lenders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  active: boolean("active").default(true)
});
