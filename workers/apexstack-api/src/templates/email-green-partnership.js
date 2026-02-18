/* ============================================
   Green Tier Email: Strategic Partnership
   Sent: Day 3 (for scores 61-100)
   Content: Congratulate strong score, position
   ApexStack as partner for advanced optimization
   ============================================ */

export function buildGreenPartnershipEmail({ name, firstName, score, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're ahead of 90% of companies</title>
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
              ${firstName}, your score puts you ahead of 90% of companies we assess
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              A score of <strong style="color: #b8e600;">${score}/100</strong> doesn't happen by accident. It tells us your team has invested real effort into building a solid cloud foundation &mdash; and that's worth acknowledging.
            </td>
          </tr>

          <!-- Acknowledgment Card -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">What Your Score Tells Us</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      You've likely already tackled the fundamentals &mdash; infrastructure as code, CI/CD pipelines, monitoring baselines, and sensible security controls. Most companies we work with at this level aren't looking for someone to fix what's broken. They're looking for a partner who can help them push further.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Where We Come In -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 16px;">Where a strategic partner makes the difference</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 12px;">
                      At your maturity level, the next gains come from advanced optimization &mdash; the kind that requires deep specialization and cross-industry pattern recognition. Here's where we typically create the most value for teams like yours:
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">01</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Chaos Engineering & Resilience Testing</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Proactively injecting failures to discover weaknesses before your customers do. Game days, blast radius mapping, and automated recovery validation.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">02</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">FinOps Maturity & Unit Economics</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Moving beyond simple cost-cutting to true cloud financial management &mdash; cost per transaction, per customer, per feature. The metrics that matter at board level.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">03</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Multi-Region Disaster Recovery</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Architecting for true multi-region failover with RPO/RTO guarantees that satisfy enterprise SLAs and regulatory requirements across geographies.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Partnership Framing -->
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              We don't approach strong teams with a remediation mindset. We come in as an extension of your engineering team &mdash; bringing specialized depth so your people can stay focused on building product.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #1a2600 0%, #111111 100%); border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Explore a strategic partnership</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Let's have a conversation about where your infrastructure is headed and how we can accelerate the roadmap. No sales deck &mdash; just two engineering teams talking shop.
                    </div>
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      LET'S TALK STRATEGY
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
                You're receiving this because you completed our Cloud Readiness Assessment.
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
