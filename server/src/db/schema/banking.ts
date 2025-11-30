// server/src/db/schema/banking.ts
import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const bankingAnalysis = pgTable('banking_analysis', {
  id: uuid('id').primaryKey().defaultRandom(),

  applicationId: uuid('application_id').notNull(),

  // Full banking analysis output
  data: jsonb('data').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
});
