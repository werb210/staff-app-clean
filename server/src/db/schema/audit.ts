// server/src/db/schema/audit.ts
import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),

  eventType: text('event_type').notNull(),
  userId: uuid('user_id'),
  applicationId: uuid('application_id'),
  details: jsonb('details'),

  createdAt: timestamp('created_at').defaultNow(),
});
