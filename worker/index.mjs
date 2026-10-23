import { CATALOG_KEY, refreshCatalog } from './catalog.mjs';

const ALLOWED_ORIGINS = new Set([
  'https://squishy.iamdenny.com',
  'http://127.0.0.1:4347',
  'http://localhost:4347',
]);

function corsHeaders(origin) {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  });
  if (origin && ALLOWED_ORIGINS.has(origin)) headers.set('Access-Control-Allow-Origin', origin);
  return headers;
}

function jsonResponse(body, status, origin) {
  const headers = corsHeaders(origin);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (url.pathname === '/healthz' && request.method === 'GET') {
      return jsonResponse({ ok: true, service: 'squishy-garden-catalog-api' }, 200, origin);
    }
    if (url.pathname !== '/v1/catalog') return jsonResponse({ error: 'not_found' }, 404, origin);
    if (origin && !ALLOWED_ORIGINS.has(origin)) return jsonResponse({ error: 'origin_not_allowed' }, 403, null);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== 'GET') return jsonResponse({ error: 'method_not_allowed' }, 405, origin);

    try {
      const catalog = await env.CATALOG.get(CATALOG_KEY, { type: 'text', cacheTtl: 60 });
      if (!catalog) return jsonResponse({ error: 'catalog_not_ready' }, 503, origin);
      const headers = corsHeaders(origin);
      headers.set('Content-Type', 'application/json; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      headers.set('X-Content-Type-Options', 'nosniff');
      return new Response(catalog, { status: 200, headers });
    } catch {
      return jsonResponse({ error: 'catalog_unavailable' }, 503, origin);
    }
  },

  async scheduled(_controller, env) {
    await refreshCatalog(env);
  },
};
