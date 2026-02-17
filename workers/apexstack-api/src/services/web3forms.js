/* ============================================
   Web3Forms Service
   Forwards assessment data as internal
   notification to info@apexstackcloud.com
   (preserves existing behavior)
   ============================================ */

const WEB3FORMS_API = 'https://api.web3forms.com/submit';

export async function forwardToWeb3Forms(leadData, env) {
  const accessKey = env.WEB3FORMS_KEY;
  const recipientEmail = env.RECIPIENT_EMAIL || 'info@apexstackcloud.com';

  if (!accessKey) {
    console.warn('Web3Forms: No access key configured, skipping');
    return { skipped: true, reason: 'No WEB3FORMS_KEY configured' };
  }

  const { name, email, company, role, score, level, categoryScores, categoryPct, risks, recs, answers } = leadData;

  // Build category breakdown
  const CATEGORY_MAX = {
    architecture: 18,
    security: 28,
    deployment: 17,
    monitoring: 26,
    cost: 17,
  };

  let categoryBreakdown = '';
  categoryBreakdown += `Architecture: ${categoryScores.architecture || 0}/${CATEGORY_MAX.architecture} (${categoryPct.architecture || 0}%)\n`;
  categoryBreakdown += `Security: ${categoryScores.security || 0}/${CATEGORY_MAX.security} (${categoryPct.security || 0}%)\n`;
  categoryBreakdown += `Deployment & DevOps: ${categoryScores.deployment || 0}/${CATEGORY_MAX.deployment} (${categoryPct.deployment || 0}%)\n`;
  categoryBreakdown += `Monitoring & Reliability: ${categoryScores.monitoring || 0}/${CATEGORY_MAX.monitoring} (${categoryPct.monitoring || 0}%)\n`;
  categoryBreakdown += `Cost Optimization: ${categoryScores.cost || 0}/${CATEGORY_MAX.cost} (${categoryPct.cost || 0}%)`;

  const risksText = (risks || []).map((r, i) => `${i + 1}. ${r}`).join('\n');
  const recsText = (recs || []).map((r, i) => `${i + 1}. ${r}`).join('\n');

  let message = '=== CLOUD READINESS ASSESSMENT RESULT ===\n\n';
  message += `OVERALL SCORE: ${score}/100 — ${level}\n\n`;
  message += `--- CATEGORY BREAKDOWN ---\n${categoryBreakdown}\n\n`;
  message += `--- TOP RISKS ---\n${risksText}\n\n`;
  message += `--- TOP RECOMMENDATIONS ---\n${recsText}\n\n`;
  if (answers) {
    message += `--- DETAILED ANSWERS ---\n${answers}`;
  }

  const payload = {
    access_key: accessKey,
    subject: `Cloud Readiness Assessment: ${company} — Score: ${score}/100 (${level})`,
    from_name: 'ApexStack Cloud Readiness Assessment',
    name: name,
    email: email,
    company: company,
    role: role,
    score: `${score}/100`,
    readiness_level: level,
    message: message,
  };

  const response = await fetch(WEB3FORMS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Web3Forms returned non-JSON: ${text.substring(0, 200)}`);
  }

  if (!data.success) {
    throw new Error(`Web3Forms error: ${JSON.stringify(data)}`);
  }

  return { success: true };
}
