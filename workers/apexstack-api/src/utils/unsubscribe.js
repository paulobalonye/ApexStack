/* ============================================
   Unsubscribe Token Utilities
   HMAC-based token generation for secure
   email unsubscribe links
   ============================================ */

export async function generateUnsubToken(email, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(email));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

export function buildUnsubUrl(email, token, baseUrl) {
  const base = baseUrl || 'https://apexstack-api.noreplyhitchafrica.workers.dev';
  return `${base}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
