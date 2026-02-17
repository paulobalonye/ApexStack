/* ============================================
   Assessment Handler
   Orchestrates: Resend emails, HubSpot CRM +
   Deal pipeline, D1 database
   ============================================ */

import { sendAssessmentEmails } from '../services/resend.js';
import { createHubSpotContact, createHubSpotDeal } from '../services/hubspot.js';
import { insertLead } from '../db/queries.js';

export async function handleAssessment(body, env, ctx) {
  // Validate required fields
  const { name, email, company, phone, role, score, level, categoryScores, categoryPct, risks, recs, answers } = body;

  if (!name || !email || !company || !role || score === undefined) {
    return { success: false, error: 'Missing required fields: name, email, company, role, score' };
  }

  const leadData = {
    name,
    email,
    company,
    phone: phone || '',
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

  const results = {
    resend: null,
    hubspot: null,
    database: null,
  };

  // 1. Send Resend emails (immediate + scheduled drip)
  const resendPromise = sendAssessmentEmails(leadData, env)
    .then(res => { results.resend = { success: true, data: res }; })
    .catch(err => {
      console.error('Resend error:', err);
      results.resend = { success: false, error: err.message };
    });

  // 2. Create HubSpot contact + Deal
  const hubspotPromise = createHubSpotContact(leadData, env)
    .then(async (res) => {
      results.hubspot = { success: true, data: res };
      // Create deal if contact was created/updated successfully
      if (res.contactId) {
        try {
          const deal = await createHubSpotDeal(leadData, res.contactId, env);
          results.hubspot.deal = deal;
        } catch (dealErr) {
          console.error('HubSpot deal error:', dealErr);
          results.hubspot.deal = { success: false, error: dealErr.message };
        }
      }
    })
    .catch(err => {
      console.error('HubSpot error:', err);
      results.hubspot = { success: false, error: err.message };
    });

  // 3. Store in D1 database
  const dbPromise = insertLead(leadData, env)
    .then(res => { results.database = { success: true }; })
    .catch(err => {
      console.error('D1 error:', err);
      results.database = { success: false, error: err.message };
    });

  // Wait for all services to complete
  await Promise.all([resendPromise, hubspotPromise, dbPromise]);

  // Return success if at least Resend worked
  const overallSuccess = results.resend?.success || false;

  return {
    success: overallSuccess,
    message: overallSuccess
      ? 'Assessment processed successfully. Check your email for your report!'
      : 'We received your assessment but had trouble sending the email. Our team will follow up shortly.',
    services: results,
  };
}
