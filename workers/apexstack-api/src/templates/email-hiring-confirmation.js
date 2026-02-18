/* ============================================
   Job Application Confirmation Email
   Sent immediately when someone applies
   via the careers form
   ============================================ */

export function buildApplicationConfirmationEmail(applicationData) {
  const { firstName, position } = applicationData;

  const positionLabels = {
    'tech-sales': 'Tech Sales Representative',
    'devops-engineer': 'DevOps Engineer',
    'customer-success': 'Customer Success Manager',
    'cloud-architect': 'Cloud Solutions Architect',
    'security-engineer': 'Security Engineer',
  };

  const positionLabel = positionLabels[position] || position;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
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
              We received your application, ${firstName}!
            </td>
          </tr>
          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              Thank you for your interest in the <strong style="color: #ffffff;">${positionLabel}</strong> position at ApexStack Cloud. We are excited to learn more about you and will review your application carefully.
            </td>
          </tr>
          <!-- What happens next card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">What happens next</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">1.</strong> Our hiring team reviews your application (typically 3-5 business days)</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">2.</strong> If your profile matches, we will reach out to schedule a phone screen</td></tr>
                      <tr><td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;"><strong style="color: #b8e600;">3.</strong> We will keep you updated on the status of your application at every stage</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #b8e600; border-radius: 8px;">
                    <a href="https://apexstackcloud.com/careers.html" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: 700; text-decoration: none;">View All Open Positions</a>
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
                <a href="https://apexstackcloud.com" style="color: #b8e600; text-decoration: none;">apexstackcloud.com</a>
              </div>
              <div style="color: #4b5563; font-size: 11px; margin-top: 12px;">
                This is an automated confirmation for your job application.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
