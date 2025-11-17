// server/src/db/schema/users.ts
import { pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").notNull(),
  passwordHash: varchar("password_hash").notNull(),
  role: varchar("role").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
