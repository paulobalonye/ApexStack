/* ============================================
   Employee Work Anniversary Email
   Sent on the anniversary of an employee's
   hire date
   ============================================ */

export function buildWorkAnniversaryEmail({ firstName, yearsCount, unsubUrl }) {
  const yearWord = yearsCount === 1 ? 'year' : 'years';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy Work Anniversary!</title>
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

          <!-- Heading -->
          <tr>
            <td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">
              Happy ${yearsCount}-${yearWord} work anniversary, ${firstName}!
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              Today marks ${yearsCount} ${yearWord} since you joined the ApexStack Cloud team. Your dedication, talent, and hard work have been instrumental in making our team and our clients' cloud journeys a success.
            </td>
          </tr>

          <!-- Celebration Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="font-size: 48px; padding-bottom: 16px;">&#127775; &#127881; &#127775;</div>
                    <div style="color: #b8e600; font-size: 24px; font-weight: 700; padding-bottom: 8px;">${yearsCount} ${yearWord} of excellence</div>
                    <div style="color: #9ca3af; font-size: 14px;">Thank you for being an incredible part of our team.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Here's to many more years of innovation, growth, and cloud-powered success together. We're lucky to have you on the team, ${firstName}.
            </td>
          </tr>

          <tr>
            <td style="color: #ffffff; font-size: 15px; font-weight: 600; line-height: 1.7; padding-bottom: 40px;">
              — The ApexStack Cloud Team
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #222222; padding-top: 32px;">
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
                &copy; ${new Date().getFullYear()} ApexStack Cloud. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
                <a href="https://apexstackcloud.com" style="color: #b8e600; text-decoration: none;">apexstackcloud.com</a>
              </p>
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
