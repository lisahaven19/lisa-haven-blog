// Reader poll for lisahaven.co
// GET  /api/poll?id=ai-2026          -> { id, counts, total }
// POST /api/poll { id, choice }      -> { id, counts, total, voted }
// 1 vote per visitor per poll. Visitors are kept as a one-way hash, never their address.
import { getStore } from '@netlify/blobs';

const POLLS = {
  'ai-2026': ['chatgpt', 'claude', 'both', 'whats-claude'],
};

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 24);
}

const blank = id => Object.fromEntries(POLLS[id].map(k => [k, 0]));
const total = c => Object.values(c).reduce((a, b) => a + b, 0);

export default async (req, context) => {
  const store = getStore({ name: 'polls', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const id = url.searchParams.get('id') || '';
    if (!POLLS[id]) return json(400, { error: 'bad poll' });
    const counts = { ...blank(id), ...((await store.get('counts/' + id, { type: 'json' })) || {}) };
    return json(200, { id, counts, total: total(counts) });
  }

  if (req.method !== 'POST') return json(405, { error: 'method' });

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'Please try again.' }); }
  const id = String(body.id || '');
  const choice = String(body.choice || '');
  if (!POLLS[id] || !POLLS[id].includes(choice)) return json(400, { error: 'Please try again.' });
  if (body.website) return json(200, { id, counts: blank(id), total: 0, voted: true }); // bot field

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const who = await sha(ip + '|' + (req.headers.get('user-agent') || '') + '|lisahaven-poll');
  const voteKey = `vote/${id}/${who}`;
  const key = 'counts/' + id;

  if (await store.get(voteKey)) {
    const counts = { ...blank(id), ...((await store.get(key, { type: 'json' })) || {}) };
    return json(200, { id, counts, total: total(counts), voted: true, already: true });
  }

  if (req.headers.get('x-dry-run') === '1') {
    const c = { ...blank(id), ...((await store.get(key, { type: 'json' })) || {}) };
    return json(200, { id, counts: c, total: total(c), dry: true });
  }

  // Add the vote. Retry if 2 votes land at the same moment.
  let counts;
  for (let i = 0; i < 5; i++) {
    const cur = await store.getWithMetadata(key, { type: 'json' });
    counts = { ...blank(id), ...((cur && cur.data) || {}) };
    counts[choice] += 1;
    const opts = cur && cur.etag ? { onlyIfMatch: cur.etag } : { onlyIfNew: true };
    let res;
    try { res = await store.setJSON(key, counts, opts); }
    catch (e) { await store.setJSON(key, counts); break; } // older library: plain save
    if (!res || res.modified !== false) break;
  }
  await store.set(voteKey, choice);
  return json(200, { id, counts, total: total(counts), voted: true });
};

export const config = { path: '/api/poll' };
