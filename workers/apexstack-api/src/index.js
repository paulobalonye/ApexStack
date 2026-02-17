/* ============================================
   ApexStack Cloud API Worker
   Routes: POST /api/assessment
   ============================================ */

import { handleAssessment } from './handlers/assessment.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for development/testing
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
