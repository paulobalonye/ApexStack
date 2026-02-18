/* ============================================
   Q4 Seasonal Email — October
   "Year-end cloud wrap-up"
   ============================================ */

export function buildSeasonalQ4Email({ firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year-End Cloud Wrap-Up</title>
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
              Year-end cloud wrap-up, ${firstName}
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              As the year wraps up, it's time to reflect on what worked, what didn't, and how to set yourself up for a strong start next year. Here's your year-end cloud checklist.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Year-end checklist</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">1.</strong> Generate annual cloud cost report — identify trends and anomalies</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">2.</strong> Review and rotate access credentials and API keys</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">3.</strong> Archive old environments and clean up unused resources</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">4.</strong> Set cloud goals and budget for next year</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Want a comprehensive year-end cloud review? We'll help you analyze this year's performance and build a roadmap for next year.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">Book Year-End Review</a>
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
