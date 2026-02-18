/* ============================================
   Q1 Seasonal Email — January
   "New year, new cloud strategy"
   ============================================ */

export function buildSeasonalQ1Email({ firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Year Cloud Strategy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%;">

          <!-- Logo -->
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
              New year, new cloud strategy, ${firstName}
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              The start of a new year is the perfect time to reassess your cloud infrastructure. Whether you're planning a migration, looking to optimize costs, or scaling for growth — now is the time to set the foundation.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Q1 cloud priorities</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">1.</strong> Audit last year's cloud spend — find the waste before it compounds</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">2.</strong> Set your cloud budget and savings targets for the year</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">3.</strong> Review security policies — new year, updated compliance requirements</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">4.</strong> Plan infrastructure projects for H1</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Want to kick off the year with a free cloud strategy session? We'll review your current setup and map out a plan for the year ahead.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">Book Q1 Strategy Session</a>
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
