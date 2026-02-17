/* ============================================
   Contact Form Handler
   Orchestrates: Resend auto-reply, Resend forward
   to team, HubSpot contact, D1 database
   ============================================ */

import { sendContactConfirmation, forwardContactToTeam, sendContactNurtureEmails } from '../services/resend.js';
import { createHubSpotContact } from '../services/hubspot.js';
import { insertContactSubmission } from '../db/queries.js';

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
    database: null,
  };

  // Fan out to all services concurrently
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

  // Send nurture drip (Day 2 + Day 5 scheduled emails)
  const nurturePromise = sendContactNurtureEmails(contactData, env)
    .then(res => { results.nurture = { success: true, data: res }; })
    .catch(err => {
      console.error('Contact nurture email error:', err);
      results.nurture = { success: false, error: err.message };
    });

  const hubspotPromise = createHubSpotContact({
    name: `${contactData.firstName} ${contactData.lastName}`,
    email: contactData.email,
    company: contactData.company,
    phone: contactData.phone,
    role: contactData.serviceInterest || 'Contact Form',
    score: 0,
    level: 'Contact',
  }, env)
    .then(res => { results.hubspot = { success: true, data: res }; })
    .catch(err => {
      console.error('HubSpot contact error:', err);
      results.hubspot = { success: false, error: err.message };
    });

  const dbPromise = insertContactSubmission(contactData, env)
    .then(res => { results.database = { success: true }; })
    .catch(err => {
      console.error('D1 contact insert error:', err);
      results.database = { success: false, error: err.message };
    });

  await Promise.all([confirmationPromise, forwardPromise, nurturePromise, hubspotPromise, dbPromise]);

  return {
    success: true,
    message: 'Thank you! Your message has been sent. We will get back to you within 24 hours.',
    services: results,
  };
}
