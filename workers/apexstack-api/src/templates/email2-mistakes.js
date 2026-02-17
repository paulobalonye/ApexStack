/* ============================================
   Email 2: 3 Cloud Mistakes
   Sent: Day 2 (scheduled)
   Content: Educational — common cloud mistakes
   fintech startups make, link to case studies
   ============================================ */

export function buildMistakesEmail({ name, firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3 Cloud Mistakes That Cost Millions</title>
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
              ${firstName}, here are 3 cloud mistakes that cost fintech startups millions
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              After reviewing hundreds of cloud environments across fintech, SaaS, and enterprise companies, we see the same critical mistakes over and over. Here are the top three &mdash; and how to avoid them.
            </td>
          </tr>

          <!-- Mistake 1 -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #dc2626; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Mistake #1</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Treating Infrastructure as Code as "nice to have"</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Manual server configurations feel faster in the short term. But without IaC, every deployment becomes a game of "did someone change this config?" Configuration drift leads to mysterious production failures, impossible-to-reproduce bugs, and disaster recovery that takes days instead of minutes. Companies we work with that adopt Terraform or Pulumi typically see a 60% reduction in deployment-related incidents within the first quarter.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mistake 2 -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #f59e0b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Mistake #2</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Bolting security on after launch</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      We've seen Series B fintechs lose enterprise deals because they couldn't pass a SOC 2 audit. Security retrofits are 5&ndash;10x more expensive than building security into your CI/CD pipeline from the start. Automated vulnerability scanning, centralized secrets management, and compliance-as-code aren't luxuries &mdash; they're the cost of doing business in regulated industries.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mistake 3 -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Mistake #3</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Over-provisioning "just to be safe"</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Running oversized instances 24/7 because "we might need the headroom" is the most common source of wasted cloud spend. One payment processor we worked with was spending $14K/month on instances that averaged 12% CPU utilization. With proper auto-scaling, reserved instance planning, and rightsizing, they cut that to $7.4K while actually improving performance during peak transaction hours.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Takeaway -->
          <tr>
            <td style="color: #d1d5db; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              The good news? Every one of these mistakes is fixable &mdash; often in weeks, not months. The companies that address these gaps early save significantly in the long run and scale with confidence.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="https://apexstackcloud.com/case-studies.html" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                SEE HOW WE FIXED THESE FOR HITCHPAY
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
