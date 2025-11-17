// server/src/db/schema.ts

import { pgTable, varchar, text, timestamp, boolean, integer, uuid, jsonb } from "drizzle-orm/pg-core";

// -----------------------------------------------------------------------------
// CONTACTS (CRM)
// -----------------------------------------------------------------------------
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 50 }),
  silo: varchar("silo", { length: 10 }).notNull(), // bf | slf
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// COMPANIES (CRM)
// -----------------------------------------------------------------------------
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  industry: varchar("industry", { length: 200 }),
  website: varchar("website", { length: 300 }),
  ownerContactId: uuid("owner_contact_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// DEALS (CRM pipeline)
// -----------------------------------------------------------------------------
export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull(),
  contactId: uuid("contact_id").notNull(),
  amountRequested: integer("amount_requested"),
  stage: varchar("stage", { length: 50 }).notNull(), // New, Requires Docs, In Review, Sent to Lender, Funded, Lost
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// APPLICATIONS (Client → Staff submission)
// -----------------------------------------------------------------------------
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Applicant
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 50 }),

  // Business
  businessName: varchar("business_name", { length: 300 }),
  industry: varchar("industry", { length: 200 }),
  yearsInBusiness: integer("years_in_business"),

  // Location + Amount
  country: varchar("country", { length: 20 }),
  amountRequested: integer("amount_requested"),

  // Revenue
  last12moRevenue: integer("last_12mo_revenue"),
  avgMonthlyRevenue: integer("avg_monthly_revenue"),

  // Purpose
  purpose: text("purpose"),

  // Status
  status: varchar("status", { length: 50 }).default("New"),

  // Meta
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// DOCUMENTS (Azure Blob Storage)
// -----------------------------------------------------------------------------
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  mimeType: varchar("mime_type", { length: 200 }),

  // Azure Blob file key
  blobPath: varchar("blob_path", { length: 500 }).notNull(),

  // SHA-256 integrity
  checksum: varchar("checksum", { length: 128 }),

  // Versioning
  version: integer("version").default(1).notNull(),

  // Status
  accepted: boolean("accepted").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// LENDERS
// -----------------------------------------------------------------------------
export const lenders = pgTable("lenders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  country: varchar("country", { length: 10 }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// LENDER PRODUCTS (Recommendation Engine)
// -----------------------------------------------------------------------------
export const lenderProducts = pgTable("lender_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  lenderId: uuid("lender_id").notNull(),

  productType: varchar("product_type", { length: 50 }), // LOC, Term Loan, Factoring, Equipment, Startup
  minAmount: integer("min_amount"),
  maxAmount: integer("max_amount"),

  minFico: integer("min_fico"),
  minYearsInBusiness: integer("min_years_in_business"),
  requiresFinancials: boolean("requires_financials").default(false),
  requiresBankStatements: boolean("requires_bank_statements").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// NOTIFICATIONS (Staff + Client + System events)
// -----------------------------------------------------------------------------
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  type: varchar("type", { length: 50 }).notNull(),
  payload: jsonb("payload"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// AUDIT LOG
// -----------------------------------------------------------------------------
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id"),
  action: varchar("action", { length: 200 }).notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
