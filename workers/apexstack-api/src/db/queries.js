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

export async function getContactInfoByEmail(email, env) {
  const db = env.DB;
  if (!db) return null;

  // Try leads table first (has richer data: name, company, score)
  const lead = await db.prepare(
    'SELECT name, email, company, score, level FROM leads WHERE email = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(email).first();

  if (lead) {
    return {
      name: lead.name,
      email: lead.email,
      company: lead.company,
      score: lead.score,
      level: lead.level,
      source: 'leads',
    };
  }

  // Fall back to contact_submissions
  const contact = await db.prepare(
    'SELECT first_name, last_name, email, company FROM contact_submissions WHERE email = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(email).first();

  if (contact) {
    return {
      name: `${contact.first_name} ${contact.last_name}`.trim(),
      email: contact.email,
      company: contact.company || '',
      score: null,
      level: null,
      source: 'contact_submissions',
    };
  }

  return null;
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
   Contact Service Status Tracking (Feature 3)
   ============================================ */

export async function updateContactServiceStatuses(id, statuses, env) {
  const db = env.DB;
  if (!db || !id) return;

  const updates = [];
  const values = [];

  if (statuses.resend !== undefined) {
    updates.push('resend_status = ?');
    values.push(statuses.resend);
  }
  if (statuses.hubspot !== undefined) {
    updates.push('hubspot_status = ?');
    values.push(statuses.hubspot);
  }

  if (updates.length === 0) return;

  values.push(id);

  await db.prepare(`UPDATE contact_submissions SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
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
   Sent Email Dedup Tracking
   Prevents duplicate sends from cron jobs
   ============================================ */

export async function hasSentEmail(email, emailType, referenceKey, env) {
  const db = env.DB;
  if (!db) return false;

  const result = await db.prepare(
    'SELECT id FROM sent_emails WHERE email = ? AND email_type = ? AND reference_key = ?'
  ).bind(email, emailType, referenceKey || '').first();

  return !!result;
}

export async function recordSentEmail(email, emailType, referenceKey, env) {
  const db = env.DB;
  if (!db) return;

  await db.prepare(
    'INSERT OR IGNORE INTO sent_emails (email, email_type, reference_key) VALUES (?, ?, ?)'
  ).bind(email, emailType, referenceKey || '').run();
}

/* ============================================
   Broadcast Recipient Query
   Returns all unique active recipients
   (leads + contacts minus unsubscribes)
   ============================================ */

export async function getAllActiveRecipients(env) {
  const db = env.DB;
  if (!db) return [];

  const result = await db.prepare(`
    SELECT DISTINCT email, name FROM (
      SELECT email, name FROM leads
      UNION
      SELECT email, (first_name || ' ' || last_name) as name FROM contact_submissions
    )
    WHERE email NOT IN (SELECT email FROM unsubscribes)
    ORDER BY email
  `).all();

  return result.results || [];
}

/* ============================================
   Re-engagement Queries (Feature 7)
   ============================================ */

export async function getLeadsForReengagement(daysAgo, env) {
  const db = env.DB;
  if (!db) return [];

  // Get leads + contact submissions from ~30 days ago (28-32 day window)
  // UNION ALL includes contact form submitters for re-engagement (Feature 5)
  const result = await db.prepare(`
    SELECT name, email, score, level, created_at FROM (
      SELECT l.name, l.email, l.score, l.level, l.created_at
      FROM leads l
      WHERE l.created_at BETWEEN datetime('now', '-' || ? || ' days', '-2 days')
                            AND datetime('now', '-' || ? || ' days', '+2 days')
        AND l.email NOT IN (SELECT email FROM unsubscribes)
      UNION ALL
      SELECT (c.first_name || ' ' || c.last_name) as name, c.email, NULL as score, NULL as level, c.created_at
      FROM contact_submissions c
      WHERE c.created_at BETWEEN datetime('now', '-' || ? || ' days', '-2 days')
                            AND datetime('now', '-' || ? || ' days', '+2 days')
        AND c.email NOT IN (SELECT email FROM unsubscribes)
    )
    ORDER BY created_at DESC
    LIMIT 50
  `).bind(daysAgo, daysAgo, daysAgo, daysAgo).all();

  return result.results || [];
}
