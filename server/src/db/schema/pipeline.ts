// server/src/db/schema/pipeline.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const pipelineEvents = pgTable('pipeline_events', {
  id: uuid('id').primaryKey().defaultRandom(),

  applicationId: uuid('application_id').notNull(),

  // "Received", "Documents Required", "In Review", etc.
  stage: text('stage').notNull(),

  // Why the change occurred (auto, document accepted, staff action, etc.)
  reason: text('reason'),

  createdAt: timestamp('created_at').defaultNow(),
});
