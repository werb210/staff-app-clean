// server/src/db/schema/signatures.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const signatures = pgTable('signatures', {
  id: uuid('id').primaryKey().defaultRandom(),

  applicationId: uuid('application_id').notNull(),

  signNowDocumentId: text('signnow_document_id').notNull(),
  signedBlobKey: text('signed_blob_key').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
});
