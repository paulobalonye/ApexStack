-- Migration 002: Sent Emails Dedup Table
-- Run: wrangler d1 execute apexstack-leads --remote --file=src/db/migration-002-sent-emails.sql

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
