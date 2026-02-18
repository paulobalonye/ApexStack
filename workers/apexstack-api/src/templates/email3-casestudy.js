/* ============================================
   Email 3: HitchPay Case Study
   Sent: Day 5 (scheduled)
   Content: How a Series B fintech cut cloud
   costs 47% in 90 days + CTA
   ============================================ */

export function buildCaseStudyEmail({ name, firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How HitchPay Cut Cloud Costs 47%</title>
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
              How a Series B fintech cut cloud costs 47% while scaling to $2M+ in transactions
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              ${firstName}, this is the kind of transformation we deliver. Here's the real story of HitchPay &mdash; a fast-growing African payment processor that came to us with a cloud bill growing 30% faster than revenue.
            </td>
          </tr>

          <!-- Challenge -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #dc2626; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">The Challenge</div>
                    <div style="color: #d1d5db; font-size: 14px; line-height: 1.7;">
                      HitchPay's AWS environment had been provisioned reactively over two years. Over-provisioned EC2 instances, unoptimized databases, and no cost visibility. They needed to scale for three new West African markets while maintaining PCI-DSS compliance and sub-10ms payment latency.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What We Did -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">What We Did (16 weeks)</div>
                    <div style="color: #d1d5db; font-size: 14px; line-height: 1.7;">
                      <div style="padding: 6px 0;"><span style="color: #b8e600; font-weight: 600;">1.</span> Migrated payment workloads from EC2 to EKS with auto-scaling tuned for transaction patterns</div>
                      <div style="padding: 6px 0;"><span style="color: #b8e600; font-weight: 600;">2.</span> Redesigned database layer with Aurora PostgreSQL read replicas and connection pooling</div>
                      <div style="padding: 6px 0;"><span style="color: #b8e600; font-weight: 600;">3.</span> Implemented FinOps framework with real-time cost dashboards and automated rightsizing</div>
                      <div style="padding: 6px 0;"><span style="color: #b8e600; font-weight: 600;">4.</span> Built PCI-DSS compliant CI/CD with automated security scanning</div>
                      <div style="padding: 6px 0;"><span style="color: #b8e600; font-weight: 600;">5.</span> Established multi-region disaster recovery (RPO &lt;15min, RTO &lt;30min)</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Results Stats -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 16px; text-align: center;">The Results</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" style="padding: 12px; width: 33%;">
                          <div style="color: #b8e600; font-size: 28px; font-weight: 800;">47%</div>
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Cloud Cost Cut</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 33%;">
                          <div style="color: #b8e600; font-size: 28px; font-weight: 800;">$2M+</div>
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Transactions</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 33%;">
                          <div style="color: #b8e600; font-size: 28px; font-weight: 800;">&lt;8ms</div>
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Avg Latency</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quote -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-left: 3px solid #b8e600; padding-left: 20px;">
                <tr>
                  <td style="padding-left: 20px;">
                    <div style="color: #d1d5db; font-size: 15px; font-style: italic; line-height: 1.7; padding-bottom: 8px;">
                      "HitchPay passed a full PCI-DSS Level 1 audit on the first attempt, and the FinOps dashboards gave the finance team real-time visibility into cost allocation by product line for the first time."
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 12px; color: #d1d5db; font-size: 15px; line-height: 1.7;">
              ${firstName}, we can do the same for your infrastructure. Every engagement starts with a conversation.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 32px; padding-top: 16px;">
              <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                BOOK A FREE STRATEGY SESSION
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
