/* ============================================
   Email 1: Your Cloud Readiness Score
   Sent: Immediately after assessment
   Content: Full score, category breakdown,
   top risks, recommendations, CTA
   ============================================ */

function getScoreColor(score) {
  if (score <= 30) return '#dc2626';
  if (score <= 60) return '#f59e0b';
  if (score <= 80) return '#4a7a00';
  return '#059669';
}

function getCategoryLabel(cat) {
  const labels = {
    architecture: 'Architecture & IaC',
    security: 'Security & Compliance',
    deployment: 'Deployment & DevOps',
    monitoring: 'Monitoring & Reliability',
    cost: 'Cost Optimization',
  };
  return labels[cat] || cat;
}

export function buildScoreEmail({ name, firstName, score, level, categoryPct, risks, recs, unsubUrl }) {
  const scoreColor = getScoreColor(score);

  const categoryBars = Object.entries(categoryPct || {})
    .map(([cat, pct]) => {
      const barColor = getScoreColor(pct);
      return `
        <tr>
          <td style="padding: 8px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="font-size: 13px; color: #d1d5db; padding-bottom: 4px;">${getCategoryLabel(cat)}</td>
                <td style="font-size: 13px; color: ${barColor}; text-align: right; padding-bottom: 4px; font-weight: 600;">${pct}%</td>
              </tr>
              <tr>
                <td colspan="2">
                  <div style="background: #1a1a1a; border-radius: 4px; height: 8px; overflow: hidden;">
                    <div style="background: ${barColor}; width: ${pct}%; height: 8px; border-radius: 4px;"></div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join('');

  const riskItems = (risks || [])
    .map(r => `<li style="padding: 6px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">${r}</li>`)
    .join('');

  const recItems = (recs || [])
    .map(r => `<li style="padding: 6px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">${r}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Cloud Readiness Score</title>
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

          <!-- Greeting -->
          <tr>
            <td style="color: #ffffff; font-size: 24px; font-weight: 700; padding-bottom: 8px;">
              ${firstName}, here's your Cloud Readiness Report
            </td>
          </tr>
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.6; padding-bottom: 32px;">
              Thank you for completing the ApexStack Cloud Readiness Assessment. Below is your personalized analysis with actionable insights to strengthen your cloud infrastructure.
            </td>
          </tr>

          <!-- Score Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td align="center" style="padding: 32px 24px;">
                    <div style="font-size: 64px; font-weight: 800; color: ${scoreColor}; line-height: 1;">${score}</div>
                    <div style="font-size: 20px; color: #6b7280; font-weight: 400; margin-top: 4px;">/100</div>
                    <div style="display: inline-block; margin-top: 12px; padding: 6px 16px; background: ${scoreColor}20; color: ${scoreColor}; font-size: 14px; font-weight: 600; border-radius: 20px; border: 1px solid ${scoreColor}40;">
                      ${level}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Category Breakdown -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 16px; border-bottom: 1px solid #222222; margin-bottom: 8px;">Category Breakdown</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      ${categoryBars}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Risks -->
          ${risks && risks.length > 0 ? `
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #dc262640;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #dc2626; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">Top Risks Identified</div>
                    <ul style="margin: 0; padding-left: 20px;">
                      ${riskItems}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- Recommendations -->
          ${recs && recs.length > 0 ? `
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60040;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">Our Recommendations</div>
                    <ul style="margin: 0; padding-left: 20px;">
                      ${recItems}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #1a2600 0%, #111111 100%); border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Want to fix these gaps fast?</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Book a free 30-minute strategy session with one of our cloud architects. We'll walk through your results and build a prioritized action plan.
                    </div>
                    <a href="https://meetings-na2.hubspot.com/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      BOOK A FREE STRATEGY SESSION
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
