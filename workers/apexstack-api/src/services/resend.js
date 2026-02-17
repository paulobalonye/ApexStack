/* ============================================
   Resend Email Service
   Sends immediate score email + 3 scheduled
   drip emails using Resend's scheduled_at param
   ============================================ */

import { buildScoreEmail } from '../templates/email1-score.js';
import { buildMistakesEmail } from '../templates/email2-mistakes.js';
import { buildCaseStudyEmail } from '../templates/email3-casestudy.js';
import { buildOfferEmail } from '../templates/email4-offer.js';

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

  const results = [];

  // Email 1: Immediate — Your Cloud Readiness Score
  try {
    const email1 = await sendEmail({
      from: fromEmail,
      to: [email],
      subject: `Your Cloud Readiness Score: ${score}/100`,
      html: buildScoreEmail({ name, firstName, score, level, categoryPct, risks, recs }),
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
      html: buildMistakesEmail({ name, firstName }),
      scheduled_at: addDays(now, 2),
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
      html: buildCaseStudyEmail({ name, firstName }),
      scheduled_at: addDays(now, 5),
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
      html: buildOfferEmail({ name, firstName }),
      scheduled_at: addDays(now, 10),
    }, apiKey);
    results.push({ email: 4, status: 'scheduled', id: email4.id, send_at: addDays(now, 10) });
  } catch (err) {
    console.error('Email 4 error:', err);
    results.push({ email: 4, status: 'failed', error: err.message });
  }

  return results;
}
