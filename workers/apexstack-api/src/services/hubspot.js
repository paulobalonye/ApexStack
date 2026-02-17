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

  const { name, email, company, phone, role, score, level } = leadData;
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // First, try to create the contact
  const properties = {
    email: email,
    firstname: firstName,
    lastname: lastName,
    company: company,
    phone: phone || '',
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

/* ============================================
   HubSpot Deal Pipeline Automation
   Creates a deal based on assessment score
   ============================================ */

function getDealStage(score) {
  // Default HubSpot pipeline stages
  if (score <= 30) return 'qualifiedtobuy';          // Qualification
  if (score <= 60) return 'presentationscheduled';    // Discovery
  if (score <= 80) return 'decisionmakerboughtin';    // Proposal
  return 'contractsent';                               // Decision
}

export async function createHubSpotDeal(leadData, contactId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;

  if (!token || !contactId) {
    return { skipped: true, reason: 'No token or contact ID' };
  }

  const { company, score, level } = leadData;

  const dealProperties = {
    dealname: `${company} - Cloud Readiness Assessment`,
    dealstage: getDealStage(score),
    pipeline: 'default',
    amount: '30000',
    description: `Cloud Readiness Score: ${score}/100 (${level}). Auto-created from assessment.`,
  };

  try {
    const createResponse = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties: dealProperties }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.json();
      throw new Error(`HubSpot deal create failed: ${JSON.stringify(err)}`);
    }

    const dealData = await createResponse.json();

    // Associate deal with contact
    try {
      await fetch(`${HUBSPOT_API}/crm/v3/objects/deals/${dealData.id}/associations/contacts/${contactId}/3`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (assocErr) {
      console.error('HubSpot deal-contact association error:', assocErr);
    }

    return { dealId: dealData.id, stage: getDealStage(score) };
  } catch (err) {
    console.error('HubSpot deal creation error:', err);
    return { success: false, error: err.message };
  }
}
