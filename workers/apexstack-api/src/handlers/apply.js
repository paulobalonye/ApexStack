/* ============================================
   Job Application Handler
   Orchestrates: Resend confirmation + team forward,
   HubSpot contact + hiring deal, D1 database
   ============================================ */

import { sendApplicationConfirmation, forwardApplicationToTeam } from '../services/resend.js';
import { createHubSpotContact, createHiringDeal } from '../services/hubspot.js';
import { insertJobApplication, updateApplicationServiceStatuses } from '../db/queries.js';

export async function handleJobApplication(body, env) {
  const { firstName, lastName, email, phone, position, linkedinUrl, portfolioUrl, coverLetter } = body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !position) {
    return { success: false, error: 'Missing required fields: firstName, lastName, email, phone, position' };
  }

  const applicationData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || '').trim(),
    position: position,
    linkedinUrl: (linkedinUrl || '').trim(),
    portfolioUrl: (portfolioUrl || '').trim(),
    coverLetter: (coverLetter || '').trim(),
    submittedAt: new Date().toISOString(),
  };

  const results = {
    confirmation: null,
    forward: null,
    hubspot: null,
    deal: null,
    database: null,
  };

  // Send confirmation email to applicant
  const confirmationPromise = sendApplicationConfirmation(applicationData, env)
    .then(res => { results.confirmation = { success: true }; })
    .catch(err => {
      console.error('Application confirmation email error:', err);
      results.confirmation = { success: false, error: err.message };
    });

  // Forward application to hiring team
  const forwardPromise = forwardApplicationToTeam(applicationData, env)
    .then(res => { results.forward = { success: true }; })
    .catch(err => {
      console.error('Application forward email error:', err);
      results.forward = { success: false, error: err.message };
    });

  // HubSpot contact + hiring deal
  const hubspotPromise = createHubSpotContact({
    name: `${applicationData.firstName} ${applicationData.lastName}`,
    email: applicationData.email,
    company: '',
    phone: applicationData.phone,
    role: applicationData.position,
    score: 0,
    level: 'Applicant',
  }, env)
    .then(async (res) => {
      results.hubspot = { success: true, data: res };
      if (res.contactId) {
        try {
          const dealRes = await createHiringDeal(applicationData, res.contactId, env);
          results.deal = { success: true, data: dealRes };
        } catch (dealErr) {
          console.error('Hiring deal creation error:', dealErr);
          results.deal = { success: false, error: dealErr.message };
        }
      }
    })
    .catch(err => {
      console.error('HubSpot contact error:', err);
      results.hubspot = { success: false, error: err.message };
    });

  // D1 database insert
  let applicationDbId = null;
  const dbPromise = insertJobApplication(applicationData, env)
    .then(res => {
      results.database = { success: true };
      applicationDbId = res.id;
    })
    .catch(err => {
      console.error('D1 application insert error:', err);
      results.database = { success: false, error: err.message };
    });

  // Wait for confirmation + forward (Resend rate limit: 2 req/sec)
  await Promise.all([confirmationPromise, forwardPromise]);

  // Wait for HubSpot + DB
  await Promise.all([hubspotPromise, dbPromise]);

  // Update service statuses in DB
  if (applicationDbId) {
    try {
      await updateApplicationServiceStatuses(applicationDbId, {
        resend: results.confirmation?.success ? 'sent' : (results.confirmation?.error || 'failed'),
        hubspot: results.hubspot?.success ? 'synced' : (results.hubspot?.error || 'failed'),
      }, env);
    } catch (err) {
      console.error('Application status update error:', err);
    }
  }

  return {
    success: true,
    message: 'Thank you for applying! We have received your application and will be in touch soon.',
    services: results,
  };
}
