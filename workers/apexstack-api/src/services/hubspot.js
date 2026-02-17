/* ============================================
   HubSpot CRM Service
   Creates or updates a contact with assessment
   data, score, and readiness level
   ============================================ */

const HUBSPOT_API = 'https://api.hubapi.com';

export async function createHubSpotContact(leadData, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;

  if (!token) {
    console.warn('HubSpot: No access token configured, skipping');
    return { skipped: true, reason: 'No HUBSPOT_ACCESS_TOKEN configured' };
  }

  const { name, email, company, role, score, level } = leadData;
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // First, try to create the contact
  const properties = {
    email: email,
    firstname: firstName,
    lastname: lastName,
    company: company,
    jobtitle: role,
    cloud_readiness_score: String(score),
    cloud_readiness_level: level,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
  };

  // Try create first
  const createResponse = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  });

  const createData = await createResponse.json();

  // If contact already exists (409 conflict), update instead
  if (createResponse.status === 409) {
    // Extract existing contact ID from the error
    const existingId = createData?.message?.match(/Existing ID:\s*(\d+)/)?.[1];

    if (existingId) {
      const updateResponse = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            cloud_readiness_score: String(score),
            cloud_readiness_level: level,
            company: company,
            jobtitle: role,
          }
        }),
      });

      if (!updateResponse.ok) {
        const updateErr = await updateResponse.json();
        throw new Error(`HubSpot update failed: ${JSON.stringify(updateErr)}`);
      }

      return { action: 'updated', contactId: existingId };
    }
  }

  if (!createResponse.ok && createResponse.status !== 409) {
    throw new Error(`HubSpot create failed: ${createResponse.status} - ${JSON.stringify(createData)}`);
  }

  return { action: 'created', contactId: createData.id };
}
