// server/src/db/schema/signatures.ts
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const signatures = pgTable('signatures', {
  id: uuid('id').primaryKey().defaultRandom(),

  applicationId: uuid('application_id').notNull(),

  signNowDocumentId: text('signnow_document_id'),
  signedBlobKey: text('signed_blob_key'),
  details: jsonb('details'),

  createdAt: timestamp('created_at').defaultNow(),
});
