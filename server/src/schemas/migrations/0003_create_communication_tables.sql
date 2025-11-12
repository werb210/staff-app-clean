CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  to_number TEXT NOT NULL,
  from_number TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  provider_sid TEXT,
  sent_by TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sms_messages_contact_idx
  ON sms_messages (contact_id, created_at DESC);

CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  to_number TEXT NOT NULL,
  from_number TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  status TEXT NOT NULL CHECK (status IN ('initiated', 'queued', 'ringing', 'in-progress', 'completed', 'failed', 'canceled', 'busy', 'no-answer')),
  duration INTEGER NOT NULL DEFAULT 0,
  context TEXT,
  initiated_by TEXT,
  provider_sid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calls_contact_idx
  ON calls (contact_id, created_at DESC);

CREATE TABLE IF NOT EXISTS email_messages (
  id UUID PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  provider TEXT NOT NULL CHECK (provider IN ('sendgrid', 'graph', 'manual')),
  provider_message_id TEXT,
  sent_by TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_messages_contact_idx
  ON email_messages (contact_id, created_at DESC);

CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sms', 'email')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS message_templates_type_idx
  ON message_templates (type, updated_at DESC);
