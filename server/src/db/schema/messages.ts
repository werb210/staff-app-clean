// server/src/db/schema/messages.ts
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),

  applicationId: uuid('application_id').notNull(),

  // "client" | "staff" | "ai"
  sender: text('sender').notNull(),

  body: text('body').notNull(),

  // For future attachments
  attachments: jsonb('attachments'),

  createdAt: timestamp('created_at').defaultNow(),
});
