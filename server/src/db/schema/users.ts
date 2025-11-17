import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 200 }).notNull(),
  passwordHash: varchar("password_hash", { length: 500 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  active: boolean("active").default(true)
});
