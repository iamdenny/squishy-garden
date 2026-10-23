import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import api from '../worker/index.mjs';
import { CATALOG_KEY, refreshCatalog, validateCatalog } from '../worker/catalog.mjs';

function sampleCatalog() {
  return {
    schemaVersion: 1,
    updatedAt: '2026-10-23T00:00:00.000Z',
    items: [{
      id: 'sample-pattern', kind: 'external', category: 'animals', creator: 'Sample creator',
      title: { ko: '샘플 도안', en: 'Sample pattern', ja: 'サンプル型紙' },
      urls: { ko: 'https://example.com/pattern' }, thumbnail: 'https://example.com/preview.jpg',
    }],
  };
}

test('catalog contract rejects duplicate ids and unsafe source URLs', () => {
  const duplicate = sampleCatalog();
  duplicate.items.push({ ...duplicate.items[0] });
  assert.throws(() => validateCatalog(duplicate), /id is invalid/);

  const unsafe = sampleCatalog();
  unsafe.items[0].urls.ko = 'javascript:alert(1)';
  assert.throws(() => validateCatalog(unsafe), /source is invalid/);
});

test('current generated multilingual snapshot satisfies the Worker contract', async () => {
  const current = JSON.parse(await readFile(new URL('../public/catalog.json', import.meta.url), 'utf8'));
  assert.equal(validateCatalog(current), current);
  assert(current.items.length >= 100);
});

test('catalog API serves only read-only same-site requests with cache and CORS headers', async () => {
  const catalog = sampleCatalog();
  let reads = 0;
  const env = { CATALOG: { get: async (key, options) => { reads++; assert.equal(key, CATALOG_KEY); assert.equal(options.cacheTtl, 60); return JSON.stringify(catalog); } } };
  const request = new Request('https://squishy-garden-catalog-api.example.workers.dev/v1/catalog', { headers: { Origin: 'https://squishy.iamdenny.com' } });
  const response = await api.fetch(request, env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://squishy.iamdenny.com');
  assert.equal(response.headers.get('cache-control'), 'public, max-age=300, stale-while-revalidate=600');
  assert.deepEqual(await response.json(), catalog);

  const denied = await api.fetch(new Request(request.url, { headers: { Origin: 'https://other.example' } }), env);
  assert.equal(denied.status, 403);
  const write = await api.fetch(new Request(request.url, { method: 'POST' }), env);
  assert.equal(write.status, 405);
  assert.equal(reads, 1);
});

test('scheduled refresh keeps the last good snapshot when the public source fails', async () => {
  const catalog = sampleCatalog();
  let stored = null;
  let writes = 0;
  const namespace = {
    get: async () => stored,
    put: async (_key, value) => { stored = value; writes++; },
  };
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify(catalog), { status: 200 });
    await refreshCatalog({ CATALOG: namespace, CATALOG_SOURCE_URL: 'https://raw.githubusercontent.com/iamdenny/squishy-garden/main/public/catalog.json' });
    assert.equal(writes, 1);
    assert.equal(JSON.parse(stored).items[0].id, 'sample-pattern');

    globalThis.fetch = async () => new Response('not json', { status: 503 });
    await assert.rejects(refreshCatalog({ CATALOG: namespace, CATALOG_SOURCE_URL: 'https://raw.githubusercontent.com/iamdenny/squishy-garden/main/public/catalog.json' }), /HTTP 503/);
    assert.equal(writes, 1);
    assert.equal(JSON.parse(stored).items[0].id, 'sample-pattern');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
