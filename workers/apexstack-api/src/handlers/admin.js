/* ============================================
   Admin Dashboard API Handler
   Routes: /api/admin/*
   ============================================ */

import { verifyLogin, verifyToken } from '../utils/auth.js';
import { TEMPLATE_REGISTRY, getDefaultHtml, getRegistryEntry } from '../templates/template-registry.js';

// Flatten complex variables for {{placeholder}} replacement
function flattenVariables(vars) {
  const flat = {};
  for (const [key, value] of Object.entries(vars)) {
    if (Array.isArray(value)) {
      flat[key] = value.map(item =>
        `<li style="padding: 6px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">${item}</li>`
      ).join('');
    } else if (value !== null && value !== undefined && typeof value === 'object') {
      for (const [subKey, subValue] of Object.entries(value)) {
        flat[`${key}_${subKey}`] = subValue;
      }
    } else {
      flat[key] = value;
    }
  }
  return flat;
}

function replacePlaceholders(html, variables) {
  const flat = flattenVariables(variables);
  return html.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return flat[varName] !== undefined ? String(flat[varName]) : match;
  });
}

export async function handleAdminRequest(request, url, env) {
  const path = url.pathname;
  const method = request.method;

  // --- PUBLIC: Login ---
  if (path === '/api/admin/login' && method === 'POST') {
    return handleLogin(request, env);
  }

  // --- ALL OTHER ROUTES: Require auth ---
  const authHeader = request.headers.get('Authorization');
  const isValid = await verifyToken(authHeader, env);
  if (!isValid) {
    return { status: 401, body: { success: false, error: 'Unauthorized' } };
  }

  // Route dispatch
  if (path === '/api/admin/stats' && method === 'GET') {
    return handleStats(env);
  }

  if (path === '/api/admin/templates' && method === 'GET') {
    return handleListTemplates(url, env);
  }

  if (path === '/api/admin/seed' && method === 'POST') {
    return handleSeed(env);
  }

  // Template-specific routes: /api/admin/templates/:key[/action]
  const templateMatch = path.match(/^\/api\/admin\/templates\/([^/]+)(\/(.+))?$/);
  if (templateMatch) {
    const key = decodeURIComponent(templateMatch[1]);
    const action = templateMatch[3];

    if (!action && method === 'GET') {
      return handleGetTemplate(key, env);
    }
    if (!action && method === 'PUT') {
      return handleUpdateTemplate(key, request, env);
    }
    if (action === 'preview' && method === 'POST') {
      return handlePreview(key, request, env);
    }
    if (action === 'reset' && method === 'POST') {
      return handleReset(key, env);
    }
    if (action === 'send-test' && method === 'POST') {
      return handleSendTest(key, env);
    }
  }

  return { status: 404, body: { success: false, error: 'Admin route not found' } };
}

// --- LOGIN ---
async function handleLogin(request, env) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return { status: 400, body: { success: false, error: 'Username and password required' } };
    }
    const result = await verifyLogin(username, password, env);
    if (!result) {
      return { status: 401, body: { success: false, error: 'Invalid credentials' } };
    }
    return { status: 200, body: { success: true, token: result.token, expiresAt: result.expiresAt } };
  } catch (err) {
    console.error('Login error:', err);
    return { status: 500, body: { success: false, error: 'Login failed' } };
  }
}

// --- STATS ---
async function handleStats(env) {
  const total = await env.DB.prepare('SELECT COUNT(*) as count FROM email_templates').first();
  const customized = await env.DB.prepare('SELECT COUNT(*) as count FROM email_templates WHERE is_customized = 1').first();
  const byCategory = await env.DB.prepare(
    'SELECT category, COUNT(*) as count FROM email_templates GROUP BY category ORDER BY category'
  ).all();

  return {
    status: 200,
    body: {
      success: true,
      stats: {
        total: total.count,
        customized: customized.count,
        default: total.count - customized.count,
        byCategory: byCategory.results,
      },
    },
  };
}

// --- LIST TEMPLATES ---
async function handleListTemplates(url, env) {
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');

  let query = 'SELECT template_key, category, name, subject, recipient_type, trigger_description, is_customized, last_edited_at FROM email_templates WHERE 1=1';
  const binds = [];

  if (category) {
    query += ' AND category = ?';
    binds.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR template_key LIKE ? OR subject LIKE ?)';
    const term = `%${search}%`;
    binds.push(term, term, term);
  }

  query += ' ORDER BY category, name';

  const stmt = env.DB.prepare(query);
  const result = binds.length > 0 ? await stmt.bind(...binds).all() : await stmt.all();

  return { status: 200, body: { success: true, templates: result.results } };
}

// --- GET SINGLE TEMPLATE ---
async function handleGetTemplate(key, env) {
  const row = await env.DB.prepare('SELECT * FROM email_templates WHERE template_key = ?').bind(key).first();

  if (!row) {
    return { status: 404, body: { success: false, error: 'Template not found' } };
  }

  // If not customized, generate default HTML from the JS function
  let html = row.html_content;
  if (!html || !row.is_customized) {
    html = getDefaultHtml(key);
  }

  return {
    status: 200,
    body: {
      success: true,
      template: {
        ...row,
        html_content: html,
        variables: JSON.parse(row.variables || '[]'),
        sample_data: JSON.parse(row.sample_data || '{}'),
      },
    },
  };
}

// --- UPDATE TEMPLATE ---
async function handleUpdateTemplate(key, request, env) {
  try {
    const { html_content, subject } = await request.json();

    await env.DB.prepare(`
      UPDATE email_templates
      SET html_content = ?, subject = ?, is_customized = 1, last_edited_at = datetime('now')
      WHERE template_key = ?
    `).bind(html_content, subject || null, key).run();

    return { status: 200, body: { success: true, message: 'Template saved' } };
  } catch (err) {
    console.error('Update template error:', err);
    return { status: 500, body: { success: false, error: 'Failed to save template' } };
  }
}

// --- PREVIEW TEMPLATE ---
async function handlePreview(key, request, env) {
  try {
    const { html_content, sample_data } = await request.json();
    const rendered = replacePlaceholders(html_content || '', sample_data || {});
    return { status: 200, body: { success: true, html: rendered } };
  } catch (err) {
    console.error('Preview error:', err);
    return { status: 500, body: { success: false, error: 'Preview failed' } };
  }
}

// --- RESET TEMPLATE ---
async function handleReset(key, env) {
  const entry = getRegistryEntry(key);
  if (!entry) {
    return { status: 404, body: { success: false, error: 'Template not in registry' } };
  }

  await env.DB.prepare(`
    UPDATE email_templates
    SET html_content = NULL, is_customized = 0, last_edited_at = NULL, subject = ?
    WHERE template_key = ?
  `).bind(entry.subjectTemplate, key).run();

  const defaultHtml = getDefaultHtml(key);
  return { status: 200, body: { success: true, html: defaultHtml, subject: entry.subjectTemplate } };
}

// --- SEND TEST EMAIL ---
async function handleSendTest(key, env) {
  const row = await env.DB.prepare('SELECT * FROM email_templates WHERE template_key = ?').bind(key).first();
  if (!row) return { status: 404, body: { success: false, error: 'Template not found' } };

  const sampleData = JSON.parse(row.sample_data || '{}');
  let html = row.is_customized && row.html_content
    ? replacePlaceholders(row.html_content, sampleData)
    : getDefaultHtml(key);

  if (!html) {
    return { status: 400, body: { success: false, error: 'Could not generate template HTML' } };
  }

  const subject = `[TEST] ${replacePlaceholders(row.subject || row.name, sampleData)}`;
  const recipient = env.RECIPIENT_EMAIL || 'info@apexstackcloud.com';
  const fromName = env.FROM_NAME || 'ApexStack Cloud';
  const fromEmail = env.FROM_EMAIL || 'hello@apexstackcloud.com';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [recipient],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { status: 500, body: { success: false, error: `Resend error: ${JSON.stringify(data)}` } };
    }

    return { status: 200, body: { success: true, sent_to: recipient, id: data.id } };
  } catch (err) {
    console.error('Send test error:', err);
    return { status: 500, body: { success: false, error: 'Failed to send test email' } };
  }
}

// --- SEED TEMPLATES ---
async function handleSeed(env) {
  const entries = Object.entries(TEMPLATE_REGISTRY);
  let seeded = 0;

  const stmt = env.DB.prepare(`
    INSERT OR REPLACE INTO email_templates
    (template_key, category, name, subject, variables, sample_data, trigger_description, recipient_type, default_subject, is_customized)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `);

  // Batch in groups of 50
  const batchSize = 50;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize).map(([key, entry]) =>
      stmt.bind(
        key,
        entry.category,
        entry.name,
        entry.subjectTemplate,
        JSON.stringify(entry.variables),
        JSON.stringify(entry.sampleData),
        entry.triggerDescription,
        entry.recipientType,
        entry.subjectTemplate
      )
    );
    await env.DB.batch(batch);
    seeded += batch.length;
  }

  return { status: 200, body: { success: true, seeded } };
}
