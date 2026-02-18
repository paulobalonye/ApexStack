/* ============================================
   Contact Form Auto-Reply Email
   Sent immediately when someone submits
   the contact form on apexstackcloud.com
   ============================================ */

export function buildContactConfirmationEmail(contactData) {
  const { firstName, lastName, serviceInterest } = contactData;

  const serviceLabels = {
    'cloud-strategy': 'Cloud Strategy',
    'migration': 'Migration & Foundation',
    'modernization': 'Innovation & Modernization',
    'managed': 'Managed Services',
    'other': 'Other',
  };

  const serviceLabel = serviceLabels[serviceInterest] || '';
  const serviceNote = serviceLabel
    ? `<p style="color: #9ca3af; font-size: 14px; line-height: 1.7; padding-bottom: 16px;">You mentioned interest in <strong style="color: #ffffff;">${serviceLabel}</strong> — we'll make sure the right specialist reaches out.</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out</title>
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
              Thanks for reaching out, ${firstName}!
            </td>
          </tr>

          <tr>
            <td style="color: #9ca3af; font-size: 15px; line-height: 1.7; padding-bottom: 24px;">
              We've received your message and one of our cloud engineering specialists will get back to you within <strong style="color: #ffffff;">one business day</strong>.
            </td>
          </tr>

          ${serviceNote}

          <!-- What to expect -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #111111; border-radius: 12px; border: 1px solid #222222;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color: #b8e600; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 16px;">What happens next</div>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">1.</strong> Our team reviews your inquiry and assigns the right specialist
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">2.</strong> You'll receive a personalized response within 24 hours
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #b8e600;">3.</strong> If needed, we'll schedule a discovery call to understand your requirements
                        </td>
                      </tr>
                    </table>
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
                    <div style="color: #ffffff; font-size: 18px; font-weight: 700; padding-bottom: 8px;">Can't wait? Book a call now</div>
                    <div style="color: #9ca3af; font-size: 14px; line-height: 1.6; padding-bottom: 20px;">
                      Skip the queue and book a free strategy session directly with one of our cloud architects.
                    </div>
                    <a href="http://meeting.apexstackcloud.com/meetings/apexstack" style="display: inline-block; background: #b8e600; color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.3px;">
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
                This is an automated confirmation for your contact form submission.
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
