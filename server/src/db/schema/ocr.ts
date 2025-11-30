// server/src/db/schema/ocr.ts
import { pgTable, uuid, jsonb, timestamp, text } from 'drizzle-orm/pg-core';

export const ocrResults = pgTable('ocr_results', {
  id: uuid('id').primaryKey().defaultRandom(),

  documentId: uuid('document_id').notNull(),

  // Full structured OCR output
  fields: jsonb('fields').notNull(),

  // "balance_sheet", "bank_statement", "tax_return", etc.
  docType: text('doc_type'),

  createdAt: timestamp('created_at').defaultNow(),
});
