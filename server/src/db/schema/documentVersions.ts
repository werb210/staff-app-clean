// server/src/db/schema/documentVersions.ts
import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),

  documentId: uuid('document_id').notNull(),
  versionNumber: integer('version_number').notNull(),

  azureBlobKey: text('azure_blob_key').notNull(),
  checksum: text('checksum'),
  sizeBytes: integer('size_bytes'),

  createdAt: timestamp('created_at').defaultNow(),
});
