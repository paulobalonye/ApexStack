/* ============================================
   ApexStack Cloud API Worker
   Routes:
     POST /api/assessment — Assessment handler
     POST /api/contact    — Contact form handler
     GET  /api/unsubscribe — Email unsubscribe
     GET  /api/health     — Health check
   ============================================ */

import { handleAssessment } from './handlers/assessment.js';
import { handleContact } from './handlers/contact.js';
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
};
