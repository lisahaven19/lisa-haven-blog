/*
 * lisahaven.co shared sign up (Join The Haven)
 * ------------------------------------------------------------
 * 1 file for every page. Add this line before </body> on any page:
 *   <script src="/haven-signup.js"></script>
 * Post pages add data-auto-popup to that script tag for the 60 second pop-up.
 *
 * What it does:
 *  - Every "Join the Inner Circle", "Join The Haven" and "Subscribe Free"
 *    button or link opens the branded sign up pop-up right where the reader is.
 *    (Any link to #newsletter or #post-signup, or anything with data-open-signup.)
 *  - Any element with data-haven-signup gets the Beehiiv form placed inside it.
 *  - Post pages: pop-up opens on its own after 60 seconds of reading,
 *    only once per visit, and never again after someone signs up.
 */
(function () {
  'use strict';
  if (window.__havenSignup) return;
  window.__havenSignup = true;

  var FORM_ID = '422f6a2e-d4cd-4500-a21b-b5883beb30c2';
  var LOADER = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
  var DELAY = 60000;              // 60 seconds of reading
  var SEEN = 'havenPopSeenVisit'; // sessionStorage: shown once per visit
  var JOINED = 'havenSubscribed'; // localStorage: signed up, never auto show again
  var me = document.currentScript;
  var AUTO = !!(me && me.hasAttribute('data-auto-popup'));

  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // ── Styles (brand: cream #F2EDE6, ink #0A0A0A, dusty rose #C47E8A, Playfair Display + Inter) ──
  var css = ''
    + '.hs-pop{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,10,10,0.55);opacity:0;visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s;}'
    + '.hs-pop.open{opacity:1;visibility:visible;transition:opacity .3s ease;}'
    + '.hs-card{position:relative;box-sizing:border-box;width:100%;max-width:440px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;-webkit-overflow-scrolling:touch;background:#F2EDE6;border-radius:20px;padding:44px 28px 24px;text-align:center;box-shadow:0 24px 60px rgba(10,10,10,0.3);transform:translateY(24px);transition:transform .4s cubic-bezier(0.22,1,0.36,1);font-family:"Inter",system-ui,sans-serif;color:#0A0A0A;}'
    + '.hs-pop.open .hs-card{transform:none;}'
    + '.hs-card::before{content:"";position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0A0A0A 0%,#5a2a3a 50%,#C47E8A 100%);border-radius:20px 20px 0 0;}'
    + '.hs-close{position:absolute;top:12px;right:12px;width:44px;height:44px;border:0;border-radius:50%;background:#E8E1D8;color:#0A0A0A;font-size:18px;line-height:44px;cursor:pointer;padding:0;}'
    + '.hs-close:hover,.hs-close:focus-visible{background:#e8c4cb;outline:none;}'
    + '.hs-eyebrow{display:block;font:700 11px/1.4 "Inter",sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#a35f6d;margin:0 0 10px;}'
    + '.hs-card h3{font-family:"Playfair Display",Georgia,serif;font-size:26px;font-weight:700;line-height:1.25;margin:0 0 10px;color:#0A0A0A;}'
    + '.hs-card h3 em{color:#C47E8A;font-style:italic;}'
    + '.hs-card p{font-size:15px;line-height:1.6;color:#5a5550;margin:0 0 18px;}'
    + '.hs-form{min-height:60px;width:100%;}'
    + '.hs-form iframe{max-width:100% !important;}'
    + '.hs-note{font-size:11px !important;letter-spacing:.12em;text-transform:uppercase;color:#8a847d !important;margin:12px 0 0 !important;}'
    + '.hs-thanks{font:600 14px/1.5 "Inter",sans-serif !important;color:#a35f6d !important;margin:10px 0 0 !important;}'
    + '.hs-band .hs-thanks,.hs-mini .hs-thanks,.post-signup .hs-thanks{color:#e8c4cb !important;}'
    + '.hs-later{margin-top:8px;min-height:44px;background:none;border:0;font:500 13px "Inter",sans-serif;color:#8a847d;text-decoration:underline;cursor:pointer;}'
    + 'html.hs-lock,html.hs-lock body{overflow:hidden !important;}'
    /* Homepage box right under the hero */
    + '.hs-band{background:#0A0A0A;border-left:4px solid #C47E8A;padding:30px 64px;display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;box-sizing:border-box;}'
    + '.hs-band-text{flex:1 1 320px;min-width:0;}'
    + '.hs-band .hs-eyebrow{color:#e8c4cb;margin-bottom:6px;}'
    + '.hs-band h2{font-family:"Playfair Display",Georgia,serif;font-size:26px;font-weight:700;line-height:1.25;color:#fff;margin:0 0 6px;}'
    + '.hs-band h2 em{color:#C47E8A;font-style:italic;}'
    + '.hs-band p{font-size:14px;line-height:1.6;color:rgba(255,255,255,0.72);margin:0;}'
    + '.hs-band-form{flex:1 1 360px;max-width:520px;min-width:0;min-height:60px;}'
    + '.hs-band .hs-band-note{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:8px 0 0;}'
    + '@media (max-width:768px){.hs-band{padding:26px 24px;gap:16px;}.hs-band h2{font-size:22px;}.hs-band-form{flex-basis:100%;}}'
    /* Small box halfway through a post */
    + '.hs-mini{margin:36px 0;padding:24px 22px 18px;background:#0A0A0A;border-left:4px solid #C47E8A;text-align:center;box-sizing:border-box;}'
    + '.hs-mini .hs-eyebrow{color:#e8c4cb;margin-bottom:6px;}'
    + '.hs-mini h3{font-family:"Playfair Display",Georgia,serif;font-size:20px;font-weight:700;line-height:1.3;color:#fff;margin:0 0 14px;}'
    + '.hs-mini-form{max-width:480px;margin:0 auto;min-height:60px;}'
    + '@media (max-width:480px){.hs-card{padding:48px 18px 18px;border-radius:16px;}.hs-card h3{font-size:22px;}.hs-mini{padding:22px 16px 16px;}}';
  var st = document.createElement('style');
  st.id = 'haven-signup-css';
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  // ── Put the Beehiiv form inside a box ──
  // Beehiiv's own form page, placed directly (used by the pop-up, and as a backup everywhere)
  var directFrames = [];
  function direct(host) {
    if (host.querySelector('iframe.hs-direct')) return;
    var f = document.createElement('iframe');
    f.className = 'hs-direct';
    f.src = 'https://subscribe-forms.beehiiv.com/v3/forms/' + FORM_ID;
    f.title = 'Join The Haven sign up form';
    f.setAttribute('frameborder', '0');
    f.setAttribute('scrolling', 'no');
    f.style.cssText = 'display:block;width:100%;height:' + (window.innerWidth < 420 ? 104 : 56) + 'px;border:0;background:transparent;';
    host.appendChild(f);
    directFrames.push(f);
  }
  function hasForm(host) {
    var f = host.querySelector('iframe');
    return !!(f && f.getBoundingClientRect().height > 10);
  }
  function mount(host, directOnly) {
    if (!host || host.getAttribute('data-hs-mounted')) return;
    host.setAttribute('data-hs-mounted', '1');
    if (directOnly) { direct(host); return; }
    var s = document.createElement('script');
    s.async = true;
    s.src = LOADER;
    s.setAttribute('data-beehiiv-form', FORM_ID);
    host.appendChild(s);
    // Backup: if Beehiiv's script has not shown the form after 4 seconds, place the form page directly
    setTimeout(function () { if (!hasForm(host)) direct(host); }, 4000);
    // never show 2 forms: if Beehiiv's script finishes late, remove the backup
    setTimeout(function () {
      var d = host.querySelector('iframe.hs-direct'), others = [].filter.call(host.querySelectorAll('iframe'), function (f) { return f !== d && f.getBoundingClientRect().height > 10; });
      if (d && others.length) d.parentNode.removeChild(d);
    }, 9000);
  }

  // Inline boxes load when the reader gets near them (keeps pages fast)
  function mountInline() {
    var hosts = document.querySelectorAll('[data-haven-signup]:not([data-hs-mounted])');
    if (!hosts.length) return;
    if (!('IntersectionObserver' in window)) { hosts.forEach(mount); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); mount(e.target); } });
    }, { rootMargin: '600px 0px' });
    hosts.forEach(function (h) { io.observe(h); });
  }
  window.havenMountSignups = mountInline; // post pages call this after the post renders

  // ── The pop-up ──
  var pop, lastFocus;
  function build() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.className = 'hs-pop';
    pop.id = 'havenPop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-modal', 'true');
    pop.setAttribute('aria-labelledby', 'havenPopTitle');
    pop.setAttribute('aria-hidden', 'true');
    pop.innerHTML = ''
      + '<div class="hs-card">'
      + '<button type="button" class="hs-close" aria-label="Close">&#10005;</button>'
      + '<span class="hs-eyebrow">Join The Haven</span>'
      + '<h3 id="havenPopTitle">The unfiltered <em>insider letter.</em></h3>'
      + '<p>My free weekly letter: how I run 3 companies with AI, what\'s working, and what I\'d do differently.</p>'
      + '<div class="hs-form" id="havenPopForm"></div>'
      + '<p class="hs-note">Free · No spam · Unsubscribe anytime</p>'
      + '<button type="button" class="hs-later">Maybe later</button>'
      + '</div>';
    document.body.appendChild(pop);
    pop.querySelector('.hs-close').addEventListener('click', close);
    pop.querySelector('.hs-later').addEventListener('click', close);
    pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
    return pop;
  }
  function open() {
    build();
    // close the phone menu if it is open
    var mm = document.getElementById('mobileMenu'), hb = document.getElementById('hamburger');
    if (mm && mm.classList.contains('open')) { mm.classList.remove('open'); if (hb) { hb.classList.remove('open'); hb.setAttribute('aria-expanded', 'false'); } }
    lastFocus = document.activeElement;
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('hs-lock');
    mount(document.getElementById('havenPopForm'), true);
    ss(SEEN, '1');
    setTimeout(function () { var c = pop.querySelector('.hs-close'); if (c) c.focus(); }, 50);
  }
  function close() {
    if (!pop) return;
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('hs-lock');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  window.havenOpenSignup = open;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop && pop.classList.contains('open')) close(); });

  // ── Every sign up button opens the pop-up ──
  var WORDS = /join the inner circle|join the haven|subscribe free/i;
  function isTrigger(el) {
    if (el.hasAttribute('data-open-signup')) return true;
    var href = el.getAttribute('href');
    if (href) {
      var h = href.replace(/^https?:\/\/(www\.)?lisahaven\.co/i, '');
      if (/^\/?#(newsletter|post-signup|join)$/.test(h)) return true;
      return (h === '' || h === '#') && WORDS.test(el.textContent || '');
    }
    return (el.tagName === 'BUTTON') && WORDS.test(el.textContent || '') && !el.closest('form');
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var el = e.target.closest && e.target.closest('a, button, [data-open-signup]');
    if (!el || (pop && pop.contains(el)) || !isTrigger(el)) return;
    e.preventDefault();
    e.stopPropagation();
    open();
  }, true);

  // Someone arriving at lisahaven.co/#newsletter from an old link or email still gets the form
  function hashOpen() {
    if (location.hash === '#newsletter' || location.hash === '#post-signup' || location.hash === '#join') {
      open();
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
  }

  // ── Know when someone signs up (Beehiiv tells the page) ──
  window.addEventListener('message', function (e) {
    if (!/beehiiv\.com$/i.test((e.origin || '').replace(/^https?:\/\//, '').split(':')[0])) return;
    var d = e.data, t = '';
    try { t = typeof d === 'string' ? d : JSON.stringify(d); } catch (x) {}
    var frame = null;
    directFrames.forEach(function (f) { if (f.contentWindow === e.source) frame = f; });
    // size Beehiiv's form page to fit when it reports its height
    if (frame && d && typeof d === 'object') {
      var hgt = d.height || (d.payload && d.payload.height) || (d.data && d.data.height);
      if (typeof hgt === 'number' && hgt > 20 && hgt < 600) frame.style.height = Math.ceil(hgt) + 'px';
    }
    if (/BEEHIIV_SUBSCRIBER_FORM_SUBMITTED|beehiiv:submitted/i.test(t)) {
      ls(JOINED, '1');
      if (frame && !frame.parentNode.querySelector('.hs-thanks')) {
        var ok = document.createElement('p');
        ok.className = 'hs-thanks';
        ok.setAttribute('role', 'status');
        ok.textContent = 'Welcome to The Haven. Check your inbox to confirm.';
        frame.parentNode.appendChild(ok);
      }
    }
  });
  if (/[?&](subscribed|joined)=/.test(location.search)) ls(JOINED, '1');

  // ── 60 second pop-up on posts: once per visit, never after signing up ──
  function autoPop() {
    if (!AUTO || ls(JOINED) || ss(SEEN)) return;
    var waited = 0, tick = 1000;
    var t = setInterval(function () {
      if (!document.hidden) waited += tick;   // only counts time the reader is on the page
      if (ls(JOINED) || ss(SEEN)) { clearInterval(t); return; }
      if (waited >= DELAY) {
        clearInterval(t);
        if (pop && pop.classList.contains('open')) return;
        open();
      }
    }, tick);
  }

  function start() { mountInline(); hashOpen(); autoPop(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
