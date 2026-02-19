/* ============================================
   HubSpot CRM Service
   - Contact creation/update with category scores
   - Custom property management
   - Deal pipeline with deduplication
   - Engagement sync from email events
   ============================================ */

const HUBSPOT_API = 'https://api.hubapi.com';

/* ============================================
   Custom Properties Setup
   Creates category score + engagement properties
   on first use. Idempotent (409 = already exists).
   ============================================ */

const CUSTOM_PROPERTIES = [
  // Category score properties (Feature 1)
  { name: 'cloud_architecture_pct', label: 'Cloud Architecture %', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Architecture & IaC assessment score percentage' },
  { name: 'cloud_security_pct', label: 'Cloud Security %', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Security & Compliance assessment score percentage' },
  { name: 'cloud_deployment_pct', label: 'Cloud Deployment %', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Deployment & DevOps assessment score percentage' },
  { name: 'cloud_monitoring_pct', label: 'Cloud Monitoring %', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Monitoring & Reliability assessment score percentage' },
  { name: 'cloud_cost_pct', label: 'Cloud Cost %', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Cost Optimization assessment score percentage' },
  // Engagement properties (Feature 5)
  { name: 'email_opens_count', label: 'Email Opens', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Total email opens from Resend' },
  { name: 'email_clicks_count', label: 'Email Clicks', type: 'number', fieldType: 'number', groupName: 'contactinformation', description: 'Total email link clicks from Resend' },
  { name: 'email_engagement_level', label: 'Email Engagement', type: 'string', fieldType: 'text', groupName: 'contactinformation', description: 'Engagement tier: hot, warm, or cold' },
  // Service interest property (Feature 2 - Contact form gap)
  { name: 'service_interest', label: 'Service Interest', type: 'string', fieldType: 'text', groupName: 'contactinformation', description: 'Service interest from contact form submission' },
  // Date properties for lifecycle emails (HubSpot Starter — no property limit)
  { name: 'contract_end_date', label: 'Contract End Date', type: 'date', fieldType: 'date', groupName: 'contactinformation', description: 'Contract renewal date for reminder emails' },
  { name: 'client_start_date', label: 'Client Start Date', type: 'date', fieldType: 'date', groupName: 'contactinformation', description: 'Date client relationship began' },
  { name: 'employee_hire_date', label: 'Employee Hire Date', type: 'date', fieldType: 'date', groupName: 'contactinformation', description: 'Employee hire date for work anniversary emails' },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', fieldType: 'date', groupName: 'contactinformation', description: 'Birthday for greeting emails' },
];

let propertiesEnsured = false;

export async function ensureCustomProperties(env) {
  if (propertiesEnsured) return;
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return;

  let allSucceeded = true;
  for (const prop of CUSTOM_PROPERTIES) {
    try {
      const res = await fetch(`${HUBSPOT_API}/crm/v3/properties/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prop),
      });
      if (res.status === 409) {
        // Property already exists — that's fine
      } else if (!res.ok) {
        const err = await res.json();
        console.warn(`HubSpot: Could not create property ${prop.name}:`, err.message || err);
        allSucceeded = false;
      }
    } catch (err) {
      console.warn(`HubSpot: Property creation error for ${prop.name}:`, err.message);
      allSucceeded = false;
    }
  }
  // Only mark as ensured if all properties created or already exist
  propertiesEnsured = allSucceeded;
}

/* ============================================
   Contact Creation / Update
   Now includes category % scores
   ============================================ */

export async function createHubSpotContact(leadData, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;

  if (!token) {
    console.warn('HubSpot: No access token configured, skipping');
    return { skipped: true, reason: 'No HUBSPOT_ACCESS_TOKEN configured' };
  }

  // Ensure custom properties exist (first call only)
  await ensureCustomProperties(env);

  const { name, email, company, phone, role, score, level, categoryPct } = leadData;
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Build properties including category scores
  const properties = {
    email: email,
    firstname: firstName,
    lastname: lastName,
    company: company,
    phone: phone || '',
    jobtitle: role,
    cloud_readiness_score: String(score),
    cloud_readiness_level: level,
    lifecyclestage: leadData.lifecyclestage || 'lead',
    hs_lead_status: 'NEW',
  };

  // Add category percentages if available (Feature 1)
  if (categoryPct) {
    if (categoryPct.architecture !== undefined) properties.cloud_architecture_pct = String(categoryPct.architecture);
    if (categoryPct.security !== undefined) properties.cloud_security_pct = String(categoryPct.security);
    if (categoryPct.deployment !== undefined) properties.cloud_deployment_pct = String(categoryPct.deployment);
    if (categoryPct.monitoring !== undefined) properties.cloud_monitoring_pct = String(categoryPct.monitoring);
    if (categoryPct.cost !== undefined) properties.cloud_cost_pct = String(categoryPct.cost);
  }

  // Add service interest if available (Feature 2 - Contact form gap)
  if (leadData.serviceInterest) {
    properties.service_interest = leadData.serviceInterest;
  }

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
    const existingId = createData?.message?.match(/Existing ID:\s*(\d+)/)?.[1];

    if (existingId) {
      // Update with all score-related fields
      const updateProps = {
        cloud_readiness_score: String(score),
        cloud_readiness_level: level,
        company: company,
        jobtitle: role,
      };
      // Also update category scores on update
      if (categoryPct) {
        if (categoryPct.architecture !== undefined) updateProps.cloud_architecture_pct = String(categoryPct.architecture);
        if (categoryPct.security !== undefined) updateProps.cloud_security_pct = String(categoryPct.security);
        if (categoryPct.deployment !== undefined) updateProps.cloud_deployment_pct = String(categoryPct.deployment);
        if (categoryPct.monitoring !== undefined) updateProps.cloud_monitoring_pct = String(categoryPct.monitoring);
        if (categoryPct.cost !== undefined) updateProps.cloud_cost_pct = String(categoryPct.cost);
      }
      // Also update service interest on update
      if (leadData.serviceInterest) {
        updateProps.service_interest = leadData.serviceInterest;
      }

      const updateResponse = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: updateProps }),
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
   With deduplication (Feature 6)
   ============================================ */

const STAGE_PRIORITY = {
  'qualifiedtobuy': 1,
  'presentationscheduled': 2,
  'decisionmakerboughtin': 3,
  'contractsent': 4,
};

function getDealStage(score) {
  if (score <= 30) return 'qualifiedtobuy';
  if (score <= 60) return 'presentationscheduled';
  if (score <= 80) return 'decisionmakerboughtin';
  return 'contractsent';
}

async function getExistingDeal(contactId, env, pipelineId = 'default') {
  const token = env.HUBSPOT_ACCESS_TOKEN;

  try {
    // Search for deals associated with this contact, filtered by pipeline
    const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [
            {
              propertyName: 'associations.contact',
              operator: 'EQ',
              value: contactId,
            },
            {
              propertyName: 'pipeline',
              operator: 'EQ',
              value: pipelineId,
            },
          ],
        }],
        limit: 1,
        properties: ['dealname', 'dealstage', 'pipeline'],
      }),
    });

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) return null;
    return searchData.results[0];
  } catch (err) {
    console.error('HubSpot: Error fetching existing deal:', err);
    return null;
  }
}

export async function createHubSpotDeal(leadData, contactId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;

  if (!token || !contactId) {
    return { skipped: true, reason: 'No token or contact ID' };
  }

  const { company, score, level } = leadData;
  const newStage = getDealStage(score);

  try {
    // Feature 6: Check for existing deal to prevent duplicates (sales pipeline only)
    const existingDeal = await getExistingDeal(contactId, env, 'default');

    if (existingDeal) {
      const currentStage = existingDeal.properties?.dealstage;
      const currentPriority = STAGE_PRIORITY[currentStage] || 0;
      const newPriority = STAGE_PRIORITY[newStage] || 0;

      // Only advance stage, never regress
      if (newPriority > currentPriority) {
        const updateRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals/${existingDeal.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              dealstage: newStage,
              description: `Cloud Readiness Score: ${score}/100 (${level}). Updated from reassessment.`,
            },
          }),
        });

        if (!updateRes.ok) {
          const err = await updateRes.json();
          console.error('HubSpot deal update error:', err);
        }

        return { action: 'updated', dealId: existingDeal.id, stage: newStage, previousStage: currentStage };
      }

      // Stage is same or lower — skip update
      return { action: 'skipped', dealId: existingDeal.id, stage: currentStage, reason: 'Stage not advanced' };
    }

    // No existing deal — create a new one
    const dealProperties = {
      dealname: `${company} - Cloud Readiness Assessment`,
      dealstage: newStage,
      pipeline: 'default',
      amount: '30000',
      description: `Cloud Readiness Score: ${score}/100 (${level}). Auto-created from assessment.`,
    };

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

    // Associate deal with contact (v4 API for reliable association)
    try {
      const assocRes = await fetch(`${HUBSPOT_API}/crm/v4/objects/deals/${dealData.id}/associations/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]),
      });
      if (!assocRes.ok) {
        const assocErr = await assocRes.json();
        console.warn('HubSpot deal-contact association warning:', assocErr);
      }
    } catch (assocErr) {
      console.error('HubSpot deal-contact association error:', assocErr);
    }

    return { action: 'created', dealId: dealData.id, stage: newStage };
  } catch (err) {
    console.error('HubSpot deal error:', err);
    return { success: false, error: err.message };
  }
}

/* ============================================
   HubSpot Deal for Contact Form (Feature 4)
   Maps serviceInterest → deal stage,
   skips if any deal already exists (from
   assessment or prior contact submission)
   ============================================ */

function getContactDealStage(serviceInterest) {
  switch (serviceInterest) {
    case 'cloud-strategy':
    case 'managed':
      return 'qualifiedtobuy';
    case 'migration':
    case 'modernization':
      return 'presentationscheduled';
    default:
      return 'qualifiedtobuy';
  }
}

export async function createContactDeal(contactData, contactId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;

  if (!token || !contactId) {
    return { skipped: true, reason: 'No token or contact ID' };
  }

  const { company, serviceInterest } = contactData;
  const dealStage = getContactDealStage(serviceInterest);

  try {
    // Check for existing sales deal — don't overwrite assessment deals (only checks sales pipeline)
    const existingDeal = await getExistingDeal(contactId, env, 'default');
    if (existingDeal) {
      return { action: 'skipped', dealId: existingDeal.id, reason: 'Sales deal already exists' };
    }

    // Create new deal for contact form inquiry
    const dealProperties = {
      dealname: `${company || 'Unknown Company'} - Contact Form Inquiry`,
      dealstage: dealStage,
      pipeline: 'default',
      amount: '15000',
      description: `Contact form inquiry. Service interest: ${serviceInterest || 'Not specified'}. Auto-created from contact form.`,
    };

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
      throw new Error(`HubSpot contact deal create failed: ${JSON.stringify(err)}`);
    }

    const dealData = await createResponse.json();

    // Associate deal with contact (v4 API for reliable association)
    try {
      const assocRes = await fetch(`${HUBSPOT_API}/crm/v4/objects/deals/${dealData.id}/associations/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]),
      });
      if (!assocRes.ok) {
        const assocErr = await assocRes.json();
        console.warn('HubSpot contact deal association warning:', assocErr);
      }
    } catch (assocErr) {
      console.error('HubSpot contact deal-contact association error:', assocErr);
    }

    return { action: 'created', dealId: dealData.id, stage: dealStage };
  } catch (err) {
    console.error('HubSpot contact deal error:', err);
    return { success: false, error: err.message };
  }
}

/* ============================================
   HubSpot Deal for Job Application
   Creates a deal in the Hiring Pipeline
   with the initial "Application Received" stage
   ============================================ */

const HIRING_PIPELINE_ID = '2011005672';
const HIRING_FIRST_STAGE_ID = '3179253494'; // Application Received

const POSITION_LABELS = {
  'tech-sales': 'Tech Sales Representative',
  'devops-engineer': 'DevOps Engineer',
  'customer-success': 'Customer Success Manager',
  'cloud-architect': 'Cloud Solutions Architect',
  'security-engineer': 'Security Engineer',
};

export async function createHiringDeal(applicationData, contactId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token || !contactId) {
    return { skipped: true, reason: 'No token or contact ID' };
  }

  const { firstName, lastName, position } = applicationData;
  const positionLabel = POSITION_LABELS[position] || position;

  try {
    const dealProperties = {
      dealname: `${firstName} ${lastName} — ${positionLabel}`,
      dealstage: HIRING_FIRST_STAGE_ID,
      pipeline: HIRING_PIPELINE_ID,
      description: `Job application for ${positionLabel}. LinkedIn: ${applicationData.linkedinUrl || 'N/A'}. Portfolio: ${applicationData.portfolioUrl || 'N/A'}. Auto-created from careers form.`,
    };

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
      throw new Error(`HubSpot hiring deal create failed: ${JSON.stringify(err)}`);
    }

    const dealData = await createResponse.json();

    // Associate deal with contact
    try {
      await fetch(`${HUBSPOT_API}/crm/v4/objects/deals/${dealData.id}/associations/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]),
      });
    } catch (assocErr) {
      console.error('HubSpot hiring deal-contact association error:', assocErr);
    }

    return { action: 'created', dealId: dealData.id, stage: HIRING_FIRST_STAGE_ID, pipeline: HIRING_PIPELINE_ID };
  } catch (err) {
    console.error('HubSpot hiring deal error:', err);
    return { success: false, error: err.message };
  }
}

/* ============================================
   Contact Engagement Sync (Feature 5)
   Updates HubSpot contact with email engagement
   data from Resend webhook events
   ============================================ */

export async function updateContactEngagement(email, engagementData, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return;

  await ensureCustomProperties(env);

  const { opens, clicks, level } = engagementData;

  try {
    // Search for contact by email
    const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email,
          }],
        }],
        limit: 1,
      }),
    });

    if (!searchRes.ok) return;
    const searchData = await searchRes.json();
    const contactId = searchData.results?.[0]?.id;
    if (!contactId) return;

    // Update engagement properties
    const updateRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email_opens_count: String(opens || 0),
          email_clicks_count: String(clicks || 0),
          email_engagement_level: level || 'cold',
        },
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json();
      console.warn('HubSpot engagement update error:', err);
    }
  } catch (err) {
    console.error('HubSpot engagement sync error:', err);
  }
}

/* ============================================
   HubSpot Date-Based Queries
   For cron lifecycle emails (birthdays,
   anniversaries, renewals, closed-won deals)
   ============================================ */

export async function getContactsWithDateProperty(propertyName, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName,
            operator: 'HAS_PROPERTY',
          }],
        }],
        properties: ['firstname', 'lastname', 'email', 'company', propertyName],
        limit: 100,
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error(`HubSpot: Error fetching contacts with ${propertyName}:`, err);
    return [];
  }
}

export async function searchContactsByDateRange(propertyName, startTimestamp, endTimestamp, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [
            { propertyName, operator: 'GTE', value: String(startTimestamp) },
            { propertyName, operator: 'LTE', value: String(endTimestamp) },
          ],
        }],
        properties: ['firstname', 'lastname', 'email', 'company', propertyName],
        limit: 100,
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error(`HubSpot: Error searching ${propertyName} by date range:`, err);
    return [];
  }
}

export async function getClosedWonDeals(sinceDaysAgo, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return [];

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - sinceDaysAgo);
  const sinceTimestamp = sinceDate.getTime();

  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [
            { propertyName: 'dealstage', operator: 'EQ', value: 'closedwon' },
            { propertyName: 'closedate', operator: 'GTE', value: String(sinceTimestamp) },
          ],
        }],
        properties: ['dealname', 'dealstage', 'closedate', 'amount'],
        limit: 50,
        associations: ['contacts'],
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('HubSpot: Error fetching closed-won deals:', err);
    return [];
  }
}

/* ============================================
   Deal Lookup Helpers
   For post-meeting webhook handling
   ============================================ */

export async function getDealById(dealId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(
      `${HUBSPOT_API}/crm/v3/objects/deals/${dealId}?properties=dealname,dealstage,pipeline,description,amount,closedate`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('HubSpot: Error fetching deal by ID:', err);
    return null;
  }
}

export async function getContactForDeal(dealId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;

  try {
    // Get contacts associated with this deal
    const res = await fetch(
      `${HUBSPOT_API}/crm/v4/objects/deals/${dealId}/associations/contacts`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!res.ok) return null;
    const data = await res.json();

    if (!data.results || data.results.length === 0) return null;

    // Get the first associated contact's details
    const contactId = data.results[0].toObjectId;
    const contactRes = await fetch(
      `${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,company`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!contactRes.ok) return null;
    return await contactRes.json();
  } catch (err) {
    console.error('HubSpot: Error fetching contact for deal:', err);
    return null;
  }
}

export async function getContactById(contactId, env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(
      `${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,company`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('HubSpot: Error fetching contact by ID:', err);
    return null;
  }
}

/* ============================================
   No-Show Meeting Detection
   Queries HubSpot for meetings with NO_SHOW
   or CANCELLED outcome in the last 48 hours
   ============================================ */

export async function getNoShowMeetings(env) {
  const token = env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return [];

  // 48 hours ago in milliseconds
  const since = Date.now() - (48 * 60 * 60 * 1000);

  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/meetings/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: 'hs_meeting_outcome', operator: 'EQ', value: 'NO_SHOW' },
              { propertyName: 'hs_meeting_end_time', operator: 'GTE', value: String(since) },
            ],
          },
          {
            filters: [
              { propertyName: 'hs_meeting_outcome', operator: 'EQ', value: 'CANCELLED' },
              { propertyName: 'hs_meeting_end_time', operator: 'GTE', value: String(since) },
            ],
          },
        ],
        properties: ['hs_meeting_title', 'hs_meeting_outcome', 'hs_meeting_end_time'],
        limit: 50,
      }),
    });

    if (!res.ok) {
      console.error('HubSpot: No-show meetings search failed:', res.status);
      return [];
    }

    const data = await res.json();
    const meetings = data.results || [];

    if (meetings.length === 0) return [];

    console.log(`HubSpot: Found ${meetings.length} no-show/cancelled meetings`);

    // For each meeting, fetch the associated contact
    const meetingsWithContacts = [];
    for (const meeting of meetings) {
      try {
        const assocRes = await fetch(
          `${HUBSPOT_API}/crm/v4/objects/meetings/${meeting.id}/associations/contacts`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!assocRes.ok) continue;
        const assocData = await assocRes.json();

        if (!assocData.results || assocData.results.length === 0) continue;

        const contactId = assocData.results[0].toObjectId;
        const contact = await getContactById(contactId, env);

        if (contact && contact.properties?.email) {
          meetingsWithContacts.push({
            meetingId: meeting.id,
            outcome: meeting.properties.hs_meeting_outcome,
            email: contact.properties.email,
            firstName: contact.properties.firstname || 'there',
          });
        }
      } catch (err) {
        console.error(`HubSpot: Error fetching contact for meeting ${meeting.id}:`, err);
      }
    }

    return meetingsWithContacts;
  } catch (err) {
    console.error('HubSpot: No-show meetings search error:', err);
    return [];
  }
}
