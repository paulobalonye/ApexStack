/* ============================================
   Monthly Newsletter Email
   3-section layout: Cloud Tip | Industry Trend
   | Company Update
   ============================================ */

export function buildNewsletterEmail({ firstName, month, year, tip, trend, companyUpdate, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexStack Cloud Newsletter — ${month} ${year}</title>
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

          <!-- Newsletter Badge -->
          <tr>
            <td style="padding-bottom: 16px;">
              <span style="background: #b8e60022; color: #b8e600; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 4px; letter-spacing: 1px;">MONTHLY NEWSLETTER — ${month.toUpperCase()} ${year}</span>
            </td>
          </tr>

          <tr>
            <td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">
              Your monthly cloud insights, ${firstName}
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Here's your curated roundup of cloud tips, industry trends, and updates from the ApexStack team.
            </td>
          </tr>

          <!-- Section 1: Cloud Tip -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">&#9729; Cloud tip of the month</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 700; padding-bottom: 12px;">${tip.title}</div>
                    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0;">${tip.body}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 2: Industry Trend -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">&#128200; Industry trend</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 700; padding-bottom: 12px;">${trend.title}</div>
                    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0;">${trend.body}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 3: Company Update -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">&#128227; From the team</div>
                    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0;">${companyUpdate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dual CTA -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">Book a Strategy Session</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="border: 2px solid #b8e600; border-radius: 8px;">
                    <a href="https://apexstackcloud.com/#assessment" target="_blank" style="display: inline-block; padding: 12px 28px; color: #b8e600; font-size: 14px; font-weight: 700; text-decoration: none;">Take Cloud Readiness Assessment</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
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
