/* ============================================
   Red Tier Email 3: Emergency Audit Offer
   Sent: Day 14 (scheduled)
   Audience: Score 0-30 (High Risk / Red tier)
   Content: Exclusive 50% off deep-dive cloud
   architecture audit ($15K instead of $30K).
   What they get, limited availability, CTA.
   ============================================ */

export function buildRedOfferEmail({ name, firstName, unsubUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emergency Cloud Audit — 50% Off</title>
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
              ${firstName}, we're offering you something we rarely do
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              Two weeks ago, your Cloud Readiness Assessment revealed critical gaps in your infrastructure. We've been thinking about your results, and we'd like to offer you an exclusive opportunity to get those issues resolved with a comprehensive, hands-on engagement &mdash; at a price we normally don't offer.
            </td>
          </tr>

          <!-- Offer Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <div style="color: #b8e600; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 12px;">Exclusive Offer for Assessment Participants</div>
                    <div style="color: #ffffff; font-size: 22px; font-weight: 700; padding-bottom: 4px;">Deep-Dive Cloud Architecture Audit</div>
                    <div style="padding: 16px 0;">
                      <span style="color: #6b7280; font-size: 18px; text-decoration: line-through;">$30,000</span>
                      <span style="color: #b8e600; font-size: 36px; font-weight: 800; padding-left: 12px;">$15,000</span>
                    </div>
                    <div style="display: inline-block; padding: 6px 16px; background: #b8e60015; color: #b8e600; font-size: 14px; font-weight: 600; border-radius: 20px; border: 1px solid #b8e60040;">
                      50% Off &mdash; Limited Availability
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Included -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #b8e60030;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">What's Included</div>

                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">01</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Full Infrastructure Review</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Our senior engineers will perform a comprehensive analysis of your entire cloud environment &mdash; compute, networking, storage, databases, and application architecture. We map every resource, dependency, and data flow.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">02</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Security Gap Analysis</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Detailed assessment of IAM policies, network segmentation, secrets management, encryption practices, and compliance readiness. You'll get a prioritized list of every vulnerability with severity ratings and remediation steps.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">03</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Cost Optimization Report</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">Line-by-line analysis of your cloud spend with specific recommendations for rightsizing, reserved instances, auto-scaling improvements, and waste elimination. Our clients typically find 25&ndash;50% in savings from this analysis alone.</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; vertical-align: top; width: 28px;">
                          <div style="color: #b8e600; font-size: 16px; font-weight: 700;">04</div>
                        </td>
                        <td style="padding: 10px 0; padding-left: 12px;">
                          <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Migration &amp; Modernization Roadmap</div>
                          <div style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-top: 4px;">A detailed, phased roadmap with timelines, effort estimates, and quick wins you can execute immediately. This becomes your team's playbook for the next 6&ndash;12 months &mdash; whether you implement it yourselves or with our help.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Deliverables Summary -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 16px; text-align: center;">What You Walk Away With</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" style="padding: 12px; width: 25%;">
                          <div style="color: #b8e600; font-size: 24px; font-weight: 800;">40+</div>
                          <div style="color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Page Report</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 25%;">
                          <div style="color: #b8e600; font-size: 24px; font-weight: 800;">2</div>
                          <div style="color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Week Delivery</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 25%;">
                          <div style="color: #b8e600; font-size: 24px; font-weight: 800;">3</div>
                          <div style="color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Review Sessions</div>
                        </td>
                        <td align="center" style="padding: 12px; width: 25%;">
                          <div style="color: #b8e600; font-size: 24px; font-weight: 800;">12mo</div>
                          <div style="color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Roadmap</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Scarcity / Why Now -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #dc262640;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 8px;">Why this offer, and why now?</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.7;">
                      We reserve a small number of audit slots each quarter for organizations with critical-risk assessment results. We know the longer these gaps persist, the more expensive they become to fix &mdash; and the higher the chance of a serious incident. This pricing is only available for assessment participants, and we can only take on <strong style="color: #ffffff;">3 new audit clients this month</strong>.
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
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; padding-bottom: 8px;">Secure your audit slot</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Book a call to discuss your infrastructure and confirm your spot. No payment required upfront &mdash; we'll scope the engagement together and make sure it's the right fit before you commit.
                    </div>
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                      BOOK NOW &mdash; CLAIM 50% OFF
                    </a>
                    <div style="color: #6b7280; font-size: 12px; margin-top: 12px;">
                      $15,000 (normally $30,000) &bull; Limited slots &bull; Assessment participants only
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 8px;">
              Looking forward to helping you secure your infrastructure,
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="color: #ffffff; font-size: 15px; font-weight: 600;">Amzat Oyetunji</div>
              <div style="color: #9ca3af; font-size: 13px;">CTO, ApexStack Cloud</div>
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
                You're receiving this because you completed our Cloud Readiness Assessment.<br>
                This is the last email in this series.
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
