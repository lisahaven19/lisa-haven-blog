/**
 * build.js — Lisa Haven Blog Build Script
 *
 * Runs automatically on Netlify every time you publish.
 *  1. Reads your _posts/ markdown files and creates posts-index.json
 *     (so the website carousel can display your latest posts).
 *  1b. Adds any new post from the editor to blog-posts.json (the list the site reads),
 *      and skips posts marked "Hide this post".
 *  2. Auto-injects the "Latest Stories" auto-update script into index.html
 *     (so the homepage strip always shows your newest posts from blog-posts.json).
 *  3. Auto-injects default Open Graph / Twitter tags into post.html
 *     (so links shared on LinkedIn, Facebook, and iMessage show a preview photo).
 *
 * These injections happen on the DEPLOYED copy only — your source files stay clean,
 * and each step is wrapped so a problem can never fail your deploy.
 *
 * You never need to touch this file.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '_posts');
const OUTPUT_FILE = path.join(__dirname, 'posts-index.json');

// Parse YAML-style frontmatter from a markdown file.
// Handles what the Decap editor writes: single values, quoted text,
// long text wrapped over several lines, true/false, and lists (the photo gallery).
function unquote(v) {
  v = v.trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1)
      .replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  return v;
}

function parseFrontmatter(content) {
  content = content.replace(/\r\n/g, '\n');
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  const lines = match[1].split('\n');
  const body = match[2].trim();

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) { i++; continue; }
    const key = m[1];
    let value = m[2];
    i++;

    // Gather the indented lines (and list items) that belong to this key
    const block = [];
    while (i < lines.length && (/^\s+\S/.test(lines[i]) || /^-\s/.test(lines[i]) || lines[i].trim() === '')) {
      // a blank line only belongs here if more indented lines follow
      if (lines[i].trim() === '') {
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === '') j++;
        if (j >= lines.length || !/^\s+\S/.test(lines[j])) break;
      }
      block.push(lines[i]);
      i++;
    }

    const isList = value === '' && block.length > 0 && block.every(l => l.trim() === '' || /^\s*-\s/.test(l) || /^\s{2,}\S/.test(l));
    if (isList && block.some(l => /^\s*-\s/.test(l))) {
      const items = [];
      block.forEach(l => {
        const li = l.match(/^\s*-\s+(.*)$/);
        if (li) {
          // supports "- /path.jpg" and "- image: /path.jpg"
          const kv = li[1].match(/^[A-Za-z0-9_-]+:\s+(.*)$/);
          items.push(unquote(kv ? kv[1] : li[1]));
        }
      });
      meta[key] = items.filter(Boolean);
    } else if (/^[>|][+-]?$/.test(value)) {
      const joiner = value[0] === '|' ? '\n' : ' ';
      meta[key] = block.map(l => l.trim()).join(joiner).trim();
    } else {
      const full = [value].concat(block.map(l => l.trim())).join(' ').trim();
      meta[key] = unquote(full);
    }
  }

  return { meta, body };
}

function isDraft(meta) {
  return meta.draft === true || String(meta.draft).toLowerCase() === 'true';
}

function asList(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim() && v.trim() !== '[]') return [v.trim()];
  return [];
}

// ── 1. Generate posts-index.json from _posts/ ──
let posts = [];

if (fs.existsSync(POSTS_DIR)) {
  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse(); // newest first

  posts = files.map(filename => {
    const filePath = path.join(POSTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { meta, body } = parseFrontmatter(content);

    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    const slug = dateMatch ? dateMatch[2] : filename.replace('.md', '');
    const date = dateMatch ? dateMatch[1] : (meta.date || '');

    return {
      slug,
      title: meta.title || 'Untitled Post',
      category: meta.category || 'The Journey',
      emoji: meta.emoji || '✨',
      date: meta.date || date,
      readTime: meta.readTime || '3 min read',
      excerpt: meta.excerpt || '',
      image: meta.image || '',
      gallery: asList(meta.gallery),
      draft: isDraft(meta),
      body: body
    };
  }).filter(p => p.title !== 'Untitled Post' || p.body.length > 0)
    .filter(p => !p.draft)
    .map(p => { delete p.draft; return p; });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
console.log(`✅ Generated posts-index.json with ${posts.length} post(s).`);

// ── 1b. Add new editor posts to blog-posts.json (the list the website reads) ──
// The posts already in blog-posts.json stay exactly as they are.
// Any post in _posts/ that is not in that list yet gets added, so a post
// published in the editor shows up on the site by itself.
// A post marked "Hide this post" (draft) is never added.
try {
  const livePath = path.join(__dirname, 'blog-posts.json');
  let live = [];
  if (fs.existsSync(livePath)) {
    const parsed = JSON.parse(fs.readFileSync(livePath, 'utf-8'));
    if (Array.isArray(parsed)) live = parsed;
  }
  const day = d => String(d || '').slice(0, 10);
  const liveSlugs = new Set(live.map(p => p.slug));
  const liveDays = new Set(live.map(p => day(p.date)));
  const fileDay = {};
  if (fs.existsSync(POSTS_DIR)) {
    fs.readdirSync(POSTS_DIR).forEach(f => {
      const m = f.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
      if (m) fileDay[m[2]] = m[1];
    });
  }
  let added = 0;
  posts.forEach(p => {
    if (liveSlugs.has(p.slug)) return;
    // an older post that is already in the list under a shorter web address
    if (liveDays.has(fileDay[p.slug] || day(p.date))) return;
    live.push(p);
    liveSlugs.add(p.slug);
    added++;
  });
  if (added > 0) {
    live.sort((a, b) => new Date(b.date) - new Date(a.date));
    fs.writeFileSync(livePath, JSON.stringify(live, null, 2));
  }
  console.log(`✅ blog-posts.json has ${live.length} post(s) (${added} added from the editor).`);
} catch (e) {
  console.log('⚠️ blog-posts.json update skipped:', e.message);
}

// ── 2. Inject "Latest Stories" auto-update into index.html ──
try {
  const idxPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(idxPath)) {
    let html = fs.readFileSync(idxPath, 'utf-8');
    if (html.indexOf('AUTO-LATEST-STORIES') === -1) {
      const script = '\n<!-- AUTO-LATEST-STORIES -->\n<script>\n'
        + '(function(){\n'
        + "  function fmtDate(d){ try{ return new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}); }catch(e){ return ''; } }\n"
        + "  function esc(s){ var x=document.createElement('div'); x.textContent=(s==null?'':s); return x.innerHTML; }\n"
        + "  fetch('/blog-posts.json',{cache:'no-store'}).then(function(r){ return r.ok?r.json():null; }).then(function(posts){\n"
        + '    if(!posts||!posts.length) return;\n'
        + "    var grid=document.querySelector('.latest .posts-grid');\n"
        + '    if(!grid) return;\n'
        + '    posts.sort(function(a,b){ return new Date(b.date)-new Date(a.date); });\n'
        + '    grid.innerHTML=posts.slice(0,5).map(function(p,i){\n'
        + '      return \'<a href="/post?slug=\'+encodeURIComponent(p.slug)+\'" class="post-card\'+(i===0?\' featured\':\'\')+\'"><div class="post-card-body"><div class="post-meta"><span class="post-cat">\'+esc(((p.emoji||\'\')+\' \'+(p.category||\'\')).trim())+\'</span><span class="post-date">\'+esc(fmtDate(p.date))+\'</span></div><h3 class="post-title">\'+esc(p.title)+\'</h3><p class="post-excerpt">\'+esc(p.excerpt)+\'</p><div class="post-footer"><span class="post-read">⏱ \'+esc(p.readTime||\'\')+\'</span><span class="post-arrow">→</span></div></div></a>\';\n'
        + "    }).join('');\n"
        + '  }).catch(function(){});\n'
        + '})();\n'
        + '</' + 'script>\n';
      const i = html.lastIndexOf('</body>');
      if (i !== -1) {
        html = html.slice(0, i) + script + html.slice(i);
        fs.writeFileSync(idxPath, html);
        console.log('✅ Injected Latest Stories auto-update into index.html');
      } else {
        console.log('ℹ️ Could not find </body> in index.html; skipped Latest Stories injection.');
      }
    } else {
      console.log('ℹ️ Latest Stories auto-update already present.');
    }
  }
} catch (e) {
  console.log('⚠️ Latest Stories injection skipped:', e.message);
}

// ── 3. Inject default Open Graph / Twitter tags into post.html ──
try {
  const pPath = path.join(__dirname, 'post.html');
  if (fs.existsSync(pPath)) {
    let html = fs.readFileSync(pPath, 'utf-8');
    if (html.indexOf('og:image') === -1) {
      const og = '\n  <!-- AUTO-OG -->\n'
        + '  <meta property="og:type" content="article">\n'
        + '  <meta property="og:site_name" content="Lisa Haven">\n'
        + '  <meta property="og:title" content="Lisa Haven — The Real Journey">\n'
        + '  <meta property="og:description" content="The real journey of building three companies as a mother of 3. The wins, the mess, and everything in between.">\n'
        + '  <meta property="og:image" content="https://lisahaven.co/images/uploads/og-card.jpg">\n'
        + '  <meta property="og:image:width" content="1200">\n'
        + '  <meta property="og:image:height" content="630">\n'
        + '  <meta property="og:url" content="https://lisahaven.co/">\n'
        + '  <meta name="twitter:card" content="summary_large_image">\n'
        + '  <meta name="twitter:title" content="Lisa Haven — The Real Journey">\n'
        + '  <meta name="twitter:image" content="https://lisahaven.co/images/uploads/og-card.jpg">\n';
      const ti = html.indexOf('</title>');
      if (ti !== -1) {
        html = html.slice(0, ti + 8) + og + html.slice(ti + 8);
      } else {
        const hi = html.indexOf('<head>');
        if (hi !== -1) html = html.slice(0, hi + 6) + og + html.slice(hi + 6);
      }
      fs.writeFileSync(pPath, html);
      console.log('✅ Injected default Open Graph tags into post.html');
    } else {
      console.log('ℹ️ Open Graph tags already present in post.html.');
    }
  }
} catch (e) {
  console.log('⚠️ Open Graph injection skipped:', e.message);
}

// ── 4. Point the homepage share image at the wide 1200x630 card ──
try {
  const idxPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(idxPath)) {
    let html = fs.readFileSync(idxPath, 'utf-8');
    const before = html;
    // Only swap the social-preview image URLs (og:image / twitter:image), not page photos
    html = html.replace(
      /(property=["']og:image["'][^>]*content=["'])https:\/\/lisahaven\.co\/images\/uploads\/lisa-photo\.jpg(["'])/i,
      '$1https://lisahaven.co/images/uploads/og-card.jpg$2'
    ).replace(
      /(name=["']twitter:image["'][^>]*content=["'])https:\/\/lisahaven\.co\/images\/uploads\/lisa-photo\.jpg(["'])/i,
      '$1https://lisahaven.co/images/uploads/og-card.jpg$2'
    );
    if (html !== before) {
      fs.writeFileSync(idxPath, html);
      console.log('✅ Updated homepage social-preview image to og-card.jpg');
    } else {
      console.log('ℹ️ Homepage social-preview image already set (no change).');
    }
  }
} catch (e) {
  console.log('⚠️ Homepage OG image swap skipped:', e.message);
}
