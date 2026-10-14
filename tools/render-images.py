"""
Render a post's cover and Pinterest pins in the Lisa Haven template.

Usage:
    python3 tools/render-images.py tools/specs/<slug>.json

Spec file:
{
  "slug": "how-to-build-ugc-creator-program-before-launch",
  "category": "Business Tips",
  "cover": {"title": "How to Build a UGC Creator Program", "accent": "Before Launch",
            "subtitle": "7 lessons from lining up 20 creators before my app goes live",
            "tagline": "Plus how AI helps me run it."},
  "pins": [ {same 4 fields, different headline}, ... ]
}

Writes:
    images/uploads/<slug>-cover.png         (1080 x 1350, the post's cover image)
    images/pins/lisa-haven-pin-<slug>-N.png (1000 x 1500, one per pin)

Needs Playwright with Chromium. Fonts load from templates/fonts, so no internet is needed.
Stops with an error if any text would not fit cleanly or contains an em dash.
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = 'file://' + os.path.join(ROOT, 'templates', 'card.html')
BANNED = ['—', '–']


def check_text(card):
    for k in ('title', 'accent', 'subtitle', 'tagline', 'category'):
        v = card.get(k) or ''
        for b in BANNED:
            if b in v:
                sys.exit(f'Stopped: "{k}" contains a dash that the brand rules do not allow: {v}')


async def render(page, card, kind, out):
    await page.set_viewport_size({'width': 1080 if kind == 'cover' else 1000, 'height': 1350 if kind == 'cover' else 1500})
    await page.goto(TEMPLATE)
    ok = await page.evaluate('d => window.fill(d)', dict(card, kind=kind))
    if not ok:
        sys.exit(f'Stopped: text is too long to fit cleanly on {os.path.basename(out)}. Shorten it.')
    await page.locator('#card').screenshot(path=out)
    print('saved', os.path.relpath(out, ROOT))


async def main(spec_path):
    spec = json.load(open(spec_path))
    slug, cat = spec['slug'], spec.get('category', '')
    os.makedirs(os.path.join(ROOT, 'images', 'uploads'), exist_ok=True)
    os.makedirs(os.path.join(ROOT, 'images', 'pins'), exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        if spec.get('cover'):
            c = dict(spec['cover'], category=cat); check_text(c)
            await render(page, c, 'cover', os.path.join(ROOT, 'images', 'uploads', f'{slug}-cover.png'))
        for i, pin in enumerate(spec.get('pins', []), 1):
            c = dict(pin, category=pin.get('category', cat)); check_text(c)
            await render(page, c, 'pin', os.path.join(ROOT, 'images', 'pins', f'lisa-haven-pin-{slug}-{i}.png'))
        await browser.close()


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    asyncio.run(main(sys.argv[1]))
