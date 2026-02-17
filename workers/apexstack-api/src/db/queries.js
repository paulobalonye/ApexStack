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
    INSERT INTO contact_submissions (first_name, last_name, email, company, service_interest, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const result = await stmt.bind(
    data.firstName,
    data.lastName,
    data.email,
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
