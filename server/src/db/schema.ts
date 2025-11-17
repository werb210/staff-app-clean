// server/src/db/schema.ts
import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  integer
} from "drizzle-orm/pg-core";

//
// APPLICATIONS
//
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  businessName: text("business_name"),
  status: text("status").default("new"),
  amountRequested: integer("amount_requested"),
  country: text("country"),
  industry: text("industry"),
  purpose: text("purpose"),
  createdAt: timestamp("created_at").defaultNow()
});

//
// LENDERS
//
export const lenders = pgTable("lenders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  country: text("country"),
  active: boolean("active").default(true)
});

//
// DEALS — tied to APPLICATIONS
//
export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id"),
  lenderId: uuid("lender_id"),
  status: text("status").default("in_review"),
  createdAt: timestamp("created_at").defaultNow()
});

//
// COMPANIES — tied to APPLICATIONS
//
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id"),
  legalName: text("legal_name"),
  operatingName: text("operating_name"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow()
});
