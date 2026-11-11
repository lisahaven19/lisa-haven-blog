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

// Read counts copied from the old counter on Nov 11, 2026 (the old service is slow to reach from here).
const SEED = {
  'how-to-ask-chatgpt-better-questions': 606, 'from-zero-to-three-companies': 160, 'why-i-went-carnivore': 119,
  'what-is-vixa': 102, 'how-to-create-an-ai-agent-with-claude': 66, 'how-to-use-ai-without-sounding-like-ai': 39,
  'chatgpt-prompts-for-busy-moms': 18, 'how-to-use-chatgpt-to-meal-plan': 17, 'why-i-created-havenly-makeup-remover-wipes-for-gen-z': 16,
  'what-to-do-when-apple-rejects-your-app': 16, 'how-to-use-ai-to-answer-customer-emails': 16, 'chatgpt-custom-instructions': 15,
  'midface-lift-in-turkey-review': 15, 'how-to-manage-ugc-creators-with-ai': 12, 'remove-your-address-from-the-internet': 12,
  'how-to-lock-in-mentally': 12, 'how-to-use-ai-to-write-blog-posts-that-rank': 12, 'claude-vs-chatgpt': 10,
  'when-to-let-an-employee-go': 8, 'how-to-launch-an-app': 8, 'chatgpt-memory': 5,
};

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

const okSlug = s => /^[a-z0-9-]{1,120}$/.test(s);

async function oldCount(slug) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch(OLD + slug, { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) return r.status === 404 ? 0 : null;
    const d = await r.json();
    return Number(d.value) || 0;
  } catch { return null; } // null means the old service did not answer, try again later
}

// Each post keeps { base, baseOk, hits }. base = reads carried over from the old counter.
async function load(store, slug) {
  const key = 'reads/' + slug;
  const cur = await store.getWithMetadata(key, { type: 'json' });
  let rec = (cur && cur.data) || { base: 0, baseOk: false, hits: 0 };
  if (!rec.baseOk && SEED[slug] !== undefined) {
    rec = { ...rec, base: SEED[slug], baseOk: true }; await store.setJSON(key, rec);
  }
  if (!rec.baseOk) {
    let base = 0, ok = true;
    for (const s of [slug, ...(RENAMED[slug] || [])]) {
      const n = await oldCount(s);
      if (n === null) { ok = false; break; }
      base += n;
    }
    if (ok) { rec = { ...rec, base, baseOk: true }; await store.setJSON(key, rec); }
  }
  return rec;
}

const total = r => (r.base || 0) + (r.hits || 0);

export default async (req) => {
  const store = getStore({ name: 'views', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const slug = url.searchParams.get('slug') || '';
    if (!okSlug(slug)) return json(400, { error: 'bad slug' });
    return json(200, { slug, value: total(await load(store, slug)) });
  }

  if (req.method !== 'POST') return json(405, { error: 'method' });
  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'bad body' }); }
  const slug = String(body.slug || '');
  if (!okSlug(slug)) return json(400, { error: 'bad slug' });

  await load(store, slug);
  const key = 'reads/' + slug;
  let rec;
  for (let i = 0; i < 5; i++) {
    const cur = await store.getWithMetadata(key, { type: 'json' });
    rec = { ...((cur && cur.data) || { base: 0, baseOk: false, hits: 0 }) };
    rec.hits = (rec.hits || 0) + 1;
    const opts = cur && cur.etag ? { onlyIfMatch: cur.etag } : { onlyIfNew: true };
    let res;
    try { res = await store.setJSON(key, rec, opts); }
    catch (e) { await store.setJSON(key, rec); break; }
    if (!res || res.modified !== false) break;
  }
  const value = total(rec);
  return json(200, { slug, value });
};

export const config = { path: '/api/views' };
