// Public comments API for lisahaven.co
// GET  /api/comments?slug=...  -> approved comments for a post
// POST /api/comments            -> { slug, name, text, website(honeypot) }
import { getStore } from '@netlify/blobs';
import { moderate } from './lib/moderate.mjs';

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});
const SLUG = /^[a-z0-9-]{1,120}$/;
const RESERVED = /(lisa\s*haven|lisahaven|^lisa$|admin|moderator|alma)/i;

async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 24);
}

export default async (req, context) => {
  const store = getStore({ name: 'comments', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const slug = url.searchParams.get('slug') || '';
    if (!SLUG.test(slug)) return json(400, { error: 'bad slug' });
    const list = (await store.get('post/' + slug, { type: 'json' })) || [];
    return json(200, { comments: list.map(({ id, name, text, date, author }) => ({ id, name, text, date, author: !!author })) });
  }

  if (req.method !== 'POST') return json(405, { error: 'method' });

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'Please try again.' }); }
  const slug = String(body.slug || '');
  const name = String(body.name || '').replace(/\s+/g, ' ').trim();
  const text = String(body.text || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const dry = req.headers.get('x-dry-run') === '1';

  if (body.website) return json(200, { status: 'published' });                 // bot filled the hidden field
  if (!SLUG.test(slug)) return json(400, { error: 'Please try again.' });
  if (name.length < 2 || name.length > 40) return json(400, { error: 'Please add your first name (2 to 40 letters).' });
  if (text.length < 3 || text.length > 1000) return json(400, { error: 'Comments can be 3 to 1,000 characters.' });
  if (RESERVED.test(name)) return json(400, { error: 'Please use your own first name.' });

  // Post must exist on the site
  const posts = await fetch(new URL('/blog-posts.json', url.origin)).then(r => r.ok ? r.json() : []).catch(() => []);
  if (!Array.isArray(posts) || !posts.some(p => p.slug === slug)) return json(400, { error: 'Please try again.' });

  // Slow down repeat posting: 5 comments per hour per visitor
  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const who = await sha(ip + '|lisahaven');
  const now = Date.now();
  const hits = ((await store.get('rate/' + who, { type: 'json' })) || []).filter(t => now - t < 3600e3);
  if (hits.length >= 5) return json(429, { error: 'Thanks for all the love! Please try again in a little while.' });

  const verdict = moderate(name, text);
  const item = { id: now.toString(36) + Math.random().toString(36).slice(2, 7), slug, name, text, date: new Date(now).toISOString() };

  if (dry) return json(200, { status: verdict.action === 'ok' ? 'published' : verdict.action === 'review' ? 'review' : 'blocked', reason: verdict.reason, dry: true });

  await store.setJSON('rate/' + who, hits.concat(now));

  if (verdict.action === 'block') {
    return json(200, { status: 'blocked', message: 'Please keep it kind and leave out links. Your comment was not posted.' });
  }
  if (verdict.action === 'review') {
    const pending = (await store.get('pending', { type: 'json' })) || [];
    pending.push({ ...item, reason: verdict.reason });
    await store.setJSON('pending', pending.slice(-500));
    return json(200, { status: 'review', message: 'Thank you! Your comment will show after a quick review.' });
  }
  const key = 'post/' + slug;
  const list = (await store.get(key, { type: 'json' })) || [];
  list.push(item);
  await store.setJSON(key, list);
  return json(200, { status: 'published', comment: { id: item.id, name, text, date: item.date, author: false } });
};

export const config = { path: '/api/comments' };
