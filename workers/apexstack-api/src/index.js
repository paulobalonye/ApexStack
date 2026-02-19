/* ============================================
   ApexStack Cloud API Worker
   Routes:
     POST /api/assessment       — Assessment handler
     POST /api/contact          — Contact form handler
     POST /api/apply            — Job application handler
     POST /api/webhooks/resend  — Resend email events
     POST /api/webhooks/hubspot — HubSpot meeting + deal stage events
     GET  /api/unsubscribe      — Email unsubscribe
     GET  /api/health           — Health check
   Cron:
     Daily at 9 AM EST — All email automation
   ============================================ */

import { handleAssessment } from './handlers/assessment.js';
import { handleContact } from './handlers/contact.js';
import { handleJobApplication } from './handlers/apply.js';
import { handleResendWebhook } from './handlers/webhook.js';
import { handleHubSpotWebhook } from './handlers/hubspot-webhook.js';
import { handleAdminRequest } from './handlers/admin.js';
import { handleScheduled } from './handlers/cron.js';
import { generateUnsubToken } from './utils/unsubscribe.js';
import { insertUnsubscribe } from './db/queries.js';
import { buildUnsubPage } from './templates/unsubscribe-page.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Route: POST /api/assessment
    if (path === '/api/assessment' && request.method === 'POST') {
      try {
        const body = await request.json();
        const result = await handleAssessment(body, env, ctx);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        console.error('Assessment handler error:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Route: POST /api/contact
    if (path === '/api/contact' && request.method === 'POST') {
      try {
        const body = await request.json();
        const result = await handleContact(body, env);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        console.error('Contact handler error:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Route: POST /api/apply
    if (path === '/api/apply' && request.method === 'POST') {
      try {
        const body = await request.json();
        const result = await handleJobApplication(body, env);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        console.error('Application handler error:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Route: POST /api/webhooks/resend (Feature 4)
    if (path === '/api/webhooks/resend' && request.method === 'POST') {
      try {
        const result = await handleResendWebhook(request, env);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        console.error('Webhook handler error:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Webhook processing error' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Route: POST /api/webhooks/hubspot (Features 1, 2 — meeting events)
    if (path === '/api/webhooks/hubspot' && request.method === 'POST') {
      try {
        const result = await handleHubSpotWebhook(request, env);
        const status = result.success === false && result.error === 'Invalid signature' ? 401 : 200;
        return new Response(JSON.stringify(result), {
          status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        console.error('HubSpot webhook handler error:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'HubSpot webhook processing error' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Route: GET /api/unsubscribe
    if (path === '/api/unsubscribe' && request.method === 'GET') {
      const email = url.searchParams.get('email');
      const token = url.searchParams.get('token');

      if (!email || !token) {
        return new Response(
          buildUnsubPage('Invalid unsubscribe link. Please use the link from your email.', false),
          { status: 400, headers: { 'Content-Type': 'text/html' } }
        );
      }

      try {
        // Verify token
        const secret = env.UNSUB_SECRET || 'default-unsub-secret';
        const expectedToken = await generateUnsubToken(email, secret);

        if (token !== expectedToken) {
          return new Response(
            buildUnsubPage('Invalid or expired unsubscribe link. Please use the link from your email.', false),
            { status: 403, headers: { 'Content-Type': 'text/html' } }
          );
        }

        // Store unsubscribe
        await insertUnsubscribe(email, token, env);

        return new Response(
          buildUnsubPage('You have been successfully unsubscribed from ApexStack Cloud emails. You will no longer receive our assessment follow-up emails.', true),
          { status: 200, headers: { 'Content-Type': 'text/html' } }
        );
      } catch (err) {
        console.error('Unsubscribe error:', err);
        return new Response(
          buildUnsubPage('Something went wrong. Please try again later or email info@apexstackcloud.com.', false),
          { status: 500, headers: { 'Content-Type': 'text/html' } }
        );
      }
    }

    // Route: Admin Dashboard API
    if (path.startsWith('/api/admin/')) {
      try {
        const result = await handleAdminRequest(request, url, env);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        console.error('Admin handler error:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Health check
    if (path === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'ok', service: 'apexstack-api', timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // 404 for everything else
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  },

  // Cron trigger: Daily email automation dispatcher
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduled(env));
  },
};
