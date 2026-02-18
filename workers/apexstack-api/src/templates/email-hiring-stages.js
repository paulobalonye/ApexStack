/* ============================================
   Hiring Pipeline Stage Emails
   Sent automatically when a deal stage changes
   in the Hiring Pipeline in HubSpot.
   Follows the same pattern as email-post-meeting.js
   ============================================ */

export function getHiringEmailSubjectForStage(hiringStage, firstName) {
  const content = getHiringStageContent(hiringStage, firstName);
  return content.subject;
}

export function buildHiringStageEmail({ firstName, positionName, hiringStage, unsubUrl }) {
  const s = getHiringStageContent(hiringStage, firstName);

  const stepsHtml = s.nextSteps.map((step, i) =>
    `<tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">${i + 1}.</strong> ${step}</td></tr>`
  ).join('');

  const positionBlock = positionName
    ? `<tr><td style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 24px;">Position: <strong style="color: #ffffff;">${positionName}</strong></td></tr>`
    : '';

  const ctaBlock = s.ctaUrl
    ? `<tr>
        <td style="padding-bottom: 40px;">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="background: #b8e600; border-radius: 8px;">
                <a href="${s.ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">${s.ctaText}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : '';

  const unsubBlock = unsubUrl
    ? `<p style="margin: 0;"><a href="${unsubUrl}" style="color: #6b7280; font-size: 12px; text-decoration: underline;">Unsubscribe</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.heading}</title>
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
          <tr><td style="color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3; padding-bottom: 16px;">${s.heading}</td></tr>
          <!-- Intro -->
          <tr><td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">${s.intro}</td></tr>
          ${positionBlock}
          <!-- Next Steps Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">${s.cardTitle}</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      ${stepsHtml}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Closing -->
          <tr><td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 32px;">${s.closing}</td></tr>
          <!-- CTA Button -->
          ${ctaBlock}
          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #222222; padding-top: 32px;">
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">&copy; ${new Date().getFullYear()} ApexStack Cloud. All rights reserved.</p>
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;"><a href="https://apexstackcloud.com" style="color: #b8e600; text-decoration: none;">apexstackcloud.com</a></p>
              ${unsubBlock}
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
   Stage-Specific Content for Hiring Pipeline
   Each case maps to a HubSpot pipeline stage
   ============================================ */

function getHiringStageContent(hiringStage, firstName) {
  switch (hiringStage) {
    case 'application_received':
      return {
        subject: `We received your application, ${firstName}!`,
        heading: `We received your application, ${firstName}!`,
        intro: `Thank you for applying to ApexStack Cloud. Our hiring team has received your application and will begin reviewing it shortly.`,
        cardTitle: 'What Happens Next',
        nextSteps: [
          'Our team typically reviews applications within 3-5 business days',
          'We will assess your experience, skills, and alignment with the role',
          'You will hear from us regardless of the outcome',
        ],
        closing: `We appreciate your interest in joining our team and will be in touch soon.`,
        ctaText: 'Visit Our Careers Page',
        ctaUrl: 'https://apexstackcloud.com/careers.html',
      };

    case 'resume_screening':
      return {
        subject: `Update on your application, ${firstName}`,
        heading: `Your application is being reviewed, ${firstName}!`,
        intro: `Good news! Your application has moved to the review stage. Our hiring team is currently evaluating your background and qualifications.`,
        cardTitle: 'Where Things Stand',
        nextSteps: [
          'A member of our team is reviewing your resume and cover letter',
          'We may reach out with a few follow-up questions',
          'If selected, we will schedule a phone screen within the next few days',
        ],
        closing: `Thank you for your patience. We want to give every application the attention it deserves.`,
        ctaText: null,
        ctaUrl: null,
      };

    case 'phone_interview':
      return {
        subject: `Phone interview next step, ${firstName}!`,
        heading: `Let's schedule a phone interview, ${firstName}!`,
        intro: `We have reviewed your application and would love to learn more about you. The next step is a phone interview with a member of our hiring team.`,
        cardTitle: 'How to Prepare',
        nextSteps: [
          'A recruiter or hiring manager will reach out to schedule a 20-30 minute call',
          'Be prepared to discuss your background, experience, and career goals',
          'Feel free to prepare any questions you have about ApexStack Cloud or the role',
        ],
        closing: `We are excited about the possibility of having you on the team. If you have any scheduling constraints, just reply to this email.`,
        ctaText: null,
        ctaUrl: null,
      };

    case 'technical_interview':
      return {
        subject: `Technical interview next, ${firstName}!`,
        heading: `Time for the technical interview, ${firstName}!`,
        intro: `Great news! You have passed the phone screen and we would like to move forward with a technical interview. This is your chance to showcase your expertise.`,
        cardTitle: 'How to Prepare',
        nextSteps: [
          'The interview will focus on skills relevant to the role you applied for',
          'Be ready to discuss real-world scenarios and problem-solving approaches',
          'You may be asked to complete a brief technical exercise or case study',
          'Our interviewers are friendly and collaborative -- this is a conversation, not an interrogation',
        ],
        closing: `We will send you calendar details shortly. If you need to reschedule, reply to this email and we will accommodate.`,
        ctaText: null,
        ctaUrl: null,
      };

    case 'final_interview':
      return {
        subject: `Final interview -- you're almost there, ${firstName}!`,
        heading: `Final interview stage, ${firstName}!`,
        intro: `You have made it to the final round! This interview will be with senior leadership and is focused on cultural fit, career alignment, and mutual expectations.`,
        cardTitle: 'What to Expect',
        nextSteps: [
          'This is typically a 30-45 minute conversation with a senior team member',
          'We want to understand your long-term goals and how they align with ours',
          'Come prepared with questions about our culture, growth, and team dynamics',
          'Be yourself -- we are looking for authentic people who share our values',
        ],
        closing: `You have done incredibly well to get here. We are genuinely excited about your candidacy.`,
        ctaText: null,
        ctaUrl: null,
      };

    case 'offer_extended':
      return {
        subject: `Congratulations, ${firstName}! We have an offer for you`,
        heading: `Congratulations, ${firstName}!`,
        intro: `We are thrilled to let you know that we would like to extend an offer to join ApexStack Cloud. You stood out throughout the interview process and we believe you will be a fantastic addition to our team.`,
        cardTitle: 'Next Steps',
        nextSteps: [
          'You will receive a formal offer letter with full details via email shortly',
          'Take your time reviewing the terms -- we want you to feel confident in your decision',
          'A member of our team will schedule a call to walk through the offer and answer any questions',
        ],
        closing: `We hope you are as excited as we are. If you have any immediate questions, do not hesitate to reach out.`,
        ctaText: null,
        ctaUrl: null,
      };

    case 'hired':
      return {
        subject: `Welcome to the team, ${firstName}!`,
        heading: `Welcome to ApexStack Cloud, ${firstName}!`,
        intro: `We are absolutely delighted to welcome you to the ApexStack Cloud family! Your talent, experience, and enthusiasm made you the ideal candidate, and we cannot wait to work together.`,
        cardTitle: 'Onboarding Preview',
        nextSteps: [
          'Our People & Culture team will reach out with onboarding details and start date logistics',
          'You will receive access to our internal tools, communication channels, and documentation',
          'Your manager will schedule a welcome call to introduce the team and outline your first 30 days',
          'We will set up your equipment and accounts before your first day',
        ],
        closing: `Once again, welcome aboard. The entire team is looking forward to meeting you!`,
        ctaText: 'Visit Our Website',
        ctaUrl: 'https://apexstackcloud.com',
      };

    case 'not_selected':
      return {
        subject: `Thank you for your interest, ${firstName}`,
        heading: `Thank you, ${firstName}`,
        intro: `After careful consideration, we have decided to move forward with another candidate for this position. This was not an easy decision, as we were genuinely impressed by your background and experience.`,
        cardTitle: 'What This Means',
        nextSteps: [
          'This decision does not reflect on your abilities -- the competition was exceptionally strong',
          'We encourage you to apply for future openings that match your skills',
          'We will keep your application on file and may reach out for future opportunities',
        ],
        closing: `We truly appreciate the time and effort you invested in our process. We wish you all the best in your career.`,
        ctaText: 'View Open Positions',
        ctaUrl: 'https://apexstackcloud.com/careers.html',
      };

    default:
      return {
        subject: `Update on your application, ${firstName}`,
        heading: `Application update, ${firstName}`,
        intro: `We wanted to let you know that there has been an update on your application at ApexStack Cloud. Our team is continuing to review candidates and we will be in touch with more details soon.`,
        cardTitle: 'Next Steps',
        nextSteps: [
          'Our hiring team is actively reviewing applications',
          'We will provide a more detailed update shortly',
          'If you have questions, reply to this email anytime',
        ],
        closing: `Thank you for your patience and continued interest in ApexStack Cloud.`,
        ctaText: null,
        ctaUrl: null,
      };
  }
}
