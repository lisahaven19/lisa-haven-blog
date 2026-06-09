/**
 * build.js — Lisa Haven Blog Post Index Generator
 *
 * This runs automatically on Netlify every time you publish a post.
 * It reads all your markdown files from _posts/ and creates posts-index.json
 * so the website carousel can display your latest posts.
 *
 * You never need to touch this file.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '_posts');
const OUTPUT_FILE = path.join(__dirname, 'posts-index.json');

// Parse YAML-style frontmatter from a markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  const yamlBlock = match[1];
  const body = match[2].trim();

  // Parse each key: value line
  yamlBlock.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  });

  return { meta, body };
}

// Read all markdown files from _posts/
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

    // Extract date from filename (YYYY-MM-DD-slug.md)
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
      body: body
    };
  }).filter(p => p.title !== 'Untitled Post' || p.body.length > 0);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
console.log(`✅ Generated posts-index.json with ${posts.length} post(s).`);
