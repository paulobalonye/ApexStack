/* ============================================
   Cron Sub-Handlers — All New Email Features
   Each function is called from cron.js dispatcher.
   Uses sendBulkEmails for broadcasts and
   sent_emails table for dedup.
   ============================================ */

import { sendBulkEmails, sendMeetingBookedEmail } from '../services/resend.js';
import { getAllActiveRecipients, hasSentEmail, recordSentEmail } from '../db/queries.js';
import { isUnsubscribed } from '../db/queries.js';
import {
  getContactsWithDateProperty,
  searchContactsByDateRange,
  getClosedWonDeals,
  getContactById,
  getNoShowMeetings,
} from '../services/hubspot.js';
import { handleNoShow } from './hubspot-webhook.js';

// Templates
import { buildWelcomeEmail } from '../templates/email-welcome.js';
import { buildContractRenewalEmail } from '../templates/email-contract-renewal.js';
import { buildClientAnniversaryEmail } from '../templates/email-client-anniversary.js';
import { buildWorkAnniversaryEmail } from '../templates/email-work-anniversary.js';
import { buildBirthdayEmail } from '../templates/email-birthday.js';
import { buildHolidayEmail } from '../templates/email-holiday.js';
import { buildNewsletterEmail } from '../templates/email-newsletter.js';
import { buildSeasonalQ1Email } from '../templates/email-seasonal-q1.js';
import { buildSeasonalQ2Email } from '../templates/email-seasonal-q2.js';
import { buildSeasonalQ3Email } from '../templates/email-seasonal-q3.js';
import { buildSeasonalQ4Email } from '../templates/email-seasonal-q4.js';

// Utilities
import { getTodayHoliday } from '../utils/holidays.js';
import { getNewsletterContent, MONTH_NAMES } from '../utils/newsletter-content.js';

/* ============================================
   Feature 6: Welcome / Onboarding Email
   Triggered by closed-won deals in last 3 days
   ============================================ */

export async function runWelcomeCheck(env) {
  console.log('Cron: Checking for new closed-won deals (welcome emails)...');

  try {
    const deals = await getClosedWonDeals(3, env);
    if (!deals || deals.length === 0) {
      return { task: 'welcome', processed: 0 };
    }

    let sent = 0, skipped = 0;

    for (const deal of deals) {
      const dealId = deal.id;
      const referenceKey = `deal-${dealId}`;

      // Get associated contact
      const contactIds = deal.associations?.contacts?.results?.map(a => a.id) || [];
      if (contactIds.length === 0) { skipped++; continue; }

      const contact = await getContactById(contactIds[0], env);
      if (!contact) { skipped++; continue; }

      const email = contact.properties?.email;
      if (!email) { skipped++; continue; }

      // Dedup
      const alreadySent = await hasSentEmail(email, 'welcome', referenceKey, env);
      if (alreadySent) { skipped++; continue; }

      const unsubbed = await isUnsubscribed(email, env);
      if (unsubbed) { skipped++; continue; }

      // Send welcome email via bulk sender pattern
      const recipients = [{
        email,
        name: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim(),
        companyName: contact.properties?.company || '',
      }];

      const result = await sendBulkEmails(
        recipients,
        (r) => ({
          subject: `Welcome to ApexStack Cloud, ${r.firstName}!`,
          html: buildWelcomeEmail({ firstName: r.firstName, companyName: r.companyName, unsubUrl: r.unsubUrl }),
        }),
        'welcome',
        referenceKey,
        env
      );

      sent += result.sent;
      skipped += result.skipped;

      // Rate limit between deals
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Cron: Welcome check complete. Sent: ${sent}, Skipped: ${skipped}`);
    return { task: 'welcome', sent, skipped };
  } catch (err) {
    console.error('Cron: Welcome check error:', err);
    return { task: 'welcome', error: err.message };
  }
}

/* ============================================
   Feature 9: Contract Renewal Reminders
   Checks 90, 60, and 30 day windows
   ============================================ */

export async function runRenewalCheck(env) {
  console.log('Cron: Checking contract renewal reminders...');

  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    let totalSent = 0, totalSkipped = 0;

    for (const daysOut of [90, 60, 30]) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + daysOut);

      // 2-day window around target
      const startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);

      const contacts = await searchContactsByDateRange(
        'contract_end_date',
        startDate.getTime(),
        endDate.getTime(),
        env
      );

      if (!contacts || contacts.length === 0) continue;

      const referenceKey = `renewal-${daysOut}-${year}`;

      for (const contact of contacts) {
        const email = contact.properties?.email;
        if (!email) { totalSkipped++; continue; }

        const alreadySent = await hasSentEmail(email, 'renewal', referenceKey, env);
        if (alreadySent) { totalSkipped++; continue; }

        const unsubbed = await isUnsubscribed(email, env);
        if (unsubbed) { totalSkipped++; continue; }

        const recipients = [{
          email,
          name: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim(),
          companyName: contact.properties?.company || '',
          daysUntilExpiry: daysOut,
        }];

        const result = await sendBulkEmails(
          recipients,
          (r) => ({
            subject: daysOut <= 30
              ? `Urgent: Your contract renews in ${daysOut} days, ${r.firstName}`
              : `Your ApexStack Cloud contract renews in ${daysOut} days`,
            html: buildContractRenewalEmail({ firstName: r.firstName, companyName: r.companyName, daysUntilExpiry: daysOut, unsubUrl: r.unsubUrl }),
          }),
          'renewal',
          referenceKey,
          env
        );

        totalSent += result.sent;
        totalSkipped += result.skipped;
        await new Promise(r => setTimeout(r, 600));
      }
    }

    console.log(`Cron: Renewal check complete. Sent: ${totalSent}, Skipped: ${totalSkipped}`);
    return { task: 'renewal', sent: totalSent, skipped: totalSkipped };
  } catch (err) {
    console.error('Cron: Renewal check error:', err);
    return { task: 'renewal', error: err.message };
  }
}

/* ============================================
   Feature 11: Client Company Anniversary
   ============================================ */

export async function runClientAnniversaryCheck(env) {
  console.log('Cron: Checking client anniversaries...');

  try {
    const now = new Date();
    const todayMonth = now.getUTCMonth();
    const todayDay = now.getUTCDate();
    const year = now.getUTCFullYear();

    const contacts = await getContactsWithDateProperty('client_start_date', env);
    if (!contacts || contacts.length === 0) {
      return { task: 'client-anniversary', processed: 0 };
    }

    let sent = 0, skipped = 0;

    for (const contact of contacts) {
      const dateStr = contact.properties?.client_start_date;
      if (!dateStr) { skipped++; continue; }

      const startDate = new Date(dateStr);
      if (startDate.getUTCMonth() !== todayMonth || startDate.getUTCDate() !== todayDay) {
        continue; // Not today's anniversary
      }

      const yearsCount = year - startDate.getUTCFullYear();
      if (yearsCount <= 0) continue; // Same year, skip

      const email = contact.properties?.email;
      if (!email) { skipped++; continue; }

      const referenceKey = `client-anniversary-${year}`;
      const alreadySent = await hasSentEmail(email, 'client-anniversary', referenceKey, env);
      if (alreadySent) { skipped++; continue; }

      const recipients = [{
        email,
        name: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim(),
        companyName: contact.properties?.company || '',
        yearsCount,
      }];

      const result = await sendBulkEmails(
        recipients,
        (r) => ({
          subject: `Happy ${yearsCount}-year anniversary, ${r.firstName}!`,
          html: buildClientAnniversaryEmail({ firstName: r.firstName, companyName: r.companyName, yearsCount, unsubUrl: r.unsubUrl }),
        }),
        'client-anniversary',
        referenceKey,
        env
      );

      sent += result.sent;
      skipped += result.skipped;
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Cron: Client anniversary check complete. Sent: ${sent}, Skipped: ${skipped}`);
    return { task: 'client-anniversary', sent, skipped };
  } catch (err) {
    console.error('Cron: Client anniversary check error:', err);
    return { task: 'client-anniversary', error: err.message };
  }
}

/* ============================================
   Feature 12: Employee Work Anniversary
   ============================================ */

export async function runWorkAnniversaryCheck(env) {
  console.log('Cron: Checking work anniversaries...');

  try {
    const now = new Date();
    const todayMonth = now.getUTCMonth();
    const todayDay = now.getUTCDate();
    const year = now.getUTCFullYear();

    const contacts = await getContactsWithDateProperty('employee_hire_date', env);
    if (!contacts || contacts.length === 0) {
      return { task: 'work-anniversary', processed: 0 };
    }

    let sent = 0, skipped = 0;

    for (const contact of contacts) {
      const dateStr = contact.properties?.employee_hire_date;
      if (!dateStr) { skipped++; continue; }

      const hireDate = new Date(dateStr);
      if (hireDate.getUTCMonth() !== todayMonth || hireDate.getUTCDate() !== todayDay) continue;

      const yearsCount = year - hireDate.getUTCFullYear();
      if (yearsCount <= 0) continue;

      const email = contact.properties?.email;
      if (!email) { skipped++; continue; }

      const referenceKey = `work-anniversary-${year}`;
      const alreadySent = await hasSentEmail(email, 'work-anniversary', referenceKey, env);
      if (alreadySent) { skipped++; continue; }

      const recipients = [{
        email,
        name: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim(),
        yearsCount,
      }];

      const result = await sendBulkEmails(
        recipients,
        (r) => ({
          subject: `Happy ${yearsCount}-year work anniversary, ${r.firstName}!`,
          html: buildWorkAnniversaryEmail({ firstName: r.firstName, yearsCount, unsubUrl: r.unsubUrl }),
        }),
        'work-anniversary',
        referenceKey,
        env
      );

      sent += result.sent;
      skipped += result.skipped;
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Cron: Work anniversary check complete. Sent: ${sent}, Skipped: ${skipped}`);
    return { task: 'work-anniversary', sent, skipped };
  } catch (err) {
    console.error('Cron: Work anniversary check error:', err);
    return { task: 'work-anniversary', error: err.message };
  }
}

/* ============================================
   Feature 13: Team Member Birthday
   ============================================ */

export async function runBirthdayCheck(env) {
  console.log('Cron: Checking birthdays...');

  try {
    const now = new Date();
    const todayMonth = now.getUTCMonth();
    const todayDay = now.getUTCDate();
    const year = now.getUTCFullYear();

    const contacts = await getContactsWithDateProperty('date_of_birth', env);
    if (!contacts || contacts.length === 0) {
      return { task: 'birthday', processed: 0 };
    }

    let sent = 0, skipped = 0;

    for (const contact of contacts) {
      const dateStr = contact.properties?.date_of_birth;
      if (!dateStr) { skipped++; continue; }

      const dob = new Date(dateStr);
      if (dob.getUTCMonth() !== todayMonth || dob.getUTCDate() !== todayDay) continue;

      const email = contact.properties?.email;
      if (!email) { skipped++; continue; }

      const referenceKey = `birthday-${year}`;
      const alreadySent = await hasSentEmail(email, 'birthday', referenceKey, env);
      if (alreadySent) { skipped++; continue; }

      const recipients = [{
        email,
        name: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim(),
      }];

      const result = await sendBulkEmails(
        recipients,
        (r) => ({
          subject: `Happy Birthday, ${r.firstName}! 🎂`,
          html: buildBirthdayEmail({ firstName: r.firstName, unsubUrl: r.unsubUrl }),
        }),
        'birthday',
        referenceKey,
        env
      );

      sent += result.sent;
      skipped += result.skipped;
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Cron: Birthday check complete. Sent: ${sent}, Skipped: ${skipped}`);
    return { task: 'birthday', sent, skipped };
  } catch (err) {
    console.error('Cron: Birthday check error:', err);
    return { task: 'birthday', error: err.message };
  }
}

/* ============================================
   Feature 14: US Holiday Greetings
   ============================================ */

export async function runHolidayCheck(env) {
  console.log('Cron: Checking for US holidays...');

  try {
    const holiday = getTodayHoliday();
    if (!holiday) {
      return { task: 'holiday', processed: 0, reason: 'No holiday today' };
    }

    console.log(`Cron: Today is ${holiday.name}! Sending greetings...`);

    const year = new Date().getUTCFullYear();
    const referenceKey = `holiday-${holiday.name.replace(/\s+/g, '-').toLowerCase()}-${year}`;

    const recipients = await getAllActiveRecipients(env);
    if (!recipients || recipients.length === 0) {
      return { task: 'holiday', processed: 0, reason: 'No active recipients' };
    }

    const result = await sendBulkEmails(
      recipients,
      (r) => ({
        subject: `Happy ${holiday.name}, ${r.firstName}!`,
        html: buildHolidayEmail({
          firstName: r.firstName,
          holidayName: holiday.name,
          holidayMessage: holiday.message,
          unsubUrl: r.unsubUrl,
        }),
      }),
      'holiday',
      referenceKey,
      env
    );

    console.log(`Cron: Holiday (${holiday.name}) complete. Sent: ${result.sent}, Skipped: ${result.skipped}`);
    return { task: 'holiday', holiday: holiday.name, ...result };
  } catch (err) {
    console.error('Cron: Holiday check error:', err);
    return { task: 'holiday', error: err.message };
  }
}

/* ============================================
   Features 3/5: Quarterly Seasonal Email
   Sends in Jan (Q1), Apr (Q2), Jul (Q3), Oct (Q4)
   within the first 7 days of the month
   ============================================ */

const SEASONAL_MONTHS = { 0: 1, 3: 2, 6: 3, 9: 4 }; // month → quarter

export async function runSeasonalCheck(env) {
  console.log('Cron: Checking for seasonal email...');

  try {
    const now = new Date();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();
    const year = now.getUTCFullYear();

    const quarter = SEASONAL_MONTHS[month];
    if (!quarter || day > 7) {
      return { task: 'seasonal', processed: 0, reason: 'Not a seasonal send window' };
    }

    console.log(`Cron: Q${quarter} seasonal email window — sending...`);

    const referenceKey = `seasonal-Q${quarter}-${year}`;
    const recipients = await getAllActiveRecipients(env);
    if (!recipients || recipients.length === 0) {
      return { task: 'seasonal', processed: 0, reason: 'No active recipients' };
    }

    const buildFns = {
      1: buildSeasonalQ1Email,
      2: buildSeasonalQ2Email,
      3: buildSeasonalQ3Email,
      4: buildSeasonalQ4Email,
    };

    const subjects = {
      1: 'New year, new cloud strategy',
      2: 'Time for a mid-year cloud health check',
      3: "It's time to plan your Q4 cloud budget",
      4: 'Year-end cloud wrap-up',
    };

    const buildFn = buildFns[quarter];
    const subject = subjects[quarter];

    const result = await sendBulkEmails(
      recipients,
      (r) => ({
        subject: `${subject}, ${r.firstName}`,
        html: buildFn({ firstName: r.firstName, unsubUrl: r.unsubUrl }),
      }),
      'seasonal',
      referenceKey,
      env
    );

    console.log(`Cron: Seasonal Q${quarter} complete. Sent: ${result.sent}, Skipped: ${result.skipped}`);
    return { task: 'seasonal', quarter, ...result };
  } catch (err) {
    console.error('Cron: Seasonal check error:', err);
    return { task: 'seasonal', error: err.message };
  }
}

/* ============================================
   Feature 15: Monthly Newsletter
   Sends 1st–3rd of each month
   ============================================ */

export async function runNewsletterCheck(env) {
  console.log('Cron: Checking for newsletter send window...');

  try {
    const now = new Date();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();
    const year = now.getUTCFullYear();

    if (day > 3) {
      return { task: 'newsletter', processed: 0, reason: 'Not in newsletter window (1st-3rd)' };
    }

    const monthName = MONTH_NAMES[month];
    const referenceKey = `newsletter-${year}-${String(month).padStart(2, '0')}`;

    const recipients = await getAllActiveRecipients(env);
    if (!recipients || recipients.length === 0) {
      return { task: 'newsletter', processed: 0, reason: 'No active recipients' };
    }

    const content = getNewsletterContent(month);

    const result = await sendBulkEmails(
      recipients,
      (r) => ({
        subject: `ApexStack Cloud Newsletter — ${monthName} ${year}`,
        html: buildNewsletterEmail({
          firstName: r.firstName,
          month: monthName,
          year,
          tip: content.tip,
          trend: content.trend,
          companyUpdate: content.companyUpdate,
          unsubUrl: r.unsubUrl,
        }),
      }),
      'newsletter',
      referenceKey,
      env
    );

    console.log(`Cron: Newsletter (${monthName} ${year}) complete. Sent: ${result.sent}, Skipped: ${result.skipped}`);
    return { task: 'newsletter', month: monthName, ...result };
  } catch (err) {
    console.error('Cron: Newsletter check error:', err);
    return { task: 'newsletter', error: err.message };
  }
}

/* ============================================
   10. No-Show Meeting Follow-Ups
   Checks HubSpot for meetings with NO_SHOW
   or CANCELLED outcome in the last 48 hours,
   sends a follow-up email to each contact
   ============================================ */

export async function runNoShowCheck(env) {
  console.log('Cron: Checking for no-show meetings...');

  try {
    const meetings = await getNoShowMeetings(env);
    if (!meetings || meetings.length === 0) {
      console.log('Cron: No no-show meetings found.');
      return { task: 'no-show', processed: 0 };
    }

    console.log(`Cron: Found ${meetings.length} no-show/cancelled meetings`);
    let sent = 0, skipped = 0;

    for (const meeting of meetings) {
      const result = await handleNoShow(meeting.email, meeting.firstName, env);
      if (result?.status === 'sent' || result?.id) {
        sent++;
      } else {
        skipped++;
      }

      // Rate limit between sends
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Cron: No-show check complete. Sent: ${sent}, Skipped: ${skipped}`);
    return { task: 'no-show', sent, skipped };
  } catch (err) {
    console.error('Cron: No-show check error:', err);
    return { task: 'no-show', error: err.message };
  }
}
