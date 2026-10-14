# lisahaven.co

Lisa Haven's founder blog. Static site on Netlify, edited in Decap (/admin), stored in this GitHub repo. Every push to `main` deploys in about 1 minute.

## How a post goes live

The writing rules live in Lisa's "Blog Post Rulebook" artifact (claude.ai). Follow it for every post. Never publish anything until Lisa says "publish" for that post.

1. **Images.** Write `tools/specs/<slug>.json` (format at the top of `tools/render-images.py`), then run:
   `python3 tools/render-images.py tools/specs/<slug>.json`
   If Chromium is not found, prefix `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
   This makes `images/uploads/<slug>-cover.png` (1080 x 1350) and `images/pins/lisa-haven-pin-<slug>-N.png` (1000 x 1500) in the brand template (`templates/card.html`). Look at every image before publishing.
2. **Post file.** Create `_posts/YYYY-MM-DD-<slug>.md`. The slug after the date becomes the web address `lisahaven.co/blog/<slug>/`. Frontmatter fields: `title`, `category`, `emoji`, `date`, `readTime` (like `8 min read`), `excerpt`, `seoTitle`, `metaDescription`, `image` (`/images/uploads/<slug>-cover.png`), `draft: false`. Body in Markdown. Posts here show up in Decap automatically.
3. **Publish.** Commit the post, spec and images together and push to `main`. Netlify runs `build.js`, which adds the post to `blog-posts.json`, builds its page at `/blog/<slug>/` with its own title, description, share image and article details, and updates `sitemap.xml`.
4. **Check.** Confirm the Netlify deploy is `ready` and lists `blog/<slug>/index.html`.
5. **Pinterest.** Upload each pin in Pinterest (Claude in Chrome) linking to `https://lisahaven.co/blog/<slug>/`, with title, description, board, alt text and tagged topics, scheduled 1 a day.

## Rules that matter in this repo

- Only 1 post per calendar day: `build.js` skips a new post whose date matches a post already in `blog-posts.json`.
- Categories in use: Business Tips, AI & Tech, Founder Life, Mindset & Growth, The Journey.
- No em dashes anywhere. Never the words "single mom". Numbers as numerals.
- Old `/post?slug=` links redirect to `/blog/<slug>/` (see `netlify.toml`). Link to the `/blog/` form.
- Generated files (`blog/`, `posts-index.json`, `sitemap.xml` updates) are built on Netlify; do not commit `blog/`.
