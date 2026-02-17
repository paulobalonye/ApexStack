/* ============================================
   Red Tier Email 1: Critical Risk Alert
   Sent: Day 1 (immediately after assessment)
   Audience: Score 0-30 (High Risk / Red tier)
   Content: Acknowledge low score, highlight top
   risk, explain consequences, CTA to book
   emergency strategy session
   ============================================ */

export function buildRedUrgentEmail({ name, firstName, score, risks, unsubUrl }) {
  const topRisk = (risks && risks.length > 0) ? risks[0] : 'critical security and infrastructure gaps';

  const riskConsequences = (risks || [])
    .slice(0, 3)
    .map(r => `<li style="padding: 6px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">${r}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Infrastructure Is at Critical Risk</title>
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
              ${firstName}, your cloud infrastructure needs immediate attention
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Your Cloud Readiness Assessment came back with a score of <strong style="color: #dc2626; font-size: 18px;">${score}/100</strong>, placing your infrastructure in the <strong style="color: #dc2626;">critical risk</strong> category. We don't share this to alarm you &mdash; we share it because we've seen what happens when these gaps go unaddressed, and we want to help you fix them before they become costly incidents.
            </td>
          </tr>

          <!-- Top Risk Highlight -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #dc262640;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #dc2626; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Primary Risk Identified</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">${topRisk}</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      This was the most critical finding from your assessment. Left unresolved, this type of gap is typically the root cause behind production outages, security breaches, and failed compliance audits. The good news: it's fixable, and often faster than you'd expect.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Additional Risks -->
          ${risks && risks.length > 1 ? `
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #f59e0b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">Additional Risks From Your Assessment</div>
                    <ul style="margin: 0; padding-left: 20px;">
                      ${riskConsequences}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- What Could Go Wrong -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 16px;">What's at stake if nothing changes</div>

                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #dc2626; font-size: 16px; font-weight: 700;">01</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Unplanned Downtime</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Without proper redundancy and monitoring, a single point of failure can take your entire platform offline. The average cost of cloud downtime is $5,600 per minute for mid-market companies.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #dc2626; font-size: 16px; font-weight: 700;">02</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Data Breach Exposure</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Gaps in secrets management, access controls, and network segmentation are exactly what attackers exploit. A single breach can cost millions in remediation, legal fees, and lost customer trust.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #dc2626; font-size: 16px; font-weight: 700;">03</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Compliance Failure</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">If you're handling sensitive data or operating in a regulated industry, the gaps in your infrastructure could mean failed audits, lost enterprise deals, and regulatory penalties.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reassurance -->
          <tr>
            <td style="color: #d1d5db; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              ${firstName}, we've helped companies in far worse positions turn things around in weeks. A score of ${score} isn't a verdict &mdash; it's a starting point. The fact that you took this assessment tells us you care about getting this right. Let's build a plan together.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #1a2600 0%, #111111 100%); border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Let's fix this &mdash; starting now</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Book an emergency strategy session with one of our senior cloud architects. We'll walk through your results, identify the highest-impact fixes, and build a prioritized action plan &mdash; all in 30 minutes.
                    </div>
                    <a href="https://meetings-na2.hubspot.com/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      BOOK AN EMERGENCY STRATEGY SESSION
                    </a>
                    <div style="color: #6b7280; font-size: 12px; margin-top: 12px;">
                      30 minutes &bull; Free &bull; Senior cloud architect
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 8px;">
              We're here to help,
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="color: #ffffff; font-size: 15px; font-weight: 600;">The ApexStack Cloud Team</div>
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
