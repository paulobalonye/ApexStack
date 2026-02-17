/* ============================================
   Assessment Handler
   Orchestrates: Resend emails, HubSpot CRM,
   Web3Forms notification, D1 database
   ============================================ */

import { sendAssessmentEmails } from '../services/resend.js';
import { createHubSpotContact } from '../services/hubspot.js';
import { forwardToWeb3Forms } from '../services/web3forms.js';
import { insertLead } from '../db/queries.js';

export async function handleAssessment(body, env, ctx) {
  // Validate required fields
  const { name, email, company, role, score, level, categoryScores, categoryPct, risks, recs, answers } = body;

  if (!name || !email || !company || !role || score === undefined) {
    return { success: false, error: 'Missing required fields: name, email, company, role, score' };
  }

  const leadData = {
    name,
    email,
    company,
    role,
    score,
    level: level || 'Unknown',
    categoryScores: categoryScores || {},
    categoryPct: categoryPct || {},
    risks: risks || [],
    recs: recs || [],
    answers: answers || '',
    submittedAt: new Date().toISOString(),
  };

  // Fan out to all services concurrently
  // Use ctx.waitUntil for non-blocking background tasks
  const results = {
    resend: null,
    hubspot: null,
    web3forms: null,
    database: null,
  };

  // 1. Send Resend emails (immediate + scheduled drip)
  const resendPromise = sendAssessmentEmails(leadData, env)
    .then(res => { results.resend = { success: true, data: res }; })
    .catch(err => {
      console.error('Resend error:', err);
      results.resend = { success: false, error: err.message };
    });

  // 2. Create HubSpot contact
  const hubspotPromise = createHubSpotContact(leadData, env)
    .then(res => { results.hubspot = { success: true, data: res }; })
    .catch(err => {
      console.error('HubSpot error:', err);
      results.hubspot = { success: false, error: err.message };
    });

  // 3. Forward to Web3Forms (preserves existing internal notification)
  const web3formsPromise = forwardToWeb3Forms(leadData, env)
    .then(res => { results.web3forms = { success: true, data: res }; })
    .catch(err => {
      console.error('Web3Forms error:', err);
      results.web3forms = { success: false, error: err.message };
    });

  // 4. Store in D1 database
  const dbPromise = insertLead(leadData, env)
    .then(res => { results.database = { success: true }; })
    .catch(err => {
      console.error('D1 error:', err);
      results.database = { success: false, error: err.message };
    });

  // Wait for all services to complete
  await Promise.all([resendPromise, hubspotPromise, web3formsPromise, dbPromise]);

  // Return success if at least Resend worked (primary goal is sending the lead their report)
  const overallSuccess = results.resend?.success || false;

  return {
    success: overallSuccess,
    message: overallSuccess
      ? 'Assessment processed successfully. Check your email for your report!'
      : 'We received your assessment but had trouble sending the email. Our team will follow up shortly.',
    services: results,
  };
}
