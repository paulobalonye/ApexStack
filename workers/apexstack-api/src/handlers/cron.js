/* ============================================
   Cron Dispatcher — Daily at 9 AM EST (14:00 UTC)
   Runs all email automation tasks:
   1. Re-engagement (existing)
   2. Welcome / onboarding
   3. Contract renewal reminders
   4. Client anniversaries
   5. Work anniversaries
   6. Birthdays
   7. Holiday greetings
   8. Seasonal quarterly emails
   9. Monthly newsletter
   10. No-show meeting follow-ups
   ============================================ */

import { getLeadsForReengagement, getEngagementStats } from '../db/queries.js';
import { isUnsubscribed } from '../db/queries.js';
import { sendReengagementEmail } from '../services/resend.js';

import {
  runWelcomeCheck,
  runRenewalCheck,
  runClientAnniversaryCheck,
  runWorkAnniversaryCheck,
  runBirthdayCheck,
  runHolidayCheck,
  runSeasonalCheck,
  runNewsletterCheck,
  runNoShowCheck,
} from './cron-tasks.js';

export async function handleScheduled(env) {
  console.log('Cron: Daily dispatcher starting...');

  const results = {};

  // 1. Re-engagement emails (existing feature)
  try {
    results.reengagement = await runReengagement(env);
  } catch (err) {
    console.error('Cron: Re-engagement task error:', err);
    results.reengagement = { error: err.message };
  }

  // 2. Welcome / onboarding (closed-won deals)
  try {
    results.welcome = await runWelcomeCheck(env);
  } catch (err) {
    console.error('Cron: Welcome task error:', err);
    results.welcome = { error: err.message };
  }

  // 3. Contract renewal reminders
  try {
    results.renewal = await runRenewalCheck(env);
  } catch (err) {
    console.error('Cron: Renewal task error:', err);
    results.renewal = { error: err.message };
  }

  // 4. Client anniversaries
  try {
    results.clientAnniversary = await runClientAnniversaryCheck(env);
  } catch (err) {
    console.error('Cron: Client anniversary task error:', err);
    results.clientAnniversary = { error: err.message };
  }

  // 5. Work anniversaries
  try {
    results.workAnniversary = await runWorkAnniversaryCheck(env);
  } catch (err) {
    console.error('Cron: Work anniversary task error:', err);
    results.workAnniversary = { error: err.message };
  }

  // 6. Birthdays
  try {
    results.birthday = await runBirthdayCheck(env);
  } catch (err) {
    console.error('Cron: Birthday task error:', err);
    results.birthday = { error: err.message };
  }

  // 7. Holiday greetings
  try {
    results.holiday = await runHolidayCheck(env);
  } catch (err) {
    console.error('Cron: Holiday task error:', err);
    results.holiday = { error: err.message };
  }

  // 8. Seasonal quarterly emails
  try {
    results.seasonal = await runSeasonalCheck(env);
  } catch (err) {
    console.error('Cron: Seasonal task error:', err);
    results.seasonal = { error: err.message };
  }

  // 9. Monthly newsletter
  try {
    results.newsletter = await runNewsletterCheck(env);
  } catch (err) {
    console.error('Cron: Newsletter task error:', err);
    results.newsletter = { error: err.message };
  }

  // 10. No-show meeting follow-ups
  try {
    results.noShow = await runNoShowCheck(env);
  } catch (err) {
    console.error('Cron: No-show task error:', err);
    results.noShow = { error: err.message };
  }

  console.log('Cron: Daily dispatcher complete.', JSON.stringify(results));
  return results;
}

/* ============================================
   Re-engagement Emails (Feature 7)
   Extracted from original handleScheduled
   ============================================ */

async function runReengagement(env) {
  console.log('Cron: Starting re-engagement check...');

  const leads = await getLeadsForReengagement(30, env);

  if (!leads || leads.length === 0) {
    console.log('Cron: No leads eligible for re-engagement');
    return { task: 'reengagement', processed: 0 };
  }

  console.log(`Cron: Found ${leads.length} leads for re-engagement`);
  let sent = 0;
  let skipped = 0;

  for (const lead of leads) {
    const unsubbed = await isUnsubscribed(lead.email, env);
    if (unsubbed) {
      skipped++;
      continue;
    }

    let type = 'cold';
    try {
      const stats = await getEngagementStats(lead.email, env);
      if (stats && stats.recentOpens >= 1) {
        type = 'warm';
      }
    } catch (err) {
      // Default to cold if we can't check
    }

    const result = await sendReengagementEmail({
      name: lead.name,
      email: lead.email,
      score: lead.score,
    }, type, env);

    if (result?.status === 'sent') {
      sent++;
    } else {
      skipped++;
    }

    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`Cron: Re-engagement complete. Sent: ${sent}, Skipped: ${skipped}`);
  return { task: 'reengagement', processed: leads.length, sent, skipped };
}
