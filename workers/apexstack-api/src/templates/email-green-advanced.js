/* ============================================
   Green Tier Email: Advanced Topics
   Sent: Day 7 (for scores 61-100)
   Content: Chaos engineering, FinOps maturity,
   platform engineering thought leadership
   ============================================ */

export function buildGreenAdvancedEmail({ name, firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Next-level: chaos engineering &amp; FinOps</title>
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
              ${firstName}, three disciplines that separate good infrastructure from elite
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Your assessment results told us your team has the fundamentals locked down. So instead of the usual best-practices rundown, here are three advanced disciplines we're seeing the strongest engineering organizations invest in right now.
            </td>
          </tr>

          <!-- Topic 1: Chaos Engineering -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Advanced Discipline #1</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Chaos Engineering</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Netflix popularized this with their Simian Army &mdash; intentionally injecting failures into production to build confidence in system resilience. The principle is simple: if you haven't tested a failure mode, you don't know how your system handles it. Leading teams run regular game days where they simulate AZ failures, network partitions, and dependency outages. The result isn't just more reliable systems &mdash; it's engineering teams that respond to incidents with calm precision instead of panic. Tools like AWS Fault Injection Simulator and LitmusChaos make it more accessible than ever to start.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Topic 2: FinOps Maturity -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Advanced Discipline #2</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">FinOps Maturity Framework</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Most teams stop at cost monitoring. Mature FinOps goes much deeper: unit economics per customer, cost-per-transaction tracking, automated anomaly detection, and real-time budget forecasting that ties directly to business KPIs. The FinOps Foundation's maturity model moves through three phases &mdash; Inform, Optimize, Operate &mdash; and the companies that reach the Operate phase typically see 30&ndash;40% better cloud ROI than those stuck in Inform. The key shift is moving cloud cost ownership from a central platform team to every engineering squad that provisions resources.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Topic 3: Platform Engineering -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Advanced Discipline #3</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Platform Engineering &amp; Developer Self-Service</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      The next evolution beyond DevOps is a dedicated internal platform that lets developers ship without waiting on infrastructure tickets. Think golden paths &mdash; curated, pre-approved templates for spinning up services, databases, and environments that are secure and cost-efficient by default. Companies like Spotify, Mercado Libre, and Grab have built internal developer platforms (IDPs) that cut time-to-production for new services from weeks to hours. Tools like Backstage, Kratix, and Port are making this accessible to teams without a hundred-person platform org.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              These aren't theoretical concepts &mdash; they're the exact disciplines we help teams implement. If any of these resonate with where your team is headed, we'd love to dig into the specifics with you.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #1a2600 0%, #111111 100%); border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Ready to go deeper?</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Book a strategy session and we'll walk through which of these disciplines would deliver the highest impact for your specific architecture and business goals.
                    </div>
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      BOOK A STRATEGY SESSION
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
