/* ============================================
   Cron Handler — Re-engagement Emails (Feature 7)
   Runs daily. Finds 30-day-old leads who haven't
   booked and sends re-engagement emails based on
   their engagement level.
   ============================================ */

import { getLeadsForReengagement, getEngagementStats } from '../db/queries.js';
import { isUnsubscribed } from '../db/queries.js';
import { sendReengagementEmail } from '../services/resend.js';

export async function handleScheduled(env) {
  console.log('Cron: Starting re-engagement check...');

  try {
    // Get leads from ~30 days ago (window: 28-32 days)
    const leads = await getLeadsForReengagement(30, env);

    if (!leads || leads.length === 0) {
      console.log('Cron: No leads eligible for re-engagement');
      return { processed: 0 };
    }

    console.log(`Cron: Found ${leads.length} leads for re-engagement`);
    let sent = 0;
    let skipped = 0;

    for (const lead of leads) {
      // Check unsubscribe
      const unsubbed = await isUnsubscribed(lead.email, env);
      if (unsubbed) {
        skipped++;
        continue;
      }

      // Determine engagement type
      let type = 'cold';
      try {
        const stats = await getEngagementStats(lead.email, env);
        if (stats && stats.recentOpens >= 1) {
          type = 'warm';
        }
      } catch (err) {
        // Default to cold if we can't check
      }

      // Send re-engagement email
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

      // Rate limit: max 2 per second for Resend
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Cron: Re-engagement complete. Sent: ${sent}, Skipped: ${skipped}`);
    return { processed: leads.length, sent, skipped };
  } catch (err) {
    console.error('Cron: Re-engagement error:', err);
    return { error: err.message };
  }
}
