-- ============================================
-- Admin Dashboard: Email Templates + Sessions
-- Run: wrangler d1 execute apexstack-leads --file=src/db/migration-003-admin.sql
-- ============================================

CREATE TABLE IF NOT EXISTS email_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT,
  html_content TEXT,
  variables TEXT,
  sample_data TEXT,
  trigger_description TEXT,
  recipient_type TEXT,
  default_subject TEXT,
  is_customized INTEGER DEFAULT 0,
  last_edited_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_customized ON email_templates(is_customized);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON admin_sessions(expires_at);
