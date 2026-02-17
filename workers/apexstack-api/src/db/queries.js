/* ============================================
   D1 Database Query Helpers
   Insert and query lead records
   ============================================ */

export async function insertLead(leadData, env) {
  const db = env.DB;

  if (!db) {
    console.warn('D1: No database binding configured, skipping');
    return { skipped: true, reason: 'No DB binding configured' };
  }

  const { name, email, company, phone, role, score, level, categoryScores, risks, recs } = leadData;

  const stmt = db.prepare(`
    INSERT INTO leads (
      name, email, company, phone, role, score, level,
      category_architecture, category_security, category_deployment,
      category_monitoring, category_cost,
      risks, recommendations, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const result = await stmt.bind(
    name,
    email,
    company,
    phone || '',
    role,
    score,
    level,
    categoryScores?.architecture || 0,
    categoryScores?.security || 0,
    categoryScores?.deployment || 0,
    categoryScores?.monitoring || 0,
    categoryScores?.cost || 0,
    JSON.stringify(risks || []),
    JSON.stringify(recs || [])
  ).run();

  return { success: true, id: result.meta?.last_row_id };
}

export async function getLeadByEmail(email, env) {
  const db = env.DB;
  if (!db) return null;

  const result = await db.prepare('SELECT * FROM leads WHERE email = ? ORDER BY created_at DESC LIMIT 1')
    .bind(email)
    .first();

  return result;
}

export async function getRecentLeads(limit, env) {
  const db = env.DB;
  if (!db) return [];

  const result = await db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?')
    .bind(limit || 50)
    .all();

  return result.results || [];
}

export async function updateLeadServiceStatus(id, service, status, env) {
  const db = env.DB;
  if (!db) return;

  const column = `${service}_status`;
  const allowedColumns = ['resend_status', 'hubspot_status', 'web3forms_status'];

  if (!allowedColumns.includes(column)) return;

  await db.prepare(`UPDATE leads SET ${column} = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(status, id)
    .run();
}

/* ============================================
   Contact Form Queries
   ============================================ */

export async function insertContactSubmission(data, env) {
  const db = env.DB;
  if (!db) return { skipped: true, reason: 'No DB binding configured' };

  const stmt = db.prepare(`
    INSERT INTO contact_submissions (first_name, last_name, email, phone, company, service_interest, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const result = await stmt.bind(
    data.firstName,
    data.lastName,
    data.email,
    data.phone || '',
    data.company || '',
    data.serviceInterest || '',
    data.message || ''
  ).run();

  return { success: true, id: result.meta?.last_row_id };
}

/* ============================================
   Unsubscribe Queries
   ============================================ */

export async function isUnsubscribed(email, env) {
  const db = env.DB;
  if (!db) return false;

  const result = await db.prepare('SELECT id FROM unsubscribes WHERE email = ?')
    .bind(email)
    .first();

  return !!result;
}

export async function insertUnsubscribe(email, token, env) {
  const db = env.DB;
  if (!db) return;

  await db.prepare('INSERT OR IGNORE INTO unsubscribes (email, token) VALUES (?, ?)')
    .bind(email, token)
    .run();
}

/* ============================================
   Email Events Queries (Feature 4)
   ============================================ */

export async function insertEmailEvent(data, env) {
  const db = env.DB;
  if (!db) return { skipped: true };

  const stmt = db.prepare(`
    INSERT INTO email_events (email, event_type, email_id, subject, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);

  const result = await stmt.bind(
    data.email,
    data.eventType,
    data.emailId || '',
    data.subject || '',
    data.metadata || ''
  ).run();

  return { success: true, id: result.meta?.last_row_id };
}

export async function getEmailEventsByEmail(email, env) {
  const db = env.DB;
  if (!db) return [];

  const result = await db.prepare(
    'SELECT * FROM email_events WHERE email = ? ORDER BY created_at DESC LIMIT 100'
  ).bind(email).all();

  return result.results || [];
}

export async function getEngagementStats(email, env) {
  const db = env.DB;
  if (!db) return null;

  // Total counts
  const opens = await db.prepare(
    "SELECT COUNT(*) as count FROM email_events WHERE email = ? AND event_type = 'email.opened'"
  ).bind(email).first();

  const clicks = await db.prepare(
    "SELECT COUNT(*) as count FROM email_events WHERE email = ? AND event_type = 'email.clicked'"
  ).bind(email).first();

  // Recent counts (last 14 days)
  const recentOpens = await db.prepare(
    "SELECT COUNT(*) as count FROM email_events WHERE email = ? AND event_type = 'email.opened' AND created_at >= datetime('now', '-14 days')"
  ).bind(email).first();

  const recentClicks = await db.prepare(
    "SELECT COUNT(*) as count FROM email_events WHERE email = ? AND event_type = 'email.clicked' AND created_at >= datetime('now', '-7 days')"
  ).bind(email).first();

  return {
    opens: opens?.count || 0,
    clicks: clicks?.count || 0,
    recentOpens: recentOpens?.count || 0,
    recentClicks: recentClicks?.count || 0,
  };
}

/* ============================================
   Re-engagement Queries (Feature 7)
   ============================================ */

export async function getLeadsForReengagement(daysAgo, env) {
  const db = env.DB;
  if (!db) return [];

  // Get leads from ~30 days ago (28-32 day window)
  const result = await db.prepare(`
    SELECT l.name, l.email, l.score, l.level, l.created_at
    FROM leads l
    WHERE l.created_at BETWEEN datetime('now', '-' || ? || ' days', '-2 days')
                          AND datetime('now', '-' || ? || ' days', '+2 days')
      AND l.email NOT IN (SELECT email FROM unsubscribes)
    ORDER BY l.created_at DESC
    LIMIT 50
  `).bind(daysAgo, daysAgo).all();

  return result.results || [];
}
