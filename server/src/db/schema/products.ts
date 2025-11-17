// server/src/db/schema/products.ts
import { pgTable, varchar, numeric, boolean, text } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  lenderId: varchar("lender_id").notNull(),
  name: varchar("name").notNull(),
  productType: varchar("product_type").notNull(),
  minAmount: numeric("min_amount"),
  maxAmount: numeric("max_amount"),
  active: boolean("active").default(true),
  description: text("description")
});
