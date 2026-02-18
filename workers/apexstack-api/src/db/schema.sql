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

-- ============================================
-- Contact Form Submissions
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  service_interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  resend_status TEXT,
  hubspot_status TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_service_interest ON contact_submissions(service_interest);

-- ============================================
-- Email Unsubscribes
-- ============================================
CREATE TABLE IF NOT EXISTS unsubscribes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL,
  unsubscribed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_unsub_email ON unsubscribes(email);

-- ============================================
-- Email Events (Resend Webhooks)
-- ============================================
CREATE TABLE IF NOT EXISTS email_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  email_id TEXT,
  subject TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_email ON email_events(email);
CREATE INDEX IF NOT EXISTS idx_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON email_events(created_at);

-- ============================================
-- Sent Emails (Cron dedup tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS sent_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  reference_key TEXT NOT NULL DEFAULT '',
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sent_emails_dedup ON sent_emails(email, email_type, reference_key);
CREATE INDEX IF NOT EXISTS idx_sent_emails_type ON sent_emails(email_type);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent ON sent_emails(sent_at);
