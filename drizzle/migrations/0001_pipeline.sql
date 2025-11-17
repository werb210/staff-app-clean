CREATE TABLE pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id),
  stage text NOT NULL,
  assigned_to uuid REFERENCES users(id),
  updated_at timestamp DEFAULT now()
);
