export const CATALOG_KEY = 'catalog-v1';
const MAX_CATALOG_BYTES = 24 * 1024 * 1024;
const CATEGORIES = new Set(['food', 'animals', 'nature', 'seasonal', 'play']);

export function validateCatalog(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.items) || value.items.length < 1 || value.items.length > 10000) {
    throw new Error('Catalog envelope is invalid');
  }
  if (typeof value.updatedAt !== 'string' || Number.isNaN(Date.parse(value.updatedAt))) throw new Error('Catalog timestamp is invalid');
  const ids = new Set();
  for (const item of value.items) {
    if (!item || typeof item.id !== 'string' || !/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(item.id) || ids.has(item.id)) throw new Error('Catalog id is invalid');
    ids.add(item.id);
    if (!['original', 'external'].includes(item.kind) || !CATEGORIES.has(item.category)) throw new Error(`Catalog category is invalid for ${item.id}`);
    if (typeof item.creator !== 'string' || item.creator.length > 200 || !item.title || ['ko', 'en', 'ja'].some(lang => typeof item.title[lang] !== 'string' || item.title[lang].length > 300)) throw new Error(`Catalog text is invalid for ${item.id}`);
    if (item.kind === 'external') {
      const urls = item.urls || {};
      const sources = Object.entries(urls);
      if (!sources.length || sources.some(([lang, source]) => !['ko', 'en', 'ja'].includes(lang) || !isHttpsUrl(source))) throw new Error(`Catalog source is invalid for ${item.id}`);
    }
    if (item.thumbnail !== undefined && item.thumbnail !== null && !isHttpsUrl(item.thumbnail)) throw new Error(`Catalog preview is invalid for ${item.id}`);
  }
  return value;
}

function isHttpsUrl(value) {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

export async function loadSource(env) {
  const source = new URL(env.CATALOG_SOURCE_URL || '');
  if (source.protocol !== 'https:' || source.hostname !== 'raw.githubusercontent.com') throw new Error('Catalog source must be raw.githubusercontent.com over HTTPS');
  const response = await fetch(source, {
    headers: { Accept: 'application/json', 'User-Agent': 'squishy-garden-catalog-refresh' },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Catalog source returned HTTP ${response.status}`);
  const body = await response.text();
  if (new TextEncoder().encode(body).byteLength > MAX_CATALOG_BYTES) throw new Error('Catalog is larger than the KV value limit');
  validateCatalog(JSON.parse(body));
  return body;
}

export async function refreshCatalog(env) {
  const body = await loadSource(env);
  const existing = await env.CATALOG.get(CATALOG_KEY, { type: 'text' });
  if (existing !== body) await env.CATALOG.put(CATALOG_KEY, body, { metadata: { updatedAt: JSON.parse(body).updatedAt } });
  return body;
}
