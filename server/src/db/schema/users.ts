// server/src/db/schema/users.ts
import { pgTable, text, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),

  // Example:
  // { BF: { role: "ADMIN" }, BI: { role: "STAFF" }, SLF: null }
  siloAccess: jsonb('silo_access').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
