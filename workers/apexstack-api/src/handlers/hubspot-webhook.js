/* ============================================
   HubSpot Webhook Handler (Features 1, 2)
   Processes meeting-booked and no-show events
   from HubSpot webhook subscriptions
   ============================================ */

import { sendMeetingBookedEmail, sendNoShowEmail } from '../services/resend.js';
import { hasSentEmail, recordSentEmail } from '../db/queries.js';

/* ============================================
   Signature Validation
   Validates X-HubSpot-Signature-v3 using
   HMAC-SHA256 with client secret
   ============================================ */

async function validateSignature(request, body, env) {
  const secret = env.HUBSPOT_CLIENT_SECRET;
  if (!secret) {
    console.warn('HubSpot webhook: No HUBSPOT_CLIENT_SECRET configured, skipping validation');
    return true; // Allow in dev if secret not set
  }

  const signature = request.headers.get('X-HubSpot-Signature-v3');
  const timestamp = request.headers.get('X-HubSpot-Request-Timestamp');

  if (!signature || !timestamp) {
    console.warn('HubSpot webhook: Missing signature headers');
    return false;
  }

  // Check timestamp is within 5 minutes
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);
  if (Math.abs(now - requestTime) > 300000) {
    console.warn('HubSpot webhook: Timestamp too old');
    return false;
  }

  // Compute HMAC-SHA256(secret, method + url + body + timestamp)
  const method = 'POST';
  const url = request.url;
  const message = `${method}${url}${body}${timestamp}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  const computedSig = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));

  return computedSig === signature;
}

/* ============================================
   Main Webhook Handler
   ============================================ */

export async function handleHubSpotWebhook(request, env) {
  const body = await request.text();

  // Validate signature
  const valid = await validateSignature(request, body, env);
  if (!valid) {
    return { success: false, error: 'Invalid signature' };
  }

  let events;
  try {
    events = JSON.parse(body);
  } catch (err) {
    return { success: false, error: 'Invalid JSON' };
  }

  if (!Array.isArray(events)) {
    events = [events];
  }

  console.log(`HubSpot webhook: Processing ${events.length} event(s)`);

  const results = [];

  for (const event of events) {
    const { subscriptionType, objectId, propertyName, propertyValue } = event;

    try {
      if (subscriptionType === 'contact.propertyChange' && propertyName === 'hs_meetings_booked') {
        // Meeting booked
        const result = await handleMeetingBooked(event, env);
        results.push(result);
      } else if (subscriptionType === 'deal.propertyChange') {
        // Could handle deal stage changes here
        results.push({ event: subscriptionType, status: 'ignored' });
      } else {
        results.push({ event: subscriptionType, status: 'unhandled' });
      }
    } catch (err) {
      console.error(`HubSpot webhook error for event ${subscriptionType}:`, err);
      results.push({ event: subscriptionType, status: 'error', error: err.message });
    }

    // Rate limit between events
    await new Promise(r => setTimeout(r, 300));
  }

  return { success: true, processed: results.length, results };
}

/* ============================================
   Meeting Event Handlers
   ============================================ */

async function handleMeetingBooked(event, env) {
  const contactId = String(event.objectId);
  const meetingId = event.propertyValue || contactId;
  const referenceKey = `meeting-${meetingId}`;

  console.log(`HubSpot webhook: Meeting booked for contact ${contactId}`);

  // Fetch contact details from HubSpot
  const { getContactById } = await import('../services/hubspot.js');
  const contact = await getContactById(contactId, env);

  if (!contact || !contact.properties?.email) {
    return { event: 'meeting-booked', status: 'skipped', reason: 'Contact not found or no email' };
  }

  const email = contact.properties.email;
  const firstName = contact.properties.firstname || 'there';

  // Dedup — don't send if already sent for this meeting
  const alreadySent = await hasSentEmail(email, 'meeting-booked', referenceKey, env);
  if (alreadySent) {
    return { event: 'meeting-booked', status: 'skipped', reason: 'Already sent' };
  }

  // Send meeting booked email
  const result = await sendMeetingBookedEmail({
    email,
    firstName,
    meetingDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  }, env);

  if (result?.status === 'sent') {
    await recordSentEmail(email, 'meeting-booked', referenceKey, env);
  }

  return { event: 'meeting-booked', email, ...result };
}

/* ============================================
   No-Show Handler
   Can be triggered via a manual API call
   POST /api/webhooks/hubspot with custom event
   ============================================ */

export async function handleNoShow(contactEmail, firstName, env) {
  const referenceKey = `noshow-${contactEmail}-${new Date().toISOString().split('T')[0]}`;

  const alreadySent = await hasSentEmail(contactEmail, 'no-show', referenceKey, env);
  if (alreadySent) {
    return { event: 'no-show', status: 'skipped', reason: 'Already sent' };
  }

  const result = await sendNoShowEmail({
    email: contactEmail,
    firstName: firstName || 'there',
  }, env);

  if (result?.status === 'sent') {
    await recordSentEmail(contactEmail, 'no-show', referenceKey, env);
  }

  return { event: 'no-show', email: contactEmail, ...result };
}
