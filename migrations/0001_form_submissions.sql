CREATE TABLE IF NOT EXISTS form_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'careers')),
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS form_submissions_type_time
  ON form_submissions (form_type, submitted_at DESC);
