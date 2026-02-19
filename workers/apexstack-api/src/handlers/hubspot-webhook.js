/* ============================================
   HubSpot Webhook Handler (Features 1, 2, 12)
   Processes meeting-booked, no-show, and
   deal stage change events from HubSpot
   webhook subscriptions
   ============================================ */

import { sendMeetingBookedEmail, sendNoShowEmail, sendPostMeetingEmail, sendHiringStageEmail } from '../services/resend.js';
import { hasSentEmail, recordSentEmail } from '../db/queries.js';

/* ============================================
   Hiring Pipeline Stage Map
   Maps HubSpot stage IDs → internal stage keys
   used in email-hiring-stages.js templates
   ============================================ */

const HIRING_PIPELINE_ID = '2011005672';

const HIRING_STAGE_MAP = {
  '3179253494': 'application_received',
  '3179253495': 'resume_screening',
  '3179253496': 'phone_interview',
  '3179253497': 'technical_interview',
  '3179254458': 'final_interview',
  '3179254459': 'offer_extended',
  '3179254460': 'hired',
  '3179325159': 'not_selected',
};

/* ============================================
   Signature Validation
   Validates X-HubSpot-Signature-v3 using
   HMAC-SHA256 with client secret
   ============================================ */

async function validateSignature(request, body, env) {
  const secret = env.HUBSPOT_CLIENT_SECRET;
  if (!secret) {
    console.warn('[WEBHOOK] No HUBSPOT_CLIENT_SECRET configured, skipping validation');
    return true; // Allow in dev if secret not set
  }

  const signature = request.headers.get('X-HubSpot-Signature-v3');
  const timestamp = request.headers.get('X-HubSpot-Request-Timestamp');

  if (!signature || !timestamp) {
    console.warn('[WEBHOOK] Missing signature headers — sig:', !!signature, 'ts:', !!timestamp);
    return false;
  }

  // Check timestamp is within 5 minutes
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);
  if (Math.abs(now - requestTime) > 300000) {
    console.warn('[WEBHOOK] Timestamp too old:', Math.abs(now - requestTime), 'ms');
    return false;
  }

  // Compute HMAC-SHA256(secret, method + url + body + timestamp)
  const method = 'POST';
  const url = request.url;
  const message = `${method}${url}${body}${timestamp}`;

  console.log('[WEBHOOK] Signature validation — request.url:', url);

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
  const match = computedSig === signature;

  if (!match) {
    console.warn('[WEBHOOK] Signature MISMATCH');
    console.warn('[WEBHOOK]   request.url used:', url);
    console.warn('[WEBHOOK]   received sig (first 20):', signature?.substring(0, 20));
    console.warn('[WEBHOOK]   computed sig (first 20):', computedSig?.substring(0, 20));
  } else {
    console.log('[WEBHOOK] Signature valid ✓');
  }

  return match;
}

/* ============================================
   Main Webhook Handler
   ============================================ */

export async function handleHubSpotWebhook(request, env) {
  console.log('[WEBHOOK] ===== Incoming HubSpot webhook =====');
  console.log('[WEBHOOK] Method:', request.method);
  console.log('[WEBHOOK] URL:', request.url);

  const body = await request.text();
  console.log('[WEBHOOK] Body length:', body.length, 'chars');

  // Validate signature
  const valid = await validateSignature(request, body, env);
  if (!valid) {
    console.error('[WEBHOOK] ✗ Signature validation FAILED — returning 401');
    return { success: false, error: 'Invalid signature' };
  }

  let events;
  try {
    events = JSON.parse(body);
  } catch (err) {
    console.error('[WEBHOOK] ✗ Invalid JSON body');
    return { success: false, error: 'Invalid JSON' };
  }

  if (!Array.isArray(events)) {
    events = [events];
  }

  console.log(`[WEBHOOK] Processing ${events.length} event(s)`);
  for (const e of events) {
    console.log(`[WEBHOOK]   → type: ${e.subscriptionType}, prop: ${e.propertyName}, value: ${e.propertyValue}, objectId: ${e.objectId}`);
  }

  const results = [];

  for (const event of events) {
    const { subscriptionType, objectId, propertyName, propertyValue } = event;

    try {
      if (subscriptionType === 'contact.propertyChange' && propertyName === 'hs_meetings_booked') {
        // Meeting booked
        console.log(`[WEBHOOK] Handling: meeting booked for contact ${objectId}`);
        const result = await handleMeetingBooked(event, env);
        console.log('[WEBHOOK] Meeting booked result:', JSON.stringify(result));
        results.push(result);
      } else if (subscriptionType === 'deal.propertyChange' && propertyName === 'dealstage') {
        // Deal stage changed — trigger post-meeting follow-up
        console.log(`[WEBHOOK] Handling: deal ${objectId} stage → ${propertyValue}`);
        const result = await handleDealStageChange(event, env);
        console.log('[WEBHOOK] Deal stage change result:', JSON.stringify(result));
        results.push(result);
      } else if (subscriptionType === 'deal.propertyChange') {
        // Other deal property changes — ignore for now
        console.log(`[WEBHOOK] Ignoring deal property change: ${propertyName}`);
        results.push({ event: subscriptionType, property: propertyName, status: 'ignored' });
      } else {
        console.log(`[WEBHOOK] Unhandled event type: ${subscriptionType}`);
        results.push({ event: subscriptionType, status: 'unhandled' });
      }
    } catch (err) {
      console.error(`[WEBHOOK] ✗ Error for ${subscriptionType}:`, err);
      results.push({ event: subscriptionType, status: 'error', error: err.message });
    }

    // Rate limit between events
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('[WEBHOOK] ===== Done. Results:', JSON.stringify(results));
  return { success: true, processed: results.length, results };
}

/* ============================================
   Meeting Event Handlers
   ============================================ */

async function handleMeetingBooked(event, env) {
  const contactId = String(event.objectId);
  const meetingId = event.propertyValue || contactId;
  const referenceKey = `meeting-${meetingId}`;

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
   Deal Stage Change Handler (Post-Meeting)
   Triggers follow-up email when deal stage
   changes to a post-meeting stage
   ============================================ */

// Deal stages that trigger a follow-up email
const DEAL_EMAIL_STAGES = [
  'appointmentscheduled',    // Consultation confirmed — meeting prep tips
  'qualifiedtobuy',          // New lead — welcome + intro to services
  'presentationscheduled',   // Meeting completed — thank you + proposal prep
  'decisionmakerboughtin',   // Proposal sent — review + stakeholder sharing
  'contractsent',            // Negotiation — contract review next steps
  'closedwon',               // Won — welcome aboard + onboarding kickoff
  'closedlost',              // Lost — graceful exit + door open
];

async function handleDealStageChange(event, env) {
  const dealId = String(event.objectId);
  const newStage = event.propertyValue;
  const previousStage = event.previousPropertyValue || '';

  console.log(`[DEAL] Deal ${dealId}: "${previousStage}" → "${newStage}"`);

  // Fetch deal to check which pipeline it belongs to
  const { getContactForDeal, getDealById } = await import('../services/hubspot.js');

  console.log(`[DEAL] Fetching deal ${dealId} from HubSpot...`);
  const deal = await getDealById(dealId, env);
  if (!deal) {
    console.error(`[DEAL] Deal ${dealId} NOT found in HubSpot`);
    return { event: 'deal-stage-change', dealId, status: 'skipped', reason: 'Deal not found' };
  }
  console.log(`[DEAL] Deal found: "${deal.properties?.dealname}" (pipeline: ${deal.properties?.pipeline})`);

  // Route to hiring handler if this is the hiring pipeline
  const pipeline = deal.properties?.pipeline;
  if (String(pipeline) === HIRING_PIPELINE_ID) {
    return handleHiringStageChange(dealId, newStage, deal, env);
  }

  // --- Sales Pipeline Logic (unchanged) ---

  // Only send follow-up for qualifying post-meeting stages
  if (!DEAL_EMAIL_STAGES.includes(newStage)) {
    console.log(`[DEAL] Stage "${newStage}" is NOT in DEAL_EMAIL_STAGES — skipping`);
    return { event: 'deal-stage-change', dealId, stage: newStage, status: 'skipped', reason: 'Stage not a post-meeting trigger' };
  }

  console.log(`[DEAL] Stage "${newStage}" IS a trigger — proceeding`);

  // Dedup — don't re-send for the same deal + stage combination
  const referenceKey = `post-meeting-${dealId}-${newStage}`;

  try {
    console.log(`[DEAL] Fetching associated contact for deal ${dealId}...`);
    const contact = await getContactForDeal(dealId, env);
    if (!contact || !contact.properties?.email) {
      console.error(`[DEAL] No associated contact with email for deal ${dealId}`);
      return { event: 'deal-stage-change', dealId, status: 'skipped', reason: 'No associated contact with email' };
    }

    const email = contact.properties.email;
    const firstName = contact.properties.firstname || 'there';
    const companyName = contact.properties.company || deal.properties?.dealname || '';

    console.log(`[DEAL] Contact: ${firstName} <${email}> (${companyName})`);

    // Dedup check
    const alreadySent = await hasSentEmail(email, 'post-meeting', referenceKey, env);
    if (alreadySent) {
      console.log(`[DEAL] Dedup: already sent for ref="${referenceKey}" — skipping`);
      return { event: 'deal-stage-change', dealId, status: 'skipped', reason: 'Already sent for this stage' };
    }
    console.log(`[DEAL] Dedup clear — sending post-meeting email...`);

    // Get meeting summary from deal description if available
    const meetingSummary = deal.properties?.description || '';

    // Send post-meeting follow-up email
    const result = await sendPostMeetingEmail({
      email,
      firstName,
      companyName,
      dealStage: newStage,
      meetingSummary,
    }, env);

    console.log(`[DEAL] Send result:`, JSON.stringify(result));

    if (result?.status === 'sent') {
      await recordSentEmail(email, 'post-meeting', referenceKey, env);
      console.log(`[DEAL] Email sent and recorded for ${email}`);
    }

    return { event: 'deal-stage-change', dealId, email, stage: newStage, ...result };
  } catch (err) {
    console.error(`[DEAL] Error for deal ${dealId}:`, err);
    return { event: 'deal-stage-change', dealId, status: 'error', error: err.message };
  }
}

/* ============================================
   Hiring Pipeline Stage Change Handler
   Triggers candidate emails when a deal in the
   Hiring Pipeline changes stage in HubSpot
   ============================================ */

async function handleHiringStageChange(dealId, newStage, deal, env) {
  const stageKey = HIRING_STAGE_MAP[String(newStage)] || null;
  console.log(`[HIRING] Deal ${dealId} stage → "${newStage}" (key: ${stageKey})`);

  if (!stageKey) {
    console.log(`[HIRING] Stage "${newStage}" not in HIRING_STAGE_MAP — skipping`);
    return { event: 'hiring-stage-change', dealId, stage: newStage, status: 'skipped', reason: 'Unknown hiring stage' };
  }

  const referenceKey = `hiring-${dealId}-${newStage}`;

  try {
    const { getContactForDeal } = await import('../services/hubspot.js');
    const contact = await getContactForDeal(dealId, env);

    if (!contact || !contact.properties?.email) {
      console.error(`[HIRING] No associated contact with email for deal ${dealId}`);
      return { event: 'hiring-stage-change', dealId, status: 'skipped', reason: 'No associated contact with email' };
    }

    const email = contact.properties.email;
    const firstName = contact.properties.firstname || 'there';
    const dealName = deal.properties?.dealname || '';

    // Extract position name from deal name (format: "FirstName LastName — Position")
    const positionMatch = dealName.match(/—\s*(.+)$/);
    const positionName = positionMatch ? positionMatch[1].trim() : '';

    console.log(`[HIRING] Candidate: ${firstName} <${email}> for "${positionName}"`);

    // Dedup check
    const alreadySent = await hasSentEmail(email, 'hiring-stage', referenceKey, env);
    if (alreadySent) {
      console.log(`[HIRING] Dedup: already sent for ref="${referenceKey}" — skipping`);
      return { event: 'hiring-stage-change', dealId, status: 'skipped', reason: 'Already sent for this stage' };
    }

    // Send hiring stage email
    const result = await sendHiringStageEmail({
      email,
      firstName,
      positionName,
      hiringStage: stageKey,
    }, env);

    console.log(`[HIRING] Send result:`, JSON.stringify(result));

    if (result?.status === 'sent') {
      await recordSentEmail(email, 'hiring-stage', referenceKey, env);
      console.log(`[HIRING] Email sent and recorded for ${email}`);
    }

    return { event: 'hiring-stage-change', dealId, email, stage: stageKey, ...result };
  } catch (err) {
    console.error(`[HIRING] Error for deal ${dealId}:`, err);
    return { event: 'hiring-stage-change', dealId, status: 'error', error: err.message };
  }
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

