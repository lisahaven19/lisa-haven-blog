// Read counter for lisahaven.co posts, kept in Netlify Blobs so it is fast and always on.
// GET  /api/views?slug=x          -> { slug, value }
// POST /api/views { slug }        -> { slug, value }   (adds 1 read)
// The first time a post is seen here, it starts from its old count on the previous
// counter service (abacus), so no reads are lost. Renamed posts add their old slug's reads.
import { getStore } from '@netlify/blobs';

const OLD = 'https://abacus.jasoncameron.dev/get/lisahaven-co/views-';
const RENAMED = {
  'midface-lift-in-turkey-review': ['facelift-in-turkey-review'],
};

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

const okSlug = s => /^[a-z0-9-]{1,120}$/.test(s);

async function oldCount(slug) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const r = await fetch(OLD + slug, { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) return 0;
    const d = await r.json();
    return Number(d.value) || 0;
  } catch { return 0; }
}

async function current(store, slug) {
  const v = await store.get('views/' + slug, { type: 'json' });
  if (v && typeof v.value === 'number') return v.value;
  let start = await oldCount(slug);
  for (const s of RENAMED[slug] || []) start += await oldCount(s);
  await store.setJSON('views/' + slug, { value: start });
  return start;
}

export default async (req) => {
  const store = getStore({ name: 'views', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const slug = url.searchParams.get('slug') || '';
    if (!okSlug(slug)) return json(400, { error: 'bad slug' });
    return json(200, { slug, value: await current(store, slug) });
  }

  if (req.method !== 'POST') return json(405, { error: 'method' });
  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'bad body' }); }
  const slug = String(body.slug || '');
  if (!okSlug(slug)) return json(400, { error: 'bad slug' });

  await current(store, slug);
  const key = 'views/' + slug;
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const cur = await store.getWithMetadata(key, { type: 'json' });
    value = ((cur && cur.data && cur.data.value) || 0) + 1;
    const opts = cur && cur.etag ? { onlyIfMatch: cur.etag } : { onlyIfNew: true };
    let res;
    try { res = await store.setJSON(key, { value }, opts); }
    catch (e) { await store.setJSON(key, { value }); break; }
    if (!res || res.modified !== false) break;
  }
  return json(200, { slug, value });
};

export const config = { path: '/api/views' };
