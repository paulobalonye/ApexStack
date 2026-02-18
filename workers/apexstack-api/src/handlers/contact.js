/* ============================================
   Contact Form Handler
   Orchestrates: Resend auto-reply, Resend forward
   to team, HubSpot contact, D1 database
   ============================================ */

import { sendContactConfirmation, forwardContactToTeam, sendContactNurtureEmails } from '../services/resend.js';
import { createHubSpotContact, createContactDeal } from '../services/hubspot.js';
import { insertContactSubmission, updateContactServiceStatuses } from '../db/queries.js';

export async function handleContact(body, env) {
  const { firstName, lastName, email, phone, company, serviceInterest, message } = body;

  // Validate required fields
  if (!firstName || !lastName || !email) {
    return { success: false, error: 'Missing required fields: firstName, lastName, email' };
  }

  const contactData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || '').trim(),
    company: (company || '').trim(),
    serviceInterest: serviceInterest || '',
    message: (message || '').trim(),
    submittedAt: new Date().toISOString(),
  };

  const results = {
    confirmation: null,
    forward: null,
    nurture: null,
    hubspot: null,
    deal: null,
    database: null,
  };

  // Send confirmation + forward emails first (2 Resend calls)
  const confirmationPromise = sendContactConfirmation(contactData, env)
    .then(res => { results.confirmation = { success: true }; })
    .catch(err => {
      console.error('Contact confirmation email error:', err);
      results.confirmation = { success: false, error: err.message };
    });

  const forwardPromise = forwardContactToTeam(contactData, env)
    .then(res => { results.forward = { success: true }; })
    .catch(err => {
      console.error('Contact forward email error:', err);
      results.forward = { success: false, error: err.message };
    });

  // HubSpot contact + deal (Feature 2: serviceInterest, Feature 4: deal creation)
  const hubspotPromise = createHubSpotContact({
    name: `${contactData.firstName} ${contactData.lastName}`,
    email: contactData.email,
    company: contactData.company,
    phone: contactData.phone,
    role: contactData.serviceInterest || 'Contact Form',
    score: 0,
    level: 'Contact',
    serviceInterest: contactData.serviceInterest,
  }, env)
    .then(async (res) => {
      results.hubspot = { success: true, data: res };
      // Feature 4: Create deal after contact is created/updated
      if (res.contactId) {
        try {
          const dealRes = await createContactDeal(contactData, res.contactId, env);
          results.deal = { success: true, data: dealRes };
        } catch (dealErr) {
          console.error('Contact deal creation error:', dealErr);
          results.deal = { success: false, error: dealErr.message };
        }
      }
    })
    .catch(err => {
      console.error('HubSpot contact error:', err);
      results.hubspot = { success: false, error: err.message };
    });

  // Feature 3: Capture DB id for service status tracking
  let contactDbId = null;
  const dbPromise = insertContactSubmission(contactData, env)
    .then(res => {
      results.database = { success: true };
      contactDbId = res.id;
    })
    .catch(err => {
      console.error('D1 contact insert error:', err);
      results.database = { success: false, error: err.message };
    });

  // Wait for confirmation + forward to finish before nurture (Resend 2 req/sec limit)
  await Promise.all([confirmationPromise, forwardPromise]);

  // Delay 1 second to let Resend rate limit window reset
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Send nurture drip (Day 2 + Day 5 scheduled emails) — after rate limit window
  const nurturePromise = sendContactNurtureEmails(contactData, env)
    .then(res => { results.nurture = { success: true, data: res }; })
    .catch(err => {
      console.error('Contact nurture email error:', err);
      results.nurture = { success: false, error: err.message };
    });

  await Promise.all([nurturePromise, hubspotPromise, dbPromise]);

  // Feature 3: Update contact submission with service statuses
  if (contactDbId) {
    try {
      await updateContactServiceStatuses(contactDbId, {
        resend: results.confirmation?.success ? 'sent' : (results.confirmation?.error || 'failed'),
        hubspot: results.hubspot?.success ? 'synced' : (results.hubspot?.error || 'failed'),
      }, env);
    } catch (err) {
      console.error('Contact status update error:', err);
    }
  }

  return {
    success: true,
    message: 'Thank you! Your message has been sent. We will get back to you within 24 hours.',
    services: results,
  };
}
