/* ============================================
   Red Tier Email 2: 3 Things to Fix This Week
   Sent: Day 3 (scheduled)
   Audience: Score 0-30 (High Risk / Red tier)
   Content: 3 actionable steps they can take
   immediately — secrets audit, monitoring,
   architecture docs. CTA for personalized roadmap.
   ============================================ */

export function buildRedActionEmail({ name, firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3 Things to Fix This Week</title>
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
              ${firstName}, 3 things you can fix this week to reduce your risk
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              We know a low assessment score can feel overwhelming. The truth is, you don't need to fix everything at once. Here are three high-impact actions you can take <strong style="color: #ffffff;">this week</strong> to meaningfully reduce your exposure &mdash; no vendor required.
            </td>
          </tr>

          <!-- Action 1: Secrets Audit -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #dc262640;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #dc2626; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Action #1 &mdash; Today</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Audit your secrets management</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      Search your codebase and configuration files for hardcoded API keys, database passwords, and access tokens. This is the single most common vulnerability we find in critical-risk environments. Move every secret into a vault service (AWS Secrets Manager, HashiCorp Vault, or even environment variables as a first step). Rotate any credentials that have been committed to version control &mdash; assume they've been compromised.
                    </div>
                    <div style="margin-top: 12px; padding: 12px 16px; background: #1a1a1a; border-radius: 8px; border-left: 3px solid #dc2626;">
                      <div style="color: #d1d5db; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #ffffff;">Quick check:</strong> Run <span style="color: #b8e600; font-family: monospace;">git log --all -p | grep -i "password\|secret\|api_key"</span> on your repos. If you get results, you have exposed secrets in your git history.
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action 2: Monitoring -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #f59e0b40;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #f59e0b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Action #2 &mdash; Tomorrow</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Enable basic monitoring and alerts</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      If you don't have monitoring in place, you're flying blind. At minimum, set up alerts for CPU utilization above 80%, memory pressure, disk usage above 85%, and application error rates. Most cloud providers have free-tier monitoring tools (CloudWatch, Azure Monitor, GCP Cloud Monitoring) that take less than an hour to configure. The goal isn't perfection &mdash; it's visibility.
                    </div>
                    <div style="margin-top: 12px; padding: 12px 16px; background: #1a1a1a; border-radius: 8px; border-left: 3px solid #f59e0b;">
                      <div style="color: #d1d5db; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #ffffff;">Start here:</strong> Set up a Slack or email alert for any 5xx errors in your application. If you're on AWS, create a CloudWatch alarm for your ALB's HTTPCode_Target_5XX_Count metric. This alone can catch 70% of production issues before your customers do.
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action 3: Documentation -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60040;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Action #3 &mdash; This Week</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; padding-bottom: 12px;">Document your current architecture</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      You can't fix what you can't see. Spend an hour mapping out your current cloud architecture: what services you're running, how they connect, where data flows, and who has access to what. This doesn't need to be pretty &mdash; a whiteboard sketch or a simple diagram is enough. This exercise alone often reveals forgotten resources, unnecessary exposure, and single points of failure that your team didn't realize existed.
                    </div>
                    <div style="margin-top: 12px; padding: 12px 16px; background: #1a1a1a; border-radius: 8px; border-left: 3px solid #b8e600;">
                      <div style="color: #d1d5db; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #ffffff;">Include these:</strong> All compute instances, databases, load balancers, DNS records, third-party integrations, IAM roles, and network boundaries. Mark anything that's publicly accessible.
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Encouragement -->
          <tr>
            <td style="color: #d1d5db; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Completing these three actions won't solve everything, but they'll close the most dangerous gaps and give you a clear foundation to build on. Most teams we work with can get all three done in under a day.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #1a2600 0%, #111111 100%); border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Want a personalized remediation roadmap?</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      These three actions are a strong start, but every infrastructure is different. Book a free call and we'll build a prioritized roadmap specific to your environment, your risks, and your team's capacity.
                    </div>
                    <a href="https://meetings-na2.hubspot.com/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      GET YOUR PERSONALIZED ROADMAP
                    </a>
                    <div style="color: #6b7280; font-size: 12px; margin-top: 12px;">
                      30 minutes &bull; Free &bull; No commitment
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 8px;">
              Rooting for you,
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
