/* ============================================
   Contact Form Nurture Email 2
   Sent: Day 2 after contact form submission
   Content: Suggest taking the free Cloud Readiness
   Assessment while team reviews their inquiry
   ============================================ */

export function buildContactNurture2Email({ firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>While you wait — take our free Cloud Readiness Assessment</title>
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
              ${firstName}, while our team reviews your inquiry...
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Thanks again for reaching out. Our engineering team is reviewing your message and will be in touch shortly. In the meantime, there's something you can do right now that will make our first conversation even more productive.
            </td>
          </tr>

          <!-- Assessment Card -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Free Cloud Readiness Assessment</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 16px;">
                      Our Cloud Readiness Assessment gives you an instant, personalized score across five critical dimensions of your cloud infrastructure. It takes about <strong style="color: #ffffff;">3 minutes</strong> to complete, and you'll get your results immediately.
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#10003;</strong>&nbsp; Architecture &amp; Infrastructure as Code
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#10003;</strong>&nbsp; Security &amp; Compliance posture
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#10003;</strong>&nbsp; Deployment &amp; DevOps maturity
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#10003;</strong>&nbsp; Monitoring &amp; Reliability readiness
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#10003;</strong>&nbsp; Cost Optimization opportunities
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Why It Helps -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 8px;">Why take it before we connect?</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      When we hop on a call, we can skip the generic discovery questions and jump straight into the areas that matter most to your infrastructure. Your results give us a head start on understanding where you are and where you want to go.
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
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Get your free score in 3 minutes</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      15 questions. No credit card. Instant results with actionable insights.
                    </div>
                    <a href="https://apexstackcloud.com/assessment.html" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      TAKE THE FREE ASSESSMENT
                    </a>
                  </td>
                </tr>
              </table>
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
                You're receiving this because you submitted a contact form on our website.
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
