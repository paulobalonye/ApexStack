/* ============================================
   Contact Form Nurture Email 3
   Sent: Day 5 after contact form submission
   Content: HitchPay case study — social proof
   with key results and soft CTA to book a call
   ============================================ */

export function buildContactNurture3Email({ firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How a fintech transformed their cloud in 90 days</title>
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
              ${firstName}, here's how a fintech transformed their cloud in 90 days
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              We thought you'd appreciate seeing what a real engagement looks like. HitchPay is a Series B fintech processing payments across West Africa. When they came to us, their cloud costs were growing 30% faster than revenue and their infrastructure couldn't keep up with expansion plans.
            </td>
          </tr>

          <!-- The Story -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #dc2626; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">The Situation</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      HitchPay had grown fast, but their AWS environment was provisioned reactively &mdash; oversized EC2 instances, no cost visibility, and a disaster recovery plan that existed only in theory. They needed to scale into three new markets while maintaining PCI-DSS compliance and sub-10ms payment latency.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What Changed -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">What We Did Together</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Over 90 days, ApexStack worked alongside HitchPay's engineering team to migrate payment workloads to EKS with intelligent auto-scaling, redesign their database layer with Aurora PostgreSQL, implement a full FinOps framework with real-time dashboards, and build PCI-DSS compliant CI/CD pipelines with automated security scanning.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Results Stats -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 16px; text-align: center;">Key Results</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" style="padding: 12px; width: 33%;">
                          <div style="color: #b8e600; font-size: 28px; font-weight: 800;">47%</div>
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Cloud Cost Reduction</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 33%;">
                          <div style="color: #b8e600; font-size: 28px; font-weight: 800;">99.95%</div>
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Uptime Achieved</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 33%;">
                          <div style="color: #b8e600; font-size: 28px; font-weight: 800;">90</div>
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Days to Transform</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bullet Results -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 15px; font-weight: 600; padding-bottom: 12px;">What this meant for HitchPay:</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#8226;</strong>&nbsp; Cloud spend dropped from $14K/month to $7.4K &mdash; freeing budget for product development
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#8226;</strong>&nbsp; Passed PCI-DSS Level 1 audit on the first attempt, unlocking enterprise payment partnerships
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">&#8226;</strong>&nbsp; Successfully launched in three new West African markets with zero downtime during rollout
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Soft CTA -->
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 12px;">
              Every infrastructure challenge is different, but the approach is the same &mdash; understand where you are, define where you need to be, and build the shortest path between the two.
            </td>
          </tr>
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              If you'd like to explore what a similar engagement could look like for your team, we're happy to chat. No pressure &mdash; just a conversation.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                BOOK A QUICK CALL
              </a>
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
