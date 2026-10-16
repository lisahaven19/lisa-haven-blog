"""
Render link preview cards (1200 x 630) for every post in tools/specs/share-cards.json.

Usage:  python3 tools/render-share.py            (all cards)
        python3 tools/render-share.py <slug>     (1 card)

Writes images/og/<slug>.jpg. build.js uses it as the post's share image when it exists.
The "_site" entry rewrites images/uploads/og-card.jpg, the home page share image.
Stops if any text would not fit cleanly or contains an em dash.
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = 'file://' + os.path.join(ROOT, 'templates', 'share.html')

async def main(only):
    spec = json.load(open(os.path.join(ROOT, 'tools', 'specs', 'share-cards.json')))
    photo = 'file://' + os.path.join(ROOT, spec['photo'].lstrip('/'))
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        for slug, c in spec['cards'].items():
            if only and slug != only: continue
            for v in c.values():
                if '—' in v or '–' in v: sys.exit(f'Stopped: dash in {slug}: {v}')
            await pg.goto(TEMPLATE)
            ok = await pg.evaluate('d => window.fill(d)', dict(c, photo=photo))
            if not ok: sys.exit(f'Stopped: text does not fit cleanly on {slug}. Shorten it.')
            out = os.path.join(ROOT, 'images', 'uploads', 'og-card.jpg') if slug == '_site' else os.path.join(ROOT, 'images', 'og', slug + '.jpg')
            await pg.locator('#card').screenshot(path=out, type='jpeg', quality=90)
            print('saved', os.path.relpath(out, ROOT))
        await b.close()
asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else None))
