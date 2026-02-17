/* ============================================
   Resend Email Service
   Sends immediate score email + 3 scheduled
   drip emails using Resend's scheduled_at param
   Also handles contact form emails
   ============================================ */

import { buildScoreEmail } from '../templates/email1-score.js';
import { buildMistakesEmail } from '../templates/email2-mistakes.js';
import { buildCaseStudyEmail } from '../templates/email3-casestudy.js';
import { buildOfferEmail } from '../templates/email4-offer.js';
import { buildContactConfirmationEmail } from '../templates/email-contact-confirmation.js';
import { generateUnsubToken, buildUnsubUrl } from '../utils/unsubscribe.js';
import { isUnsubscribed } from '../db/queries.js';

const RESEND_API = 'https://api.resend.com/emails';

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

export async function sendAssessmentEmails(leadData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.FROM_EMAIL || 'ApexStack Cloud <hello@apexstackcloud.com>';
  const now = new Date();

  const { name, email, score, level, categoryScores, categoryPct, risks, recs } = leadData;
  const firstName = name.split(' ')[0];

  // Check if this email has unsubscribed
  const unsubbed = await isUnsubscribed(email, env);
  if (unsubbed) {
    return [{ email: 'all', status: 'skipped', reason: 'User unsubscribed' }];
  }

  // Generate unsubscribe token and URL
  let unsubUrl = '';
  try {
    const secret = env.UNSUB_SECRET || 'default-unsub-secret';
    const token = await generateUnsubToken(email, secret);
    unsubUrl = buildUnsubUrl(email, token);
  } catch (err) {
    console.error('Unsub token generation error:', err);
  }

  const unsubHeaders = unsubUrl ? {
    'List-Unsubscribe': `<${unsubUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  } : {};

  const results = [];

  // Email 1: Immediate — Your Cloud Readiness Score
  try {
    const email1 = await sendEmail({
      from: fromEmail,
      to: [email],
      subject: `Your Cloud Readiness Score: ${score}/100`,
      html: buildScoreEmail({ name, firstName, score, level, categoryPct, risks, recs, unsubUrl }),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 1, status: 'sent', id: email1.id });
  } catch (err) {
    console.error('Email 1 error:', err);
    results.push({ email: 1, status: 'failed', error: err.message });
  }

  // Wait 600ms between sends to respect Resend's 2 req/sec rate limit
  await delay(600);

  // Email 2: Day 2 — 3 Cloud Mistakes
  try {
    const email2 = await sendEmail({
      from: fromEmail,
      to: [email],
      subject: `${firstName}, 3 cloud mistakes that cost fintech startups millions`,
      html: buildMistakesEmail({ name, firstName, unsubUrl }),
      scheduled_at: addDays(now, 2),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 2, status: 'scheduled', id: email2.id, send_at: addDays(now, 2) });
  } catch (err) {
    console.error('Email 2 error:', err);
    results.push({ email: 2, status: 'failed', error: err.message });
  }

  await delay(600);

  // Email 3: Day 5 — Case Study
  try {
    const email3 = await sendEmail({
      from: fromEmail,
      to: [email],
      subject: 'How a Series B fintech cut cloud costs 47% in 90 days',
      html: buildCaseStudyEmail({ name, firstName, unsubUrl }),
      scheduled_at: addDays(now, 5),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 3, status: 'scheduled', id: email3.id, send_at: addDays(now, 5) });
  } catch (err) {
    console.error('Email 3 error:', err);
    results.push({ email: 3, status: 'failed', error: err.message });
  }

  await delay(600);

  // Email 4: Day 10 — Free Architecture Review
  try {
    const email4 = await sendEmail({
      from: fromEmail,
      to: [email],
      subject: `${firstName}, claim your free cloud architecture review`,
      html: buildOfferEmail({ name, firstName, unsubUrl }),
      scheduled_at: addDays(now, 10),
      headers: unsubHeaders,
    }, apiKey);
    results.push({ email: 4, status: 'scheduled', id: email4.id, send_at: addDays(now, 10) });
  } catch (err) {
    console.error('Email 4 error:', err);
    results.push({ email: 4, status: 'failed', error: err.message });
  }

  return results;
}

/* ============================================
   Contact Form Email Functions
   ============================================ */

export async function sendContactConfirmation(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.FROM_EMAIL || 'ApexStack Cloud <hello@apexstackcloud.com>';

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

export async function forwardContactToTeam(contactData, env) {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.FROM_EMAIL || 'ApexStack Cloud <hello@apexstackcloud.com>';
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
