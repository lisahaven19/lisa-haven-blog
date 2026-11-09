#!/usr/bin/env python3
"""Render in-post charts in the big, easy-to-read brand style.

Usage: python3 tools/render-charts.py tools/specs/charts.json [slug ...]
Each chart in the JSON becomes images/uploads/<out> (1600 px wide, height fits the content).

Blocks a chart can use (in order, top to bottom):
  steps    {"items":[{"t","d","hl"?,"sub"?}], "numbers":true}   cards, 2 per row
  rows     {"items":[{"t","d","hl"?}]}                          full-width numbered rows
  compare  {"cols":[{"title","sub"?,"items":[...],"style":"light|pink|dark","icon":"dot|check|x"}]}
  bars     {"items":[{"label","value","pct","color":"rose|ink"}], "source"?}
  timeline {"items":[{"time","d"}]}
  pills    {"label","items":[...]}
  rule     {"label":"My rule:","text"}
"""
import json, sys, asyncio, html
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
F = ROOT / "templates" / "fonts"
E = html.escape

CSS = f"""
@font-face{{font-family:Playfair;src:url(file://{F}/PlayfairDisplay.ttf)}}
@font-face{{font-family:Playfair;font-style:italic;src:url(file://{F}/PlayfairDisplay-Italic.ttf)}}
@font-face{{font-family:Inter;src:url(file://{F}/Inter.ttf)}}
body{{margin:0}}
#c{{width:1600px;background:#F2EDE6;position:relative;font-family:Inter;color:#0A0A0A;box-sizing:border-box;padding:0 90px 140px}}
.bar{{position:absolute;top:0;left:0;right:0;height:12px;background:linear-gradient(90deg,#0A0A0A,#3D1E25 55%,#C47E8A)}}
.eb{{padding-top:90px;font-size:30px;font-weight:700;letter-spacing:.22em;color:#A35F6D;text-transform:uppercase}}
h1{{font-family:Playfair;font-weight:800;font-size:96px;margin:24px 0 0;line-height:1.08}}
h1 i{{font-weight:400;color:#C47E8A}}
.sub{{font-size:36px;color:#444;margin-top:22px;line-height:1.4}}
.blk{{margin-top:48px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:32px}}
.card{{background:#F9F6F1;border:3px solid #E8E1D8;border-radius:30px;padding:44px 44px 48px;display:flex;gap:32px;align-items:flex-start}}
.card.span{{grid-column:1 / -1}}
.card.hl{{background:#F3E3E5;border-color:#E8C4CB}}
.n{{flex:0 0 84px;height:84px;border-radius:50%;background:#0A0A0A;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:38px}}
.hl .n{{background:#C47E8A}}
.t{{font-weight:700;font-size:46px;margin:6px 0 14px;line-height:1.15}}
.ts{{font-family:Playfair;font-style:italic;font-size:36px;color:#A35F6D;margin:-4px 0 14px}}
.d{{font-size:34px;line-height:1.45;color:#2a2a2a}}
.cmp{{display:grid;grid-template-columns:1fr 1fr;gap:32px}}
.col{{border-radius:30px;padding:48px 48px 52px;border:3px solid #E8E1D8;background:#F9F6F1}}
.col.pink{{background:#F3E3E5;border-color:#E8C4CB}}
.col.dark{{background:#0A0A0A;border-color:#0A0A0A;color:#fff}}
.ch{{font-family:Playfair;font-weight:800;font-size:56px;line-height:1.1}}
.col.dark .ch{{color:#E8B4BE}}
.cs{{font-size:30px;color:#666;margin-top:12px}}
.col.dark .cs{{color:#bbb}}
.li{{display:flex;gap:24px;align-items:flex-start;font-size:36px;line-height:1.4;margin-top:30px}}
.dot{{flex:0 0 18px;height:18px;border-radius:50%;background:#C9BCB2;margin-top:17px}}
.pink .dot{{background:#C47E8A}}
.ic{{flex:0 0 56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;margin-top:-2px}}
.ic.check{{background:#0A0A0A;color:#fff}}
.ic.x{{background:#C47E8A;color:#fff}}
.box{{background:#F9F6F1;border:3px solid #E8E1D8;border-radius:30px;padding:48px 52px 40px}}
.box.pink{{background:#F3E3E5;border-color:#E8C4CB}}
.bh{{font-size:28px;font-weight:700;letter-spacing:.18em;color:#A35F6D;margin-bottom:34px;text-transform:uppercase}}
.l{{margin-bottom:38px}}
.top{{display:flex;justify-content:space-between;align-items:baseline;gap:30px;margin-bottom:16px}}
.lab{{font-weight:700;font-size:38px;line-height:1.3}}
.v{{font-family:Playfair;font-weight:800;font-size:60px;white-space:nowrap}}
.v small{{font-family:Inter;font-size:34px;color:#A35F6D;font-weight:700}}
.trk{{height:44px;background:#E8E1D8;border-radius:22px;overflow:hidden}}
.box.pink .trk{{background:#fff}}
.fill{{height:100%;border-radius:22px}}
.rose{{background:linear-gradient(90deg,#3D1E25,#C47E8A)}}
.ink{{background:#0A0A0A}}
.src{{font-size:26px;color:#555;line-height:1.4}}
.tl{{background:#F9F6F1;border:3px solid #E8E1D8;border-radius:30px;padding:24px 52px}}
.tr{{display:flex;gap:40px;align-items:center;padding:24px 0;border-bottom:2px solid #E8E1D8}}
.tr:last-child{{border-bottom:0}}
.tt{{flex:0 0 300px;font-family:Playfair;font-weight:800;font-size:46px}}
.tp{{flex:0 0 26px;height:26px;border-radius:50%;background:#C47E8A;box-shadow:0 0 0 8px #F3E3E5}}
.td{{font-size:36px;line-height:1.4}}
.pl{{background:#F9F6F1;border:3px solid #E8E1D8;border-radius:30px;padding:44px 52px}}
.plab{{font-weight:700;font-size:38px;margin-bottom:28px;line-height:1.35}}
.pw{{display:flex;flex-wrap:wrap;gap:20px}}
.p{{background:#F3E3E5;border:3px solid #E8C4CB;border-radius:999px;padding:16px 34px;font-size:32px;font-weight:600}}
.rule{{background:#0A0A0A;color:#fff;border-radius:30px;padding:44px 52px;font-size:38px;line-height:1.45}}
.rule i{{font-family:Playfair;color:#E8B4BE;font-size:46px;margin-right:16px}}
.row{{display:flex;gap:40px;align-items:center;background:#F9F6F1;border:3px solid #E8E1D8;border-radius:30px;padding:40px 48px;margin-bottom:24px}}
.row.hl{{background:#0A0A0A;border-color:#0A0A0A;color:#fff}}
.row.hl .n{{background:#C47E8A}}
.row .t{{margin:0 0 8px;font-family:Playfair;font-weight:800;font-size:50px}}
.row.hl .t{{color:#E8B4BE}}
.row.hl .d{{color:#eee}}
.ft{{position:absolute;bottom:52px;left:90px;right:90px;display:flex;justify-content:space-between;font-size:26px;letter-spacing:.3em;color:#555}}
"""


def card(it, i, numbers, span):
    cls = "card" + (" hl" if it.get("hl") else "") + (" span" if span else "")
    num = f'<div class="n">{i}</div>' if numbers else ""
    sub = f'<div class="ts">{E(it["sub"])}</div>' if it.get("sub") else ""
    d = f'<div class="d">{E(it["d"])}</div>' if it.get("d") else ""
    return f'<div class="{cls}">{num}<div><div class="t">{E(it["t"])}</div>{sub}{d}</div></div>'


def block(b):
    k = b["type"]
    if k == "steps":
        its = b["items"]; nums = b.get("numbers", True); out = []
        for i, it in enumerate(its, 1):
            span = len(its) % 2 == 1 and i == len(its)
            out.append(card(it, i, nums, span))
        return f'<div class="grid">{"".join(out)}</div>'
    if k == "rows":
        return "".join(
            f'<div class="row{" hl" if it.get("hl") else ""}"><div class="n">{i}</div><div><div class="t">{E(it["t"])}</div><div class="d">{E(it["d"])}</div></div></div>'
            for i, it in enumerate(b["items"], 1))
    if k == "compare":
        cols = []
        for c in b["cols"]:
            icon = c.get("icon", "dot")
            lis = []
            for x in c["items"]:
                mark = '<div class="dot"></div>' if icon == "dot" else f'<div class="ic {icon}">{"✓" if icon == "check" else "✕"}</div>'
                lis.append(f'<div class="li">{mark}<div>{E(x)}</div></div>')
            sub = f'<div class="cs">{E(c["sub"])}</div>' if c.get("sub") else ""
            cols.append(f'<div class="col {c.get("style","light")}"><div class="ch">{E(c["title"])}</div>{sub}{"".join(lis)}</div>')
        return f'<div class="cmp">{"".join(cols)}</div>'
    if k == "bars":
        rows = "".join(
            f'<div class="l"><div class="top"><div class="lab">{E(it["label"])}</div><div class="v">{it["value"]}</div></div>'
            f'<div class="trk"><div class="fill {it.get("color","rose")}" style="width:{it["pct"]}%"></div></div></div>'
            for it in b["items"])
        head = f'<div class="bh">{E(b["head"])}</div>' if b.get("head") else ""
        src = f'<div class="src">{E(b["source"])}</div>' if b.get("source") else ""
        return f'<div class="box {b.get("style","")}">{head}{rows}{src}</div>'
    if k == "timeline":
        return '<div class="tl">' + "".join(
            f'<div class="tr"><div class="tt">{E(it["time"])}</div><div class="tp"></div><div class="td">{E(it["d"])}</div></div>'
            for it in b["items"]) + "</div>"
    if k == "pills":
        return f'<div class="pl"><div class="plab">{E(b["label"])}</div><div class="pw">' + "".join(
            f'<div class="p">{E(x)}</div>' for x in b["items"]) + "</div></div>"
    if k == "rule":
        return f'<div class="rule"><i>{E(b.get("label","My rule:"))}</i>{E(b["text"])}</div>'
    if k == "head":
        return f'<div class="bh">{E(b["text"])}</div>'
    raise ValueError(k)


def page(ch):
    blocks = "".join(f'<div class="blk">{block(b)}</div>' for b in ch["blocks"])
    sub = f'<div class="sub">{E(ch["sub"])}</div>' if ch.get("sub") else ""
    return (f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div id="c"><div class="bar"></div>'
            f'<div class="eb">{E(ch["eyebrow"])}</div><h1>{ch["title"]}</h1>{sub}{blocks}'
            f'<div class="ft"><span>LISA HAVEN</span><span>LISAHAVEN.CO</span></div></div></body></html>')


CHECK = """()=>{const c=document.getElementById('c').getBoundingClientRect();const bad=[];
document.querySelectorAll('#c *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>c.right+1||r.left<c.left-1))bad.push('edge:'+e.className+':'+e.textContent.slice(0,30))});
document.querySelectorAll('.card,.col,.box,.row,.rule,.pl,.tl,.lab,.t,.d').forEach(e=>{if(e.scrollWidth>e.clientWidth+2)bad.push('overflow:'+e.className+':'+e.textContent.slice(0,30))});
const ft=document.querySelector('.ft').getBoundingClientRect();const last=[...document.querySelectorAll('.blk')].pop().getBoundingClientRect();
if(last.bottom>ft.top-30)bad.push('footer overlap');return bad}"""


async def main(spec, only):
    charts = json.load(open(spec))["charts"]
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1600, "height": 1200})
        for ch in charts:
            if only and ch["slug"] not in only:
                continue
            tmp = ROOT / "tools" / ".chart.html"
            tmp.write_text(page(ch))
            await pg.goto(f"file://{tmp}")
            await pg.wait_for_timeout(250)
            bad = await pg.evaluate(CHECK)
            out = ROOT / "images" / "uploads" / ch["out"]
            await pg.locator("#c").screenshot(path=str(out), type="jpeg", quality=88)
            h = await pg.evaluate("document.getElementById('c').offsetHeight")
            print(("OK  " if not bad else "FIX ") + ch["out"], h, bad)
            tmp.unlink()
        await b.close()


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1], sys.argv[2:]))
