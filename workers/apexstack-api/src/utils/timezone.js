/* ============================================
   Timezone Utility
   Formats dates for display in EST (Eastern)
   ============================================ */

export function formatEST(date = new Date()) {
  return date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}
