/* ============================================
   Resend Email Service
   - Score-tiered assessment drip sequences
   - Contact form confirmation + nurture
   - Re-engagement emails
   ============================================ */

// Yellow tier (existing emails — scores 31-60)
import { buildScoreEmail } from '../templates/email1-score.js';
import { buildMistakesEmail } from '../templates/email2-mistakes.js';
import { buildCaseStudyEmail } from '../templates/email3-casestudy.js';
import { buildOfferEmail } from '../templates/email4-offer.js';

// Red tier (scores 0-30)
import { buildRedUrgentEmail } from '../templates/email-red-urgent.js';
import { buildRedActionEmail } from '../templates/email-red-action.js';
import { buildRedOfferEmail } from '../templates/email-red-offer.js';

// Green tier (scores 61-100)
import { buildGreenPartnershipEmail } from '../templates/email-green-partnership.js';
import { buildGreenAdvancedEmail } from '../templates/email-green-advanced.js';

// Contact form emails
import { buildContactConfirmationEmail } from '../templates/email-contact-confirmation.js';
import { buildContactNurture2Email } from '../templates/email-contact-nurture2.js';
import { buildContactNurture3Email } from '../templates/email-contact-nurture3.js';
import { buildContactNurture4Email } from '../templates/email-contact-nurture4.js';

// Meeting emails
import { buildMeetingBookedEmail } from '../templates/email-meeting-booked.js';
import { buildNoShowEmail } from '../templates/email-no-show.js';
import { buildPostMeetingEmail } from '../templates/email-post-meeting.js';

import { generateUnsubToken, buildUnsubUrl } from '../utils/unsubscribe.js';
import { isUnsubscribed, hasSentEmail, recordSentEmail } from '../db/queries.js';

const RESEND_API = 'https://api.resend.com/emails';

function getFromAddress(env) {
  const name = env.FROM_NAME || 'ApexStack Cloud';
  const email = env.FROM_EMAIL || 'hello@apexstackcloud.com';
  return `${name} <${email}>`;
}

async function sendEmail(payload, apiKey) {
  const response = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(data)}`);
  }

  return data;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// Delay helper to respect Resend's 2 req/sec rate limit
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate unsubscribe URL with HMAC token
async function getUnsubInfo(email, env) {
  let unsubUrl = '';
  let unsubHeaders = {};
  try {
    const secret = env.UNSUB_SECRET || 'default-unsub-secret';
    const token = await generateUnsubToken(email, secret);
    unsubUrl = buildUnsubUrl(email, token);
    unsubHeaders = {
      'List-Unsubscribe': `<${unsubUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    };
  } catch (err) {
    console.error('Unsub token generation error:', err);
  }
  return { unsubUrl, unsubHeaders };
}

/* ============================================
   Assessment Email Sequences (Feature 2)
   Tiered by score: Red (0-30), Yellow (31-60),
   Green (61-100)
   ============================================ */

export async function sendAssessmentEmails(leadData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  const now = new Date();

  const { name, email, score, level, categoryScores, categoryPct, risks, recs } = leadData;
  const firstName = name.split(' ')[0];

  // Check if this email has unsubscribed
  const unsubbed = await isUnsubscribed(email, env);
  if (unsubbed) {
    return [{ email: 'all', status: 'skipped', reason: 'User unsubscribed' }];
  }

  const { unsubUrl, unsubHeaders } = await getUnsubInfo(email, env);

  // Email 1 is always the score email (all tiers)
  const results = [];

  try {
    const email1 = await sendEmail({
      from: fromEmail,
      to: [email],
      subject: `Your Cloud Readiness Score: ${score}/100`,
      html: buildScoreEmail({ name, firstName, score, level, categoryPct, risks, recs, unsubUrl }),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 1, status: 'sent', id: email1.id, tier: getTier(score) });
  } catch (err) {
    console.error('Email 1 error:', err);
    results.push({ email: 1, status: 'failed', error: err.message });
  }

  await delay(600);

  // Branch based on score tier
  if (score <= 30) {
    // RED TIER: Day 0, Day 1, Day 3, Day 7, Day 14
    await sendTieredEmails(results, fromEmail, email, apiKey, unsubHeaders, now, [
      { day: 1, subject: `${firstName}, your infrastructure is at critical risk`, html: buildRedUrgentEmail({ name, firstName, score, risks, unsubUrl }) },
      { day: 3, subject: `${firstName}, 3 things to fix this week`, html: buildRedActionEmail({ name, firstName, unsubUrl }) },
      { day: 7, subject: 'How a Series B fintech cut cloud costs 47% in 90 days', html: buildCaseStudyEmail({ name, firstName, unsubUrl }) },
      { day: 14, subject: `${firstName}, exclusive: emergency cloud audit — 50% off`, html: buildRedOfferEmail({ name, firstName, unsubUrl }) },
    ]);
  } else if (score <= 60) {
    // YELLOW TIER: Day 0, Day 2, Day 5, Day 10 (existing flow)
    await sendTieredEmails(results, fromEmail, email, apiKey, unsubHeaders, now, [
      { day: 2, subject: `${firstName}, 3 cloud mistakes that cost fintech startups millions`, html: buildMistakesEmail({ name, firstName, unsubUrl }) },
      { day: 5, subject: 'How a Series B fintech cut cloud costs 47% in 90 days', html: buildCaseStudyEmail({ name, firstName, unsubUrl }) },
      { day: 10, subject: `${firstName}, claim your free cloud architecture review`, html: buildOfferEmail({ name, firstName, unsubUrl }) },
    ]);
  } else {
    // GREEN TIER: Day 0, Day 3, Day 7
    await sendTieredEmails(results, fromEmail, email, apiKey, unsubHeaders, now, [
      { day: 3, subject: `${firstName}, you're ahead of 90% of companies`, html: buildGreenPartnershipEmail({ name, firstName, score, unsubUrl }) },
      { day: 7, subject: `Next-level: chaos engineering & FinOps`, html: buildGreenAdvancedEmail({ name, firstName, unsubUrl }) },
    ]);
  }

  return results;
}

function getTier(score) {
  if (score <= 30) return 'red';
  if (score <= 60) return 'yellow';
  return 'green';
}

async function sendTieredEmails(results, fromEmail, toEmail, apiKey, unsubHeaders, now, emailDefs) {
  for (let i = 0; i < emailDefs.length; i++) {
    await delay(600);
    const def = emailDefs[i];
    try {
      const res = await sendEmail({
        from: fromEmail,
        to: [toEmail],
        subject: def.subject,
        html: def.html,
        scheduled_at: addDays(now, def.day),
        headers: unsubHeaders,
      }, apiKey);
      results.push({ email: i + 2, status: 'scheduled', id: res.id, send_at: addDays(now, def.day) });
    } catch (err) {
      console.error(`Tiered email ${i + 2} (day ${def.day}) error:`, err);
      results.push({ email: i + 2, status: 'failed', error: err.message });
    }
  }
}

/* ============================================
   Contact Form Email Functions
   ============================================ */

export async function sendContactConfirmation(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);

  if (!apiKey) {
    console.warn('Resend: No API key configured, skipping contact confirmation');
    return { skipped: true, reason: 'No RESEND_API_KEY configured' };
  }

  return sendEmail({
    from: fromEmail,
    to: [contactData.email],
    subject: `Thanks for reaching out, ${contactData.firstName}!`,
    html: buildContactConfirmationEmail(contactData),
  }, apiKey);
}

/* ============================================
   Contact Nurture Sequence (Feature 3)
   Day 2: Assessment CTA
   Day 5: Case study
   ============================================ */

export async function sendContactNurtureEmails(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  const now = new Date();

  if (!apiKey) return [];

  // Check unsubscribe
  const unsubbed = await isUnsubscribed(contactData.email, env);
  if (unsubbed) {
    return [{ email: 'all', status: 'skipped', reason: 'User unsubscribed' }];
  }

  const { unsubUrl, unsubHeaders } = await getUnsubInfo(contactData.email, env);
  const results = [];

  // Nurture Email 2: Day 2 — Assessment CTA
  try {
    const n2 = await sendEmail({
      from: fromEmail,
      to: [contactData.email],
      subject: `${contactData.firstName}, get your free Cloud Readiness Score`,
      html: buildContactNurture2Email({ firstName: contactData.firstName, unsubUrl }),
      scheduled_at: addDays(now, 2),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 'nurture-2', status: 'scheduled', id: n2.id, send_at: addDays(now, 2) });
  } catch (err) {
    console.error('Contact nurture 2 error:', err);
    results.push({ email: 'nurture-2', status: 'failed', error: err.message });
  }

  await delay(600);

  // Nurture Email 3: Day 5 — Case study
  try {
    const n3 = await sendEmail({
      from: fromEmail,
      to: [contactData.email],
      subject: `How a fintech transformed their cloud in 90 days`,
      html: buildContactNurture3Email({ firstName: contactData.firstName, unsubUrl }),
      scheduled_at: addDays(now, 5),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 'nurture-3', status: 'scheduled', id: n3.id, send_at: addDays(now, 5) });
  } catch (err) {
    console.error('Contact nurture 3 error:', err);
    results.push({ email: 'nurture-3', status: 'failed', error: err.message });
  }

  await delay(600);

  // Nurture Email 4: Day 10 — Industry trends + soft CTA (Feature 6)
  try {
    const n4 = await sendEmail({
      from: fromEmail,
      to: [contactData.email],
      subject: `${contactData.firstName}, what companies like yours are doing with cloud`,
      html: buildContactNurture4Email({ firstName: contactData.firstName, unsubUrl }),
      scheduled_at: addDays(now, 10),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 'nurture-4', status: 'scheduled', id: n4.id, send_at: addDays(now, 10) });
  } catch (err) {
    console.error('Contact nurture 4 error:', err);
    results.push({ email: 'nurture-4', status: 'failed', error: err.message });
  }

  return results;
}

export async function forwardContactToTeam(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  const recipient = env.RECIPIENT_EMAIL || 'info@apexstackcloud.com';

  if (!apiKey) {
    console.warn('Resend: No API key configured, skipping forward');
    return { skipped: true, reason: 'No RESEND_API_KEY configured' };
  }

  const serviceLabels = {
    'cloud-strategy': 'Cloud Strategy',
    'migration': 'Migration & Foundation',
    'modernization': 'Innovation & Modernization',
    'managed': 'Managed Services',
    'other': 'Other',
  };

  const serviceLabel = serviceLabels[contactData.serviceInterest] || contactData.serviceInterest || 'Not specified';

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; padding: 24px;">
      <h2 style="color: #111;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px 0; font-weight: 600; color: #555;">Name</td><td style="padding: 8px 0;">${contactData.firstName} ${contactData.lastName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${contactData.email}">${contactData.email}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600; color: #555;">Phone</td><td style="padding: 8px 0;">${contactData.phone ? `<a href="tel:${contactData.phone}">${contactData.phone}</a>` : '—'}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600; color: #555;">Company</td><td style="padding: 8px 0;">${contactData.company || '—'}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600; color: #555;">Service Interest</td><td style="padding: 8px 0;">${serviceLabel}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600; color: #555;">Message</td><td style="padding: 8px 0;">${contactData.message || '—'}</td></tr>
      </table>
      <p style="color: #888; font-size: 12px;">Submitted at ${contactData.submittedAt}</p>
    </div>
  `;

  return sendEmail({
    from: fromEmail,
    to: [recipient],
    subject: `New Contact: ${contactData.firstName} ${contactData.lastName} — ${contactData.company || 'No company'}`,
    html: html,
  }, apiKey);
}

/* ============================================
   Re-engagement Emails (Feature 7)
   Called from cron handler
   ============================================ */

export async function sendReengagementEmail(leadData, type, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);

  if (!apiKey) return null;

  const unsubbed = await isUnsubscribed(leadData.email, env);
  if (unsubbed) return { status: 'skipped', reason: 'unsubscribed' };

  const { unsubUrl, unsubHeaders } = await getUnsubInfo(leadData.email, env);
  const firstName = leadData.name.split(' ')[0];

  let subject, html;

  if (type === 'cold') {
    subject = `${firstName}, your free cloud review is still available`;
    html = buildColdReengagementHtml(firstName, unsubUrl);
  } else {
    subject = `${firstName}, still thinking about your cloud strategy?`;
    html = buildWarmReengagementHtml(firstName, leadData.score, unsubUrl);
  }

  try {
    const res = await sendEmail({
      from: fromEmail,
      to: [leadData.email],
      subject,
      html,
      headers: unsubHeaders,
    }, apiKey);
    return { status: 'sent', id: res.id, type };
  } catch (err) {
    console.error(`Re-engagement (${type}) error:`, err);
    return { status: 'failed', error: err.message };
  }
}

function buildColdReengagementHtml(firstName, unsubUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%;">
        <tr><td style="padding-bottom: 32px;"><table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="background: #b8e600; color: #000000; font-weight: 800; font-size: 16px; width: 32px; height: 32px; text-align: center; line-height: 32px; border-radius: 6px;">A</td><td style="padding-left: 10px; color: #ffffff; font-size: 18px; font-weight: 700;">ApexStack Cloud</td></tr></table></td></tr>
        <tr><td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">${firstName}, we haven't heard from you</td></tr>
        <tr><td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">A month ago you took our Cloud Readiness Assessment. Since then, the cloud landscape has continued to evolve &mdash; new security threats, cost optimization strategies, and compliance requirements.</td></tr>
        <tr><td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">Your <strong style="color: #ffffff;">free cloud architecture review</strong> is still available. Our senior engineers have helped dozens of teams transform their infrastructure in just weeks. No sales pitch &mdash; just a clear action plan.</td></tr>
        <tr><td style="padding-bottom: 40px;"><table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="background: #b8e600; border-radius: 8px;"><a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none;">Book Your Free Review</a></td></tr></table></td></tr>
        <tr><td style="border-top: 1px solid #222222; padding-top: 24px;"><p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">ApexStack Cloud Technologies Limited<br><a href="${unsubUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a></p></td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildWarmReengagementHtml(firstName, score, unsubUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%;">
        <tr><td style="padding-bottom: 32px;"><table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="background: #b8e600; color: #000000; font-weight: 800; font-size: 16px; width: 32px; height: 32px; text-align: center; line-height: 32px; border-radius: 6px;">A</td><td style="padding-left: 10px; color: #ffffff; font-size: 18px; font-weight: 700;">ApexStack Cloud</td></tr></table></td></tr>
        <tr><td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">Still thinking about your cloud strategy?</td></tr>
        <tr><td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">Hi ${firstName}, we noticed you've been reviewing our content. ${score ? `With your Cloud Readiness Score of <strong style="color: #ffffff;">${score}/100</strong>, there` : 'There'} are specific improvements we can help you prioritize.</td></tr>
        <tr><td style="padding-bottom: 24px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;"><tr><td style="padding: 24px;">
          <p style="color: #ffffff; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">In a 30-minute call, we can:</p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.8; margin: 0;">&bull; Walk through your specific results<br>&bull; Identify your highest-ROI improvements<br>&bull; Build a 90-day action plan<br>&bull; Answer any cloud infrastructure questions</p>
        </td></tr></table></td></tr>
        <tr><td style="padding-bottom: 40px;"><table cellpadding="0" cellspacing="0" role="presentation"><tr><td style="background: #b8e600; border-radius: 8px;"><a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none;">Book a Strategy Session</a></td></tr></table></td></tr>
        <tr><td style="border-top: 1px solid #222222; padding-top: 24px;"><p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">ApexStack Cloud Technologies Limited<br><a href="${unsubUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a></p></td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ============================================
   Meeting Follow-up Emails (Features 1, 2)
   ============================================ */

export async function sendMeetingBookedEmail(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  if (!apiKey) return null;

  const unsubbed = await isUnsubscribed(contactData.email, env);
  if (unsubbed) return { status: 'skipped', reason: 'unsubscribed' };

  const { unsubUrl, unsubHeaders } = await getUnsubInfo(contactData.email, env);

  try {
    const res = await sendEmail({
      from: fromEmail,
      to: [contactData.email],
      subject: `Looking forward to our call, ${contactData.firstName}!`,
      html: buildMeetingBookedEmail({ firstName: contactData.firstName, meetingDate: contactData.meetingDate, unsubUrl }),
      headers: unsubHeaders,
    }, apiKey);
    return { status: 'sent', id: res.id };
  } catch (err) {
    console.error('Meeting booked email error:', err);
    return { status: 'failed', error: err.message };
  }
}

export async function sendNoShowEmail(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  if (!apiKey) return null;

  const unsubbed = await isUnsubscribed(contactData.email, env);
  if (unsubbed) return { status: 'skipped', reason: 'unsubscribed' };

  const { unsubUrl, unsubHeaders } = await getUnsubInfo(contactData.email, env);

  try {
    const res = await sendEmail({
      from: fromEmail,
      to: [contactData.email],
      subject: `We missed you, ${contactData.firstName} — let's reschedule`,
      html: buildNoShowEmail({ firstName: contactData.firstName, rescheduleLink: contactData.rescheduleLink || 'http://meeting.apexstackcloud.com/meetings/apexstack', unsubUrl }),
      headers: unsubHeaders,
    }, apiKey);
    return { status: 'sent', id: res.id };
  } catch (err) {
    console.error('No-show email error:', err);
    return { status: 'failed', error: err.message };
  }
}

/* ============================================
   Post-Meeting Follow-Up Email (Feature 12)
   Triggered by deal stage changes in HubSpot
   ============================================ */

export async function sendPostMeetingEmail(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  if (!apiKey) return null;

  const unsubbed = await isUnsubscribed(contactData.email, env);
  if (unsubbed) return { status: 'skipped', reason: 'unsubscribed' };

  const { unsubUrl, unsubHeaders } = await getUnsubInfo(contactData.email, env);

  try {
    const res = await sendEmail({
      from: fromEmail,
      to: [contactData.email],
      subject: `Great connecting with you, ${contactData.firstName}!`,
      html: buildPostMeetingEmail({
        firstName: contactData.firstName,
        companyName: contactData.companyName || '',
        dealStage: contactData.dealStage || 'default',
        meetingSummary: contactData.meetingSummary || '',
        unsubUrl,
      }),
      headers: unsubHeaders,
    }, apiKey);
    return { status: 'sent', id: res.id };
  } catch (err) {
    console.error('Post-meeting email error:', err);
    return { status: 'failed', error: err.message };
  }
}

/* ============================================
   Bulk Email Sender (for cron broadcasts)
   Handles dedup, unsubscribe checks, rate
   limiting, and sent_emails tracking
   ============================================ */

export async function sendBulkEmails(recipients, buildEmailFn, emailType, referenceKey, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = getFromAddress(env);
  if (!apiKey) return { sent: 0, skipped: 0, failed: 0, reason: 'No API key' };

  let sent = 0, skipped = 0, failed = 0;

  for (const recipient of recipients) {
    const firstName = (recipient.name || '').split(' ')[0] || 'there';

    // Check unsubscribe
    const unsubbed = await isUnsubscribed(recipient.email, env);
    if (unsubbed) { skipped++; continue; }

    // Check dedup
    const alreadySent = await hasSentEmail(recipient.email, emailType, referenceKey, env);
    if (alreadySent) { skipped++; continue; }

    // Build unsub info
    const { unsubUrl, unsubHeaders } = await getUnsubInfo(recipient.email, env);

    // Build email content
    const emailContent = buildEmailFn({ ...recipient, firstName, unsubUrl });

    try {
      await sendEmail({
        from: fromEmail,
        to: [recipient.email],
        subject: emailContent.subject,
        html: emailContent.html,
        headers: unsubHeaders,
      }, apiKey);

      await recordSentEmail(recipient.email, emailType, referenceKey, env);
      sent++;
    } catch (err) {
      console.error(`Bulk email error (${emailType}) for ${recipient.email}:`, err);
      failed++;
    }

    // Rate limit
    await delay(600);
  }

  return { sent, skipped, failed };
}
