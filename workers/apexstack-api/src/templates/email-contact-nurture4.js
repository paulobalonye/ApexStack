/* ============================================
   Contact Form Nurture Email 4
   Sent: Day 10 after contact form submission
   Content: Industry cloud trends — what companies
   like yours are doing + soft CTA to book a call
   ============================================ */

export function buildContactNurture4Email({ firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>What companies like yours are doing with cloud</title>
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
              ${firstName}, what companies like yours are doing with cloud
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              We work with growth-stage companies across fintech, healthtech, and e-commerce every day. Here are the cloud infrastructure trends we're seeing right now &mdash; and what the smartest teams are doing about them.
            </td>
          </tr>

          <!-- Trend 1 -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Trend 1</div>
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 8px;">Platform engineering is replacing DevOps</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      The best teams are building internal developer platforms that abstract away infrastructure complexity. Instead of every developer managing their own Terraform, golden paths let engineers ship features faster while maintaining security and compliance guardrails.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trend 2 -->
          <tr>
            <td style="padding-bottom: 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Trend 2</div>
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 8px;">FinOps is now a C-suite priority</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Cloud cost optimization has moved from engineering teams to the executive suite. Companies that implement real-time cost dashboards and automated rightsizing typically cut 30&ndash;50% of their cloud spend within the first quarter &mdash; without sacrificing performance.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trend 3 -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Trend 3</div>
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 8px;">Security-first architecture is non-negotiable</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      With regulatory requirements tightening across Africa and globally, companies are baking compliance into their infrastructure from day one. Zero-trust networking, automated security scanning in CI/CD pipelines, and SOC 2 readiness are becoming table stakes for any company handling sensitive data.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What This Means -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 15px; font-weight: 600; padding-bottom: 12px;">What this means for your team</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      The companies that invest in cloud infrastructure now &mdash; whether it's cost optimization, security hardening, or platform engineering &mdash; are the ones that scale faster later. The gap between cloud-mature and cloud-reactive companies is growing every quarter.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Soft CTA -->
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Want to know where your team stands? We offer a free 30-minute cloud strategy session where we assess your current setup and identify the highest-impact improvements. No strings attached.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                BOOK A FREE STRATEGY SESSION
              </a>
            </td>
          </tr>

          <!-- Assessment CTA Secondary -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                Or take our free <a href="https://apexstackcloud.com/readiness.html" style="color: #b8e600; text-decoration: underline;">Cloud Readiness Assessment</a> to see exactly where you stand.
              </div>
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
