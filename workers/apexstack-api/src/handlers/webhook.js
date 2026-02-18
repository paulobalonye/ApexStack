/* ============================================
   Resend Webhook Handler (Feature 4 + 5)
   Receives email events from Resend, stores
   in D1, and syncs engagement to HubSpot
   ============================================ */

import { insertEmailEvent, getEngagementStats } from '../db/queries.js';
import { updateContactEngagement } from '../services/hubspot.js';
import { sendHotLeadAlert } from '../services/resend.js';

// Resend events we care about
const TRACKED_EVENTS = [
  'email.delivered',
  'email.opened',
  'email.clicked',
  'email.bounced',
  'email.complained',
];

export async function handleResendWebhook(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return { success: false, error: 'Invalid JSON payload' };
  }

  const { type, data } = payload;

  if (!type || !data) {
    return { success: false, error: 'Missing type or data' };
  }

  // Only process events we track
  if (!TRACKED_EVENTS.includes(type)) {
    return { success: true, message: 'Event type not tracked', type };
  }

  // Extract email recipient
  const recipientEmail = (data.to && data.to[0]) || data.email || '';
  if (!recipientEmail) {
    return { success: false, error: 'No recipient email in event data' };
  }

  // Store event in D1
  try {
    await insertEmailEvent({
      email: recipientEmail,
      eventType: type,
      emailId: data.email_id || data.id || '',
      subject: data.subject || '',
      metadata: JSON.stringify({
        created_at: data.created_at,
        click_url: data.click?.link || null,
        bounce_type: data.bounce?.type || null,
      }),
    }, env);
  } catch (err) {
    console.error('D1 email event insert error:', err);
  }

  // Feature 5: Sync engagement to HubSpot for opens/clicks
  if (type === 'email.opened' || type === 'email.clicked') {
    try {
      const stats = await getEngagementStats(recipientEmail, env);
      if (stats) {
        const level = calculateEngagementLevel(stats);
        await updateContactEngagement(recipientEmail, {
          opens: stats.opens,
          clicks: stats.clicks,
          level: level,
        }, env);

        // Hot lead escalation alert
        if (level === 'hot') {
          try {
            await sendHotLeadAlert(recipientEmail, stats, env);
          } catch (alertErr) {
            console.error('Hot lead alert error:', alertErr);
          }
        }
      }
    } catch (err) {
      console.error('HubSpot engagement sync error:', err);
    }
  }

  return { success: true, event: type, email: recipientEmail };
}

function calculateEngagementLevel(stats) {
  // Hot: 3+ opens AND 1+ clicks in last 7 days
  if (stats.recentOpens >= 3 && stats.recentClicks >= 1) return 'hot';
  // Warm: 1+ opens in last 14 days
  if (stats.recentOpens >= 1) return 'warm';
  // Cold: no recent engagement
  return 'cold';
}
