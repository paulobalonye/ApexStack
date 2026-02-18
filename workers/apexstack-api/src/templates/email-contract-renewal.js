/* ============================================
   Contract Renewal Reminder Email
   Dynamic tone: 90 days (casual), 60 days
   (review), 30 days (urgent)
   ============================================ */

export function buildContractRenewalEmail({ firstName, companyName, daysUntilExpiry, unsubUrl }) {
  const isUrgent = daysUntilExpiry <= 30;
  const isMid = daysUntilExpiry <= 60 && daysUntilExpiry > 30;

  const heading = isUrgent
    ? `Your contract renews in ${daysUntilExpiry} days, ${firstName}`
    : isMid
    ? `Time to review your renewal, ${firstName}`
    : `A quick heads-up about your renewal, ${firstName}`;

  const intro = isUrgent
    ? `Your ApexStack Cloud contract ${companyName ? `for <strong style="color: #ffffff;">${companyName}</strong> ` : ''}is renewing soon. Let's make sure everything is squared away before your renewal date.`
    : isMid
    ? `Your contract ${companyName ? `for <strong style="color: #ffffff;">${companyName}</strong> ` : ''}renews in about ${daysUntilExpiry} days. This is a great time to review your current plan and discuss any changes.`
    : `Just a friendly reminder — your ApexStack Cloud contract ${companyName ? `for <strong style="color: #ffffff;">${companyName}</strong> ` : ''}renews in approximately ${daysUntilExpiry} days. No action needed right now, but here are a few things to consider.`;

  const urgencyColor = isUrgent ? '#ff4444' : isMid ? '#ffaa00' : '#b8e600';
  const urgencyLabel = isUrgent ? 'ACTION NEEDED' : isMid ? 'REVIEW RECOMMENDED' : 'UPCOMING RENEWAL';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract Renewal Reminder</title>
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

          <!-- Urgency Badge -->
          <tr>
            <td style="padding-bottom: 16px;">
              <span style="background: ${urgencyColor}22; color: ${urgencyColor}; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 4px; letter-spacing: 1px;">${urgencyLabel}</span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">
              ${heading}
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              ${intro}
            </td>
          </tr>

          <!-- Checklist Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Renewal checklist</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          &#9744; Review your current cloud usage and capacity needs
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          &#9744; Consider any new projects or scaling requirements
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          &#9744; Check if your current plan still aligns with your goals
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          &#9744; Schedule a renewal review call with our team
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              We'd love to hop on a quick call to make sure your renewal reflects your current needs. No surprises, no pressure — just making sure you're getting the most value.
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">Schedule Renewal Review</a>
                  </td>
                </tr>
              </table>
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
