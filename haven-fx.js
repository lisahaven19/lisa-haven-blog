/* lisahaven.co site effects (approved Nov 10, 2026). Shared by every page. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    var footer = document.querySelector('footer');
    var statement = footer && footer.querySelector('.footer-statement');

    /* 1. Slider on the footer seam */
    if (statement && !footer.querySelector('.fx-seam')) {
      var items = ['AI', 'Prompts', 'Entrepreneurship', 'AI In Real Life', 'VIXA · HAVENLY · LUMAPROMPT', 'Mom Life', 'The Journey', 'Mindset & Growth'];
      var seam = document.createElement('div'); seam.className = 'fx-seam'; seam.setAttribute('aria-hidden', 'true');
      var track = document.createElement('div'); track.className = 'fx-seam-track';
      for (var r = 0; r < 4; r++) items.forEach(function (t) {
        var s = document.createElement('span'); s.textContent = t; track.appendChild(s);
        var d = document.createElement('span'); d.className = 'fx-dot'; d.textContent = '✦'; track.appendChild(d);
      });
      seam.appendChild(track);
      statement.parentNode.insertBefore(seam, statement.nextSibling);
    }

    /* 2. Footer sparkles */
    if (statement && !reduce) {
      var spots = [[6, 18, 14], [14, 62, 10], [24, 30, 8], [33, 78, 12], [72, 20, 10], [80, 66, 15], [90, 34, 9], [94, 80, 12], [48, 8, 8], [58, 90, 9]];
      spots.forEach(function (p, i) {
        var s = document.createElement('span'); s.className = 'fx-sparkle'; s.textContent = '✦'; s.setAttribute('aria-hidden', 'true');
        s.style.left = p[0] + '%'; s.style.top = p[1] + '%'; s.style.fontSize = p[2] + 'px';
        s.style.animationDelay = (i * 0.47).toFixed(2) + 's'; s.style.animationDuration = (3.8 + (i % 4) * 0.6) + 's';
        statement.appendChild(s);
      });
    }

    /* 5. Headline types itself (homepage) */
    var title = document.querySelector('h1.hero-title');
    if (title && !reduce) {
      var chars = [];
      (function wrap(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split('').forEach(function (c) {
              var sp = document.createElement('span'); sp.className = 'fx-ch'; sp.textContent = c; frag.appendChild(sp); chars.push(sp);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') { wrap(n); }
        });
      })(title);
      title.classList.add('fx-type');
      var i = 0;
      setTimeout(function tick() {
        if (i > 0) chars[i - 1].classList.remove('caret');
        if (i >= chars.length) return;
        chars[i].classList.add('on', 'caret'); i++;
        if (i >= chars.length) { setTimeout(function () { chars[chars.length - 1].classList.remove('caret'); }, 1400); return; }
        setTimeout(tick, 120);
      }, 550);
    }

    /* 7. Reading progress bar on pages without one */
    if (!document.getElementById('progressBar')) {
      var bar = document.createElement('div'); bar.className = 'fx-progress'; document.body.appendChild(bar);
      var onProg = function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
      };
      window.addEventListener('scroll', onProg, { passive: true }); onProg();
    }

    /* 10. Quotes fade in, underline draws itself */
    if ('IntersectionObserver' in window && !reduce) {
      var qio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-in'); qio.unobserve(e.target); } });
      }, { threshold: 0.35 });
      var watchQuotes = function () {
        document.querySelectorAll('.post-body blockquote:not(.fx-quote)').forEach(function (q) { q.classList.add('fx-quote'); qio.observe(q); });
        document.querySelectorAll('.qb-hl:not(.fx-line)').forEach(function (q) { q.classList.add('fx-line'); qio.observe(q); });
      };
      watchQuotes();
      var host = document.querySelector('main');
      if (host && 'MutationObserver' in window) {
        var pending = false;
        new MutationObserver(function () {
          if (pending) return; pending = true;
          setTimeout(function () { pending = false; watchQuotes(); }, 200);
        }).observe(host, { childList: true, subtree: true });
      }
    }

    /* 11. Heart burst */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.like-btn, #likeBtn');
      if (!btn || reduce) return;
      var b = btn.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      for (var k = 0; k < 12; k++) {
        var h = document.createElement('span'); h.className = 'fx-heart'; h.textContent = k % 3 === 0 ? '🖤' : '♥';
        var ang = (Math.PI * 2 * k) / 12 + Math.random() * 0.5, dist = 50 + Math.random() * 60;
        h.style.left = cx + 'px'; h.style.top = cy + 'px';
        h.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
        h.style.setProperty('--dy', (Math.sin(ang) * dist - 40).toFixed(0) + 'px');
        h.style.setProperty('--s', (0.8 + Math.random() * 0.9).toFixed(2));
        h.style.setProperty('--r', (Math.random() * 60 - 30).toFixed(0) + 'deg');
        document.body.appendChild(h);
        (function (el) { setTimeout(function () { el.remove(); }, 1200); })(h);
      }
    });

    /* 12. Smooth fade between pages */
    if (!reduce) {
      document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
        if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
        if (url.pathname === location.pathname && url.search === location.search) return;
        e.preventDefault();
        document.documentElement.classList.add('fx-leaving');
        setTimeout(function () { location.href = url.href; }, 190);
      });
      window.addEventListener('pageshow', function () { document.documentElement.classList.remove('fx-leaving'); });
    }

    /* 13. Rose glow that follows the mouse (desktop only) */
    if (finePointer && !reduce) {
      var glow = document.createElement('div'); glow.className = 'fx-glow'; glow.setAttribute('aria-hidden', 'true'); document.body.appendChild(glow);
      var tx = 0, ty = 0, x = 0, y = 0, running = false;
      var loop = function () {
        x += (tx - x) * 0.14; y += (ty - y) * 0.14;
        glow.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) requestAnimationFrame(loop); else running = false;
      };
      window.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!glow.classList.contains('on')) { x = tx; y = ty; glow.classList.add('on'); }
        if (!running) { running = true; requestAnimationFrame(loop); }
      }, { passive: true });
      document.addEventListener('mouseleave', function () { glow.classList.remove('on'); });
    }

    /* 14. Menu bar shrinks and blurs on scroll (pages using .navbar) */
    var nb = document.querySelector('.navbar');
    if (nb) {
      var onNav = function () { nb.classList.toggle('fx-scrolled', window.scrollY > 40); };
      window.addEventListener('scroll', onNav, { passive: true }); onNav();
    }
  });
})();
