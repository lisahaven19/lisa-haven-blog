// Lisa's comment moderation, behind her blog editor login (Netlify Identity)
// GET  /api/comments-admin                    -> pending + all published
// POST /api/comments-admin {action, id, slug?, text?}
//   approve | reject (pending) | delete (published) | reply (posts as Lisa Haven)
import { getStore } from '@netlify/blobs';

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

async function editor(req) {
  const auth = req.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+/.test(auth)) return null;
  const origin = new URL(req.url).origin;
  const r = await fetch(origin + '/.netlify/identity/user', { headers: { Authorization: auth } }).catch(() => null);
  if (!r || !r.ok) return null;
  const u = await r.json().catch(() => null);
  return u && u.email ? u : null;
}

export default async (req) => {
  const user = await editor(req);
  if (!user) return json(401, { error: 'Please log in with your blog editor account.' });
  const store = getStore({ name: 'comments', consistency: 'strong' });

  if (req.method === 'GET') {
    const pending = (await store.get('pending', { type: 'json' })) || [];
    const { blobs } = await store.list({ prefix: 'post/' });
    const published = [];
    for (const b of blobs) {
      const list = (await store.get(b.key, { type: 'json' })) || [];
      list.forEach(c => published.push(c));
    }
    published.sort((a, b) => b.date.localeCompare(a.date));
    return json(200, { pending: pending.slice().reverse(), published: published.slice(0, 300) });
  }
  if (req.method !== 'POST') return json(405, { error: 'method' });

  const body = await req.json().catch(() => ({}));
  const { action, id } = body;

  if (action === 'approve' || action === 'reject') {
    const pending = (await store.get('pending', { type: 'json' })) || [];
    const item = pending.find(c => c.id === id);
    if (!item) return json(404, { error: 'Not found' });
    await store.setJSON('pending', pending.filter(c => c.id !== id));
    if (action === 'approve') {
      const key = 'post/' + item.slug;
      const list = (await store.get(key, { type: 'json' })) || [];
      const { reason, ...clean } = item;
      list.push(clean);
      list.sort((a, b) => a.date.localeCompare(b.date));
      await store.setJSON(key, list);
    }
    return json(200, { ok: true });
  }

  if (action === 'delete') {
    const key = 'post/' + String(body.slug || '');
    const list = (await store.get(key, { type: 'json' })) || [];
    await store.setJSON(key, list.filter(c => c.id !== id));
    return json(200, { ok: true });
  }

  if (action === 'reply') {
    const slug = String(body.slug || '');
    const text = String(body.text || '').trim().slice(0, 2000);
    if (!/^[a-z0-9-]{1,120}$/.test(slug) || text.length < 1) return json(400, { error: 'Add a post and a reply.' });
    const key = 'post/' + slug;
    const list = (await store.get(key, { type: 'json' })) || [];
    const now = Date.now();
    list.push({ id: now.toString(36) + 'lh', slug, name: 'Lisa Haven', text, date: new Date(now).toISOString(), author: true });
    await store.setJSON(key, list);
    return json(200, { ok: true });
  }

  return json(400, { error: 'Unknown action' });
};

export const config = { path: '/api/comments-admin' };
