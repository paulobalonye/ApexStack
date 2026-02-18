/* ============================================
   Post-Meeting Follow-Up Email
   Sent automatically when a deal stage changes
   to a post-meeting stage in HubSpot
   ============================================ */

export function getEmailSubjectForStage(dealStage, firstName) {
  const content = getStageContent(dealStage, firstName);
  return content.subject;
}

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
    case 'appointmentscheduled':
      return {
        subject: `Your consultation is confirmed, ${firstName}!`,
        heading: `Your consultation is confirmed, ${firstName}!`,
        intro: `We're looking forward to connecting with you! Your strategy session with ApexStack Cloud has been scheduled and our team is preparing to make the most of our time together.`,
        nextSteps: [
          'Have a rough sketch of your current cloud architecture handy (even bullet points help)',
          'Think about your top 3 cloud challenges or goals you\'d like to address',
          'Know your approximate monthly cloud spend (a ballpark is fine)',
          'Jot down any questions you\'d like answered during our call',
        ],
        closing: `Don't worry if you don't have everything prepared &mdash; we'll guide the conversation and make sure we cover what matters most to you. See you soon!`,
        ctaText: 'View Meeting Details',
      };

    case 'qualifiedtobuy':
      return {
        subject: `Welcome to ApexStack Cloud, ${firstName}`,
        heading: `Welcome to ApexStack Cloud, ${firstName}!`,
        intro: `Thank you for your interest in ApexStack Cloud. We help companies like yours transform their cloud infrastructure &mdash; cutting costs, strengthening security, and accelerating deployments. We'd love to learn more about your specific needs.`,
        nextSteps: [
          'Take our free <a href="https://apexstackcloud.com/assessment" style="color: #b8e600; text-decoration: none;">Cloud Readiness Assessment</a> to see where you stand',
          'A member of our team will reach out to schedule an introductory call',
          'In the meantime, explore our <a href="https://apexstackcloud.com/services" style="color: #b8e600; text-decoration: none;">services</a> and <a href="https://apexstackcloud.com/case-studies" style="color: #b8e600; text-decoration: none;">case studies</a>',
        ],
        closing: `We're excited about the possibility of working together. If you have any immediate questions, just reply to this email &mdash; we typically respond within a few hours.`,
        ctaText: 'Take Free Assessment',
      };

    case 'presentationscheduled':
    case 'meeting_completed':
      return {
        subject: `Great connecting with you, ${firstName}!`,
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
        subject: `Your proposal is on its way, ${firstName}!`,
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
        subject: `Almost there, ${firstName}!`,
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

    case 'closedwon':
      return {
        subject: `Welcome aboard, ${firstName}!`,
        heading: `Welcome aboard, ${firstName}!`,
        intro: `We're thrilled to officially welcome you to the ApexStack Cloud family! This is the beginning of an exciting journey, and our team is ready to hit the ground running to deliver real results for your organization.`,
        nextSteps: [
          'Your dedicated project manager will reach out within 24 hours to schedule the onboarding kickoff',
          'We\'ll conduct an initial technical deep dive into your current infrastructure',
          'You\'ll receive access to our client portal with project tracking and documentation',
          'Our team will prepare a 90-day implementation roadmap tailored to your goals',
        ],
        closing: `Thank you for trusting ApexStack Cloud with your cloud infrastructure. We don't take that trust lightly, and we're committed to exceeding your expectations.`,
        ctaText: 'Schedule Onboarding Call',
      };

    case 'closedlost':
      return {
        subject: `Thank you for considering ApexStack Cloud, ${firstName}`,
        heading: `Thank you, ${firstName}`,
        intro: `We appreciate you taking the time to explore what ApexStack Cloud can offer. While we won't be working together right now, we want you to know that our door is always open if your needs change in the future.`,
        nextSteps: [
          'Your free <a href="https://apexstackcloud.com/assessment" style="color: #b8e600; text-decoration: none;">Cloud Readiness Assessment</a> is always available &mdash; retake it anytime to track your progress',
          'We publish regular insights on cloud strategy at <a href="https://apexstackcloud.com/blog" style="color: #b8e600; text-decoration: none;">our blog</a>',
          'If your situation changes or you\'d like a second opinion, reach out anytime &mdash; no pressure',
        ],
        closing: `We wish you all the best with your cloud journey. If there's anything we can help with down the road, don't hesitate to reach out.`,
        ctaText: 'Stay Connected',
      };

    default:
      // Generic follow-up
      return {
        subject: `Great talking with you, ${firstName}!`,
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
