/* ============================================
   Email 4: Free Architecture Review Offer
   Sent: Day 10 (scheduled)
   Content: Direct offer — free 45-min cloud
   architecture review, what they get, CTA
   ============================================ */

export function buildOfferEmail({ name, firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Free Cloud Architecture Review</title>
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
              ${firstName}, claim your free cloud architecture review
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Since you took our Cloud Readiness Assessment, we'd like to offer you something we normally reserve for paying clients: a <strong style="color: #ffffff;">free 45-minute cloud architecture review</strong> with one of our senior engineers.
            </td>
          </tr>

          <!-- What You Get -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">What You'll Get</div>

                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">01</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Infrastructure Audit</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">We'll review your current cloud architecture, identify bottlenecks, and spot the quick wins.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">02</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Cost Optimization Map</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">We'll identify where you're overspending and show you specific areas where you could reduce costs by 20&ndash;50%.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">03</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Security Gap Analysis</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">We'll flag the critical security gaps that could put your compliance status or customer data at risk.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">04</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Prioritized Roadmap</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">You'll leave with a clear, prioritized action plan &mdash; what to fix first, what can wait, and estimated timelines.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- No Strings -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 8px;">No strings attached</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      This isn't a sales pitch disguised as a review. You'll get honest, actionable feedback &mdash; whether you work with us or not. We believe great advice builds great relationships.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #1a2600 0%, #111111 100%); border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Ready to see what's possible?</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Pick a time that works for you. Our senior cloud architects typically book up fast, so grab a slot while they're available.
                    </div>
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      CLAIM YOUR FREE REVIEW
                    </a>
                    <div style="color: #6b7280; font-size: 12px; margin-top: 12px;">
                      45 minutes &bull; No commitment &bull; Senior engineer
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 8px;">
              Looking forward to connecting,
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Amuzat O</div>
              <div style="color: #9ca3af; font-size: 13px;">CTO, ApexStack Cloud</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #222222; padding-top: 24px; text-align: center;">
              <div style="color: #6b7280; font-size: 12px; line-height: 1.6;">
                ApexStack Cloud Technologies Limited<br>
                Cloud Engineering for High-Growth Companies<br>
                <a href="https://apexstackcloud.com" style="color: #b8e600; text-decoration: none;">apexstackcloud.com</a>
              </div>
              <div style="color: #4b5563; font-size: 11px; margin-top: 12px;">
                You're receiving this because you completed our Cloud Readiness Assessment.<br>
                This is the last email in this series.
              </div>
              ${unsubUrl ? `<div style="margin-top: 12px;"><a href="${unsubUrl}" style="color: #6b7280; font-size: 11px; text-decoration: underline;">Unsubscribe</a> from future emails</div>` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
