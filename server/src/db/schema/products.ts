// server/src/db/schema/products.ts
import { pgTable, text, varchar, numeric, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { lenders } from "./lenders";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  lenderId: uuid("lender_id").references(() => lenders.id).notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description"),

  minAmount: numeric("min_amount"),
  maxAmount: numeric("max_amount"),
  interestRate: numeric("interest_rate"),

  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(true),
});
