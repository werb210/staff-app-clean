CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id),
  name text NOT NULL,
  category text NOT NULL,
  mime_type text NOT NULL,
  size_bytes int NOT NULL,
  storage_path text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
