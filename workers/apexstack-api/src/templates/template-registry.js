/* ============================================
   Template Registry
   Central catalog of all email templates with
   metadata, variables, sample data, and default
   builder function references.
   ============================================ */

// Assessment templates
import { buildScoreEmail } from './email1-score.js';
import { buildMistakesEmail } from './email2-mistakes.js';
import { buildCaseStudyEmail } from './email3-casestudy.js';
import { buildOfferEmail } from './email4-offer.js';
import { buildRedUrgentEmail } from './email-red-urgent.js';
import { buildRedActionEmail } from './email-red-action.js';
import { buildRedOfferEmail } from './email-red-offer.js';
import { buildGreenPartnershipEmail } from './email-green-partnership.js';
import { buildGreenAdvancedEmail } from './email-green-advanced.js';

// Contact templates
import { buildContactConfirmationEmail } from './email-contact-confirmation.js';
import { buildContactNurture2Email } from './email-contact-nurture2.js';
import { buildContactNurture3Email } from './email-contact-nurture3.js';
import { buildContactNurture4Email } from './email-contact-nurture4.js';

// Meeting templates
import { buildMeetingBookedEmail } from './email-meeting-booked.js';
import { buildNoShowEmail } from './email-no-show.js';
import { buildPostMeetingEmail } from './email-post-meeting.js';

// Hiring templates
import { buildApplicationConfirmationEmail } from './email-hiring-confirmation.js';
import { buildHiringStageEmail } from './email-hiring-stages.js';

// Lifecycle templates
import { buildWelcomeEmail } from './email-welcome.js';
import { buildBirthdayEmail } from './email-birthday.js';
import { buildWorkAnniversaryEmail } from './email-work-anniversary.js';
import { buildClientAnniversaryEmail } from './email-client-anniversary.js';
import { buildContractRenewalEmail } from './email-contract-renewal.js';
import { buildHolidayEmail } from './email-holiday.js';
import { buildNewsletterEmail } from './email-newsletter.js';
import { buildSeasonalQ1Email } from './email-seasonal-q1.js';
import { buildSeasonalQ2Email } from './email-seasonal-q2.js';
import { buildSeasonalQ3Email } from './email-seasonal-q3.js';
import { buildSeasonalQ4Email } from './email-seasonal-q4.js';

const SAMPLE_UNSUB_URL = 'https://apexstackcloud.com/api/unsubscribe?email=test@example.com&token=sample';

export const TEMPLATE_REGISTRY = {

  // =========== ASSESSMENT DRIP (9) ===========

  'email1-score': {
    name: 'Assessment Score Email',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Sent immediately after assessment submission',
    subjectTemplate: 'Your Cloud Readiness Score: {{score}}/100',
    variables: ['name', 'firstName', 'score', 'level', 'categoryPct_architecture', 'categoryPct_security', 'categoryPct_deployment', 'categoryPct_monitoring', 'categoryPct_cost', 'risks', 'recs', 'unsubUrl'],
    sampleData: {
      name: 'John Doe',
      firstName: 'John',
      score: 45,
      level: 'Needs Improvement',
      categoryPct: { architecture: 60, security: 40, deployment: 50, monitoring: 30, cost: 55 },
      risks: ['No infrastructure-as-code practices', 'Single point of failure in database', 'No disaster recovery plan'],
      recs: ['Implement Terraform for IaC', 'Set up database replication', 'Create DR runbook'],
      unsubUrl: SAMPLE_UNSUB_URL,
    },
    buildDefault: (vars) => buildScoreEmail(vars),
  },

  'email2-mistakes': {
    name: '3 Cloud Mistakes (Yellow Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 2 — Yellow tier (score 31-60)',
    subjectTemplate: '{{firstName}}, 3 cloud mistakes that cost fintech startups millions',
    variables: ['name', 'firstName', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildMistakesEmail(vars),
  },

  'email3-casestudy': {
    name: 'HitchPay Case Study',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 5-7 — Shared across tiers',
    subjectTemplate: 'How a Series B fintech cut cloud costs 47% in 90 days',
    variables: ['name', 'firstName', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildCaseStudyEmail(vars),
  },

  'email4-offer': {
    name: 'Free Architecture Review (Yellow Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 10 — Yellow tier (score 31-60)',
    subjectTemplate: '{{firstName}}, claim your free cloud architecture review',
    variables: ['name', 'firstName', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildOfferEmail(vars),
  },

  'email-red-urgent': {
    name: 'Critical Risk Alert (Red Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 1 — Red tier (score 0-30)',
    subjectTemplate: '{{firstName}}, your infrastructure is at critical risk',
    variables: ['name', 'firstName', 'score', 'risks', 'unsubUrl'],
    sampleData: {
      name: 'John Doe', firstName: 'John', score: 22,
      risks: ['No IAM policies', 'No encryption at rest', 'Single AZ deployment'],
      unsubUrl: SAMPLE_UNSUB_URL,
    },
    buildDefault: (vars) => buildRedUrgentEmail(vars),
  },

  'email-red-action': {
    name: '3 Things to Fix This Week (Red Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 3 — Red tier (score 0-30)',
    subjectTemplate: '{{firstName}}, 3 things to fix this week',
    variables: ['name', 'firstName', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildRedActionEmail(vars),
  },

  'email-red-offer': {
    name: 'Emergency Audit 50% Off (Red Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 14 — Red tier (score 0-30)',
    subjectTemplate: '{{firstName}}, exclusive: emergency cloud audit — 50% off',
    variables: ['name', 'firstName', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildRedOfferEmail(vars),
  },

  'email-green-partnership': {
    name: 'Strategic Partnership (Green Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 3 — Green tier (score 61-100)',
    subjectTemplate: "{{firstName}}, you're ahead of 90% of companies",
    variables: ['name', 'firstName', 'score', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', score: 78, unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildGreenPartnershipEmail(vars),
  },

  'email-green-advanced': {
    name: 'Advanced Topics (Green Tier)',
    category: 'assessment',
    recipientType: 'lead',
    triggerDescription: 'Day 7 — Green tier (score 61-100)',
    subjectTemplate: 'Next-level: chaos engineering & FinOps',
    variables: ['name', 'firstName', 'unsubUrl'],
    sampleData: { name: 'John Doe', firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildGreenAdvancedEmail(vars),
  },

  // =========== CONTACT NURTURE (4) ===========

  'email-contact-confirmation': {
    name: 'Contact Form Confirmation',
    category: 'contact',
    recipientType: 'lead',
    triggerDescription: 'Sent immediately after contact form submission',
    subjectTemplate: 'Thanks for reaching out, {{firstName}}!',
    variables: ['firstName', 'lastName', 'serviceInterest'],
    sampleData: { firstName: 'Jane', lastName: 'Smith', serviceInterest: 'cloud-strategy' },
    buildDefault: (vars) => buildContactConfirmationEmail(vars),
  },

  'email-contact-nurture2': {
    name: 'Assessment CTA (Day 2)',
    category: 'contact',
    recipientType: 'lead',
    triggerDescription: 'Day 2 — Contact nurture sequence',
    subjectTemplate: '{{firstName}}, get your free Cloud Readiness Score',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Jane', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildContactNurture2Email(vars),
  },

  'email-contact-nurture3': {
    name: 'Case Study (Day 5)',
    category: 'contact',
    recipientType: 'lead',
    triggerDescription: 'Day 5 — Contact nurture sequence',
    subjectTemplate: 'How a fintech transformed their cloud in 90 days',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Jane', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildContactNurture3Email(vars),
  },

  'email-contact-nurture4': {
    name: 'Industry Trends (Day 10)',
    category: 'contact',
    recipientType: 'lead',
    triggerDescription: 'Day 10 — Contact nurture sequence',
    subjectTemplate: '{{firstName}}, what companies like yours are doing with cloud',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Jane', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildContactNurture4Email(vars),
  },

  // =========== MEETING & SALES (10) ===========

  'email-meeting-booked': {
    name: 'Meeting Booked Confirmation',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot webhook: meeting booked',
    subjectTemplate: 'Looking forward to our call, {{firstName}}!',
    variables: ['firstName', 'meetingDate', 'unsubUrl'],
    sampleData: { firstName: 'Alex', meetingDate: '2026-02-25T14:00:00Z', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildMeetingBookedEmail(vars),
  },

  'email-no-show': {
    name: 'No-Show Follow-Up',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'Cron + webhook: missed meeting',
    subjectTemplate: 'We missed you, {{firstName}} — let\'s reschedule',
    variables: ['firstName', 'rescheduleLink', 'unsubUrl'],
    sampleData: { firstName: 'Alex', rescheduleLink: 'http://meeting.apexstackcloud.com/meetings/apexstack', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildNoShowEmail(vars),
  },

  'post-meeting:appointmentscheduled': {
    name: 'Post-Meeting: Appointment Scheduled',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Appointment Scheduled',
    subjectTemplate: 'Your consultation is confirmed, {{firstName}}!',
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'appointmentscheduled', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  'post-meeting:qualifiedtobuy': {
    name: 'Post-Meeting: Qualified to Buy',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Qualified to Buy',
    subjectTemplate: "Great news, {{firstName}} — here's your custom roadmap",
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'qualifiedtobuy', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  'post-meeting:meeting_completed': {
    name: 'Post-Meeting: Meeting Completed',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Meeting Completed',
    subjectTemplate: 'Great meeting, {{firstName}} — next steps inside',
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'meeting_completed', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  'post-meeting:proposal_sent': {
    name: 'Post-Meeting: Proposal Sent',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Proposal Sent',
    subjectTemplate: '{{firstName}}, your proposal is ready',
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'proposal_sent', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  'post-meeting:negotiation': {
    name: 'Post-Meeting: Negotiation',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Negotiation',
    subjectTemplate: "{{firstName}}, let's finalize your cloud strategy",
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'negotiation', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  'post-meeting:closedwon': {
    name: 'Post-Meeting: Closed Won',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Closed Won',
    subjectTemplate: 'Welcome aboard, {{firstName}}!',
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'closedwon', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  'post-meeting:closedlost': {
    name: 'Post-Meeting: Closed Lost',
    category: 'meeting',
    recipientType: 'lead',
    triggerDescription: 'HubSpot deal stage: Closed Lost',
    subjectTemplate: 'Thank you for considering us, {{firstName}}',
    variables: ['firstName', 'companyName', 'meetingSummary', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', dealStage: 'closedlost', meetingSummary: '', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildPostMeetingEmail(vars),
  },

  // =========== HIRING PIPELINE (9) ===========

  'email-hiring-confirmation': {
    name: 'Application Confirmation',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'Sent immediately after job application',
    subjectTemplate: "Application received — {{firstName}}, we're excited to review it!",
    variables: ['firstName', 'position'],
    sampleData: { firstName: 'Sarah', position: 'cloud-architect' },
    buildDefault: (vars) => buildApplicationConfirmationEmail(vars),
  },

  'hiring:application_received': {
    name: 'Hiring: Application Received',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Application Received',
    subjectTemplate: 'We received your application, {{firstName}}!',
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'application_received', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:resume_screening': {
    name: 'Hiring: Resume Screening',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Resume Screening',
    subjectTemplate: "{{firstName}}, we're reviewing your resume",
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'resume_screening', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:phone_interview': {
    name: 'Hiring: Phone Interview',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Phone Interview',
    subjectTemplate: "{{firstName}}, you've been selected for a phone interview!",
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'phone_interview', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:technical_interview': {
    name: 'Hiring: Technical Interview',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Technical Interview',
    subjectTemplate: '{{firstName}}, your technical interview is next!',
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'technical_interview', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:final_interview': {
    name: 'Hiring: Final Interview',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Final Interview',
    subjectTemplate: "{{firstName}}, you're in the final round!",
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'final_interview', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:offer_extended': {
    name: 'Hiring: Offer Extended',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Offer Extended',
    subjectTemplate: '{{firstName}}, we have an offer for you!',
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'offer_extended', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:hired': {
    name: 'Hiring: Hired',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Hired',
    subjectTemplate: 'Welcome to the team, {{firstName}}!',
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'hired', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  'hiring:not_selected': {
    name: 'Hiring: Not Selected',
    category: 'hiring',
    recipientType: 'applicant',
    triggerDescription: 'HubSpot hiring pipeline: Not Selected',
    subjectTemplate: 'Update on your application, {{firstName}}',
    variables: ['firstName', 'positionName', 'unsubUrl'],
    sampleData: { firstName: 'Sarah', positionName: 'Cloud Solutions Architect', hiringStage: 'not_selected', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHiringStageEmail(vars),
  },

  // =========== INTERNAL ALERTS (4) ===========

  'internal-contact-forward': {
    name: 'Internal: New Contact Alert',
    category: 'internal',
    recipientType: 'team',
    triggerDescription: 'Sent to team when contact form is submitted',
    subjectTemplate: 'New Contact: {{firstName}} {{lastName}} — {{company}}',
    variables: ['firstName', 'lastName', 'email', 'phone', 'company', 'serviceInterest', 'message', 'submittedAt'],
    sampleData: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+1234567890', company: 'Acme Corp', serviceInterest: 'cloud-strategy', message: 'We need help migrating to AWS.', submittedAt: new Date().toISOString() },
    buildDefault: null, // Inline in resend.js
  },

  'internal-assessment-alert': {
    name: 'Internal: Assessment Submission Alert',
    category: 'internal',
    recipientType: 'team',
    triggerDescription: 'Sent to team when assessment is submitted',
    subjectTemplate: '{{tier_emoji}} {{tier_label}} Lead: {{name}} ({{company}}) — Score {{score}}/100',
    variables: ['name', 'email', 'company', 'phone', 'role', 'score', 'level', 'categoryPct_architecture', 'categoryPct_security', 'categoryPct_deployment', 'categoryPct_monitoring', 'categoryPct_cost', 'risks'],
    sampleData: { name: 'John Doe', email: 'john@example.com', company: 'FinTech Co', phone: '+1234567890', role: 'CTO', score: 45, level: 'Needs Improvement', categoryPct: { architecture: 60, security: 40, deployment: 50, monitoring: 30, cost: 55 }, risks: ['No IaC', 'Single AZ', 'No DR plan'] },
    buildDefault: null, // Inline in resend.js
  },

  'internal-hot-lead': {
    name: 'Internal: Hot Lead Escalation',
    category: 'internal',
    recipientType: 'team',
    triggerDescription: 'Triggered when contact has 3+ opens AND 1+ click in 7 days',
    subjectTemplate: 'Hot Lead Alert: {{name}} ({{email}})',
    variables: ['name', 'email', 'company', 'score', 'recentOpens', 'recentClicks', 'opens'],
    sampleData: { name: 'John Doe', email: 'john@example.com', company: 'FinTech Co', score: 45, recentOpens: 5, recentClicks: 2, opens: 12 },
    buildDefault: null, // Inline in resend.js
  },

  'internal-application-forward': {
    name: 'Internal: New Application Alert',
    category: 'internal',
    recipientType: 'team',
    triggerDescription: 'Sent to team when job application is submitted',
    subjectTemplate: 'New Application: {{firstName}} {{lastName}} — {{positionLabel}}',
    variables: ['firstName', 'lastName', 'email', 'phone', 'position', 'linkedinUrl', 'portfolioUrl', 'coverLetter', 'submittedAt'],
    sampleData: { firstName: 'Sarah', lastName: 'Connor', email: 'sarah@example.com', phone: '+1234567890', position: 'cloud-architect', linkedinUrl: 'https://linkedin.com/in/sarahconnor', portfolioUrl: 'https://github.com/sarahconnor', coverLetter: 'I am excited to apply for this role...', submittedAt: new Date().toISOString() },
    buildDefault: null, // Inline in resend.js
  },

  // =========== CLIENT LIFECYCLE (13) ===========

  'email-welcome': {
    name: 'Welcome / Onboarding',
    category: 'lifecycle',
    recipientType: 'client',
    triggerDescription: 'Deal stage: Closed Won',
    subjectTemplate: 'Welcome to ApexStack Cloud, {{firstName}}!',
    variables: ['firstName', 'companyName', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildWelcomeEmail(vars),
  },

  'email-contract-renewal': {
    name: 'Contract Renewal Reminder',
    category: 'lifecycle',
    recipientType: 'client',
    triggerDescription: 'Cron: 90/60/30 days before contract expiry',
    subjectTemplate: 'Contract renewal reminder — {{daysUntilExpiry}} days remaining',
    variables: ['firstName', 'companyName', 'daysUntilExpiry', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', daysUntilExpiry: 60, unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildContractRenewalEmail(vars),
  },

  'email-client-anniversary': {
    name: 'Client Anniversary',
    category: 'lifecycle',
    recipientType: 'client',
    triggerDescription: 'Cron: annual client anniversary',
    subjectTemplate: 'Happy anniversary, {{firstName}}!',
    variables: ['firstName', 'companyName', 'yearsCount', 'unsubUrl'],
    sampleData: { firstName: 'Alex', companyName: 'FinTech Co', yearsCount: 2, unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildClientAnniversaryEmail(vars),
  },

  'email-work-anniversary': {
    name: 'Work Anniversary',
    category: 'lifecycle',
    recipientType: 'team',
    triggerDescription: 'Cron: annual work anniversary',
    subjectTemplate: 'Happy work anniversary, {{firstName}}!',
    variables: ['firstName', 'yearsCount', 'unsubUrl'],
    sampleData: { firstName: 'Marcus', yearsCount: 1, unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildWorkAnniversaryEmail(vars),
  },

  'email-birthday': {
    name: 'Birthday Greeting',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: contact birthday',
    subjectTemplate: 'Happy birthday, {{firstName}}!',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Alex', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildBirthdayEmail(vars),
  },

  'email-holiday': {
    name: 'Holiday Greeting',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: holiday greetings',
    subjectTemplate: 'Happy {{holidayName}} from ApexStack Cloud!',
    variables: ['firstName', 'holidayName', 'holidayMessage', 'unsubUrl'],
    sampleData: { firstName: 'Alex', holidayName: 'New Year', holidayMessage: 'Wishing you a wonderful start to the new year!', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildHolidayEmail(vars),
  },

  'email-newsletter': {
    name: 'Monthly Newsletter',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: first of each month',
    subjectTemplate: 'ApexStack Cloud — {{month}} {{year}} Newsletter',
    variables: ['firstName', 'month', 'year', 'tip_title', 'tip_body', 'trend_title', 'trend_body', 'companyUpdate', 'unsubUrl'],
    sampleData: {
      firstName: 'Alex', month: 'February', year: '2026',
      tip: { title: 'Optimize Your Cloud Costs', body: 'Review your reserved instances quarterly to avoid overpaying.' },
      trend: { title: 'AI-Driven Infrastructure', body: 'More teams are using AI to auto-scale and predict failures.' },
      companyUpdate: 'We just launched our new Kubernetes managed service!',
      unsubUrl: SAMPLE_UNSUB_URL,
    },
    buildDefault: (vars) => buildNewsletterEmail(vars),
  },

  'email-seasonal-q1': {
    name: 'Seasonal: Q1',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: Q1 quarterly email',
    subjectTemplate: 'Start the year strong — Q1 cloud insights',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Alex', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildSeasonalQ1Email(vars),
  },

  'email-seasonal-q2': {
    name: 'Seasonal: Q2',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: Q2 quarterly email',
    subjectTemplate: 'Mid-year cloud check-in — Q2 insights',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Alex', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildSeasonalQ2Email(vars),
  },

  'email-seasonal-q3': {
    name: 'Seasonal: Q3',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: Q3 quarterly email',
    subjectTemplate: 'Q3 cloud trends — what you need to know',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Alex', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildSeasonalQ3Email(vars),
  },

  'email-seasonal-q4': {
    name: 'Seasonal: Q4',
    category: 'lifecycle',
    recipientType: 'contact',
    triggerDescription: 'Cron: Q4 quarterly email',
    subjectTemplate: 'Year-end cloud planning — Q4 insights',
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'Alex', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: (vars) => buildSeasonalQ4Email(vars),
  },

  'reengagement-cold': {
    name: 'Re-engagement: Cold',
    category: 'lifecycle',
    recipientType: 'lead',
    triggerDescription: 'Cron: 30+ days dormant, no recent engagement',
    subjectTemplate: "{{firstName}}, your free cloud review is still available",
    variables: ['firstName', 'unsubUrl'],
    sampleData: { firstName: 'John', unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: null, // Inline in resend.js
  },

  'reengagement-warm': {
    name: 'Re-engagement: Warm',
    category: 'lifecycle',
    recipientType: 'lead',
    triggerDescription: 'Cron: 30+ days, but 1+ recent email opens',
    subjectTemplate: '{{firstName}}, still thinking about your cloud strategy?',
    variables: ['firstName', 'score', 'unsubUrl'],
    sampleData: { firstName: 'John', score: 45, unsubUrl: SAMPLE_UNSUB_URL },
    buildDefault: null, // Inline in resend.js
  },
};

// Helper: Get all template keys
export function getAllTemplateKeys() {
  return Object.keys(TEMPLATE_REGISTRY);
}

// Helper: Get default HTML for a template key
export function getDefaultHtml(templateKey) {
  const entry = TEMPLATE_REGISTRY[templateKey];
  if (!entry || !entry.buildDefault) return null;
  try {
    return entry.buildDefault(entry.sampleData);
  } catch (err) {
    console.error(`Error building default for ${templateKey}:`, err);
    return null;
  }
}

// Helper: Get registry entry
export function getRegistryEntry(templateKey) {
  return TEMPLATE_REGISTRY[templateKey] || null;
}
