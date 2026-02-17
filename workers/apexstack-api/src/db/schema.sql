-- ApexStack Cloud Leads Database
-- Run: wrangler d1 execute apexstack-leads --file=src/db/schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL,
  score INTEGER NOT NULL,
  level TEXT NOT NULL,
  category_architecture INTEGER DEFAULT 0,
  category_security INTEGER DEFAULT 0,
  category_deployment INTEGER DEFAULT 0,
  category_monitoring INTEGER DEFAULT 0,
  category_cost INTEGER DEFAULT 0,
  risks TEXT,
  recommendations TEXT,
  resend_status TEXT,
  hubspot_status TEXT,
  web3forms_status TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for quick lookups by email
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Index for score-based analytics
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
