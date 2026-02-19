/* ============================================
   Admin Authentication Utility
   JWT generation/verification using Web Crypto API
   No npm dependencies required
   ============================================ */

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' };
const TOKEN_EXPIRY_HOURS = 24;

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded);
}

async function getSigningKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    ALGORITHM,
    false,
    ['sign', 'verify']
  );
}

export async function verifyLogin(username, password, env) {
  if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
    return await generateToken(env);
  }
  return null;
}

export async function generateToken(env) {
  const secret = env.ADMIN_JWT_SECRET;
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (TOKEN_EXPIRY_HOURS * 3600);

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({ sub: 'admin', iat: now, exp }));
  const data = `${header}.${payload}`;

  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sig = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));

  const token = `${data}.${sig}`;

  // Store session in D1
  const expiresAt = new Date(exp * 1000).toISOString();
  await env.DB.prepare(
    'INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)'
  ).bind(token, expiresAt).run();

  // Clean up expired sessions
  await env.DB.prepare(
    "DELETE FROM admin_sessions WHERE expires_at < datetime('now')"
  ).run();

  return { token, expiresAt };
}

export async function verifyToken(authHeader, env) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.replace('Bearer ', '');

  // Check session exists and not expired
  const session = await env.DB.prepare(
    "SELECT id FROM admin_sessions WHERE token = ? AND expires_at > datetime('now')"
  ).bind(token).first();

  if (!session) return false;

  // Verify JWT signature
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [header, payload, sig] = parts;
  const data = `${header}.${payload}`;

  const key = await getSigningKey(env.ADMIN_JWT_SECRET);

  const sigBytes = Uint8Array.from(
    base64UrlDecode(sig),
    c => c.charCodeAt(0)
  );

  try {
    return await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
  } catch {
    return false;
  }
}
