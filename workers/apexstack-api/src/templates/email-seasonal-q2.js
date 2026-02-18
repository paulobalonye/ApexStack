/* ============================================
   Q2 Seasonal Email — April
   "Mid-year cloud health check"
   ============================================ */

export function buildSeasonalQ2Email({ firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mid-Year Cloud Health Check</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%;">

          <tr>
            <td style="padding-bottom: 32px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; color: #000000; font-weight: 800; font-size: 16px; width: 32px; height: 32px; text-align: center; line-height: 32px; border-radius: 6px;">A</td>
                  <td style="padding-left: 10px; color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.3px;">ApexStack Cloud</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">
              Time for a mid-year cloud health check, ${firstName}
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              We're halfway through the year — the perfect checkpoint to see how your cloud infrastructure is performing against your goals. Are you on track? Over budget? Let's find out.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Q2 health check items</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">1.</strong> Compare H1 cloud spend vs. budget — adjust forecasts for H2</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">2.</strong> Review performance metrics — any latency or availability issues?</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">3.</strong> Check for unused resources — zombie instances, idle load balancers</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">4.</strong> Revisit your disaster recovery plan — when did you last test it?</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Our complimentary mid-year health check takes 30 minutes and gives you a clear picture of where you stand — and where you can improve before year-end.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">Book Health Check</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="border-top: 1px solid #222222; padding-top: 32px;">
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">&copy; ${new Date().getFullYear()} ApexStack Cloud. All rights reserved.</p>
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;"><a href="https://apexstackcloud.com" style="color: #b8e600; text-decoration: none;">apexstackcloud.com</a></p>
              ${unsubUrl ? `<p style="margin: 0;"><a href="${unsubUrl}" style="color: #6b7280; font-size: 12px; text-decoration: underline;">Unsubscribe</a></p>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
