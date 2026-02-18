/* ============================================
   Post-Meeting Follow-Up Email
   Sent automatically when a deal stage changes
   to a post-meeting stage in HubSpot
   ============================================ */

export function buildPostMeetingEmail({ firstName, companyName, dealStage, meetingSummary, unsubUrl }) {
  const schedulerLink = 'http://meeting.apexstackcloud.com/meetings/apexstack';

  // Dynamic content based on deal stage
  const stageContent = getStageContent(dealStage, firstName);

  // Meeting summary section (only if provided)
  const summarySection = meetingSummary ? `
          <!-- Discussion Summary -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Key Discussion Points</div>
                    <div style="color: #d1d5db; font-size: 14px; line-height: 1.8;">${meetingSummary}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Great connecting with you</title>
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
              ${stageContent.heading}
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              ${stageContent.intro}
            </td>
          </tr>

          ${summarySection}

          <!-- Next Steps Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">Next Steps</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      ${stageContent.nextSteps.map((step, i) => `
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">${i + 1}.</strong> ${step}
                        </td>
                      </tr>`).join('')}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">
              ${stageContent.closing}
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="${schedulerLink}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">${stageContent.ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #222222; padding-top: 32px;">
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
                &copy; ${new Date().getFullYear()} ApexStack Cloud. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
                <a href="https://apexstackcloud.com" style="color: #b8e600; text-decoration: none;">apexstackcloud.com</a>
              </p>
              ${unsubUrl ? `<p style="margin: 0;"><a href="${unsubUrl}" style="color: #6b7280; font-size: 12px; text-decoration: underline;">Unsubscribe</a></p>` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ============================================
   Stage-Specific Content
   Different messaging based on deal stage
   ============================================ */

function getStageContent(dealStage, firstName) {
  switch (dealStage) {
    case 'presentationscheduled':
    case 'meeting_completed':
      return {
        heading: `Great connecting with you, ${firstName}!`,
        intro: `Thank you for taking the time to meet with us today. We truly enjoyed learning about your cloud infrastructure goals and challenges. Our team is already putting together tailored recommendations based on our conversation.`,
        nextSteps: [
          'We\'ll prepare a customized assessment based on what we discussed',
          'You\'ll receive a detailed proposal within the next 2 business days',
          'We\'ll schedule a follow-up to walk through our recommendations together',
        ],
        closing: `In the meantime, if you have any questions or additional details to share, simply reply to this email. We're here to help.`,
        ctaText: 'Schedule Follow-Up Call',
      };

    case 'decisionmakerboughtin':
    case 'proposal_sent':
      return {
        heading: `Your proposal is on its way, ${firstName}!`,
        intro: `Thank you for the productive conversation today. As discussed, we're finalizing a detailed proposal that covers everything we talked about &mdash; from architecture recommendations to implementation timelines and investment.`,
        nextSteps: [
          'Review the proposal we\'ll send within 24-48 hours',
          'Share it with any stakeholders who need to be involved',
          'Book a call so we can walk through it together and answer questions',
        ],
        closing: `We're confident the plan we discussed will deliver meaningful results for your team. Let us know if you'd like to fast-track any part of the process.`,
        ctaText: 'Book Proposal Review',
      };

    case 'contractsent':
    case 'negotiation':
      return {
        heading: `Almost there, ${firstName}!`,
        intro: `Thank you for today's discussion. We're excited about the alignment between your goals and what ApexStack Cloud can deliver. As a next step, we're preparing the contract details based on what we agreed upon.`,
        nextSteps: [
          'You\'ll receive the contract/agreement for review shortly',
          'Take your time reviewing the terms &mdash; we want you to feel 100% confident',
          'Let us know if there are any adjustments needed &mdash; we\'re flexible',
        ],
        closing: `We're looking forward to starting this journey with you. If you need anything in the meantime, just reply to this email.`,
        ctaText: 'Schedule a Quick Chat',
      };

    default:
      // Generic post-meeting follow-up
      return {
        heading: `Great talking with you, ${firstName}!`,
        intro: `Thank you for taking the time to connect with us today. We appreciated learning more about your cloud infrastructure needs and are excited about the opportunity to help.`,
        nextSteps: [
          'Our team will review everything we discussed',
          'We\'ll follow up with tailored recommendations and next steps',
          'Feel free to reach out anytime if questions come up',
        ],
        closing: `We're here whenever you need us. Simply reply to this email or book a time that works for you.`,
        ctaText: 'Schedule Follow-Up',
      };
  }
}
