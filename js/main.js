/* Boss Computers – site scripts (v2) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var WA_NUMBER = '919884992199';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- header state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- count-up helper ---------- */
  function countUp(el, from, to, ms) {
    if (reduceMotion) { el.textContent = to; return; }
    var start = null;
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / ms);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- reveal on scroll ---------- */
  function onReveal(el) {
    el.classList.add('in');
    // step 2 counter
    if (el.classList.contains('step')) {
      var c = el.querySelector('.count');
      if (c) countUp(c, +c.dataset.from, +c.dataset.to, 2200);
    }
    // dashboard: show "before", then animate to "after repair"
    if (el.classList.contains('dash')) {
      var n = el.querySelector('.ring-num .count');
      setTimeout(function () {
        el.classList.add('fixed');
        countUp(n, +n.dataset.from, +n.dataset.to, 2000);
      }, reduceMotion ? 0 : 1800);
    }
  }
  var revealEls = document.querySelectorAll('.reveal, .speed-card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { onReveal(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(idx, 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(onReveal);
  }

  /* ---------- active nav link ---------- */
  var links = nav.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['health', 'services', 'process', 'faq', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) navIO.observe(s);
    });
  }

  /* =========================================================
     Services: data + panel
     ========================================================= */
  var SERVICES = [
    { title: 'Chip-Level Service', type: 'Laptop', short: 'Chip-level',
      desc: 'Component-level motherboard repair for dead laptops, no power, no display and charging faults. Fixing the board instead of replacing it saves you money.',
      points: ['No power / dead motherboard', 'No display & charging faults', 'Shorted ICs and components'] },
    { title: 'Upgradation & Installation', type: 'Laptop', short: 'Upgrades',
      desc: 'Give your laptop a second life with the right upgrades and a clean, properly set-up system.',
      points: ['SSD & RAM upgrades', 'Windows / OS installation', 'Drivers & software setup'] },
    { title: 'Broken Laptop Rework', type: 'Laptop', short: 'Rework',
      desc: 'Dropped, cracked or damaged? We rework broken bodies and hinges and replace damaged parts.',
      points: ['Body & hinge rework', 'Screen replacement', 'Keyboard & panel repair'] },
    { title: 'General Service', type: 'Laptop', short: 'General',
      desc: 'Routine care that keeps your laptop cool and quick, with a full health check.',
      points: ['Internal cleaning & fan service', 'Thermal paste for overheating', 'Battery & adapter check'] },
    { title: 'Computer Upgradation', type: 'Computer', short: 'PC upgrade',
      desc: 'Make your desktop faster without buying a new one. Parts matched to your system.',
      points: ['RAM and SSD / NVMe', 'Graphics card', 'Power supply'] },
    { title: 'Computer Assembling', type: 'Computer', short: 'PC build',
      desc: 'Custom PCs built for your work and budget. Parts chosen with you, assembled and tested before handover.',
      points: ['Office & study PCs', 'Gaming builds', 'Editing workstations'] }
  ];

  var current = 0;
  var listEl = document.getElementById('svc-list');
  var labelsEl = document.getElementById('crystal-labels');
  var titleEl = document.getElementById('svc-title');
  var descEl = document.getElementById('svc-desc');
  var pointsEl = document.getElementById('svc-points');
  var countEl = document.getElementById('svc-count');
  var typeEl = document.getElementById('svc-type');
  var btns = [], labels = [];

  if (listEl) {
    SERVICES.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'svc-btn'; b.setAttribute('role', 'tab');
      b.innerHTML = '<span>' + s.title + '</span><small>0' + (i + 1) + '</small>';
      b.addEventListener('click', function () { select(i); });
      listEl.appendChild(b); btns.push(b);

      var l = document.createElement('button');
      l.type = 'button'; l.className = 'c-label'; l.tabIndex = -1; l.setAttribute('aria-hidden', 'true');
      l.innerHTML = '<b>' + (i + 1) + '</b>' + s.short;
      l.addEventListener('click', function () { select(i); });
      labelsEl.appendChild(l); labels.push(l);
    });
    select(0, true);
  }

  function select(i, silent) {
    current = i;
    var s = SERVICES[i];
    titleEl.textContent = s.title;
    descEl.textContent = s.desc;
    countEl.textContent = 'Service ' + (i + 1) + ' of ' + SERVICES.length;
    typeEl.textContent = s.type;
    pointsEl.innerHTML = '';
    s.points.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; pointsEl.appendChild(li); });
    btns.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === i)); });
    labels.forEach(function (l, k) { l.classList.toggle('on', k === i); });
    if (!silent) {
      [titleEl, descEl, pointsEl].forEach(function (el) { el.classList.remove('svc-anim'); void el.offsetWidth; el.classList.add('svc-anim'); });
      focusVertex(i);
    }
  }

  /* =========================================================
     Crystal: rotating wireframe octahedron (canvas)
     6 vertices = 6 services
     ========================================================= */
  var canvas = document.getElementById('crystal');
  var targetRotY = null;
  function focusVertex(i) {
    // turn the crystal so the chosen equator vertex faces the viewer
    var yaw = [null, 0, -Math.PI / 2, Math.PI, Math.PI / 2, null][i];
    if (yaw === null) return;
    targetRotY = yaw;
  }

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var H = 1.42;
    // order: top, front, right, back, left, bottom  (matches SERVICES order)
    var V = [[0, H, 0], [0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, -H, 0]];
    var F = [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]];
    var E = [[0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [5, 3], [5, 4], [1, 2], [2, 3], [3, 4], [4, 1]];
    var rotY = 0.6, rotX = -0.32, velY = reduceMotion ? 0 : 0.0042;
    var W = 0, Hh = 0, dpr = 1, running = false, visible = true;
    var dragging = false, lastX = 0, dragVel = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; Hh = r.height;
      canvas.width = W * dpr; canvas.height = Hh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function project(p) {
      var x = p[0], y = p[1], z = p[2];
      var cy = Math.cos(rotY), sy = Math.sin(rotY);
      var x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      var cx = Math.cos(rotX), sx = Math.sin(rotX);
      var y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      var scale = Math.min(W, Hh) * (W < 480 ? 0.27 : 0.3);
      var persp = 3.2 / (3.2 - z2);
      return { x: W / 2 + x1 * scale * persp, y: Hh * 0.47 - y1 * scale * persp, z: z2, wx: x1, wy: y1 };
    }

    function draw() {
      if (!W) return;
      ctx.clearRect(0, 0, W, Hh);
      var P = V.map(project);

      // inner glow
      var g = ctx.createRadialGradient(W / 2, Hh * 0.47, 0, W / 2, Hh * 0.47, Math.min(W, Hh) * 0.42);
      g.addColorStop(0, 'rgba(244,163,107,0.22)');
      g.addColorStop(0.45, 'rgba(123,63,208,0.12)');
      g.addColorStop(1, 'rgba(123,63,208,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);

      // faces, back to front
      var faces = F.map(function (f) {
        var a = P[f[0]], b = P[f[1]], c = P[f[2]];
        var z = (a.z + b.z + c.z) / 3;
        // screen-space normal sign for facing; light from upper-left
        var ux = b.x - a.x, uy = b.y - a.y, vx = c.x - a.x, vy = c.y - a.y;
        var facing = (ux * vy - uy * vx);
        var lx = ((a.x + b.x + c.x) / 3 - W / 2) / (W * 0.3);
        return { f: f, z: z, front: facing < 0, lx: lx };
      }).sort(function (p, q) { return p.z - q.z; });

      faces.forEach(function (o) {
        var a = P[o.f[0]], b = P[o.f[1]], c = P[o.f[2]];
        var grad = ctx.createLinearGradient(a.x, a.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        var warm = Math.max(0, Math.min(1, 0.5 - o.lx * 0.6));
        var alpha = o.front ? 0.34 : 0.12;
        grad.addColorStop(0, 'rgba(' + Math.round(201 + 43 * warm) + ',' + Math.round(168 - 5 * warm) + ',' + Math.round(240 - 133 * warm) + ',' + alpha + ')');
        grad.addColorStop(1, 'rgba(123,63,208,' + (alpha * 0.45) + ')');
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
      });

      // edges
      E.forEach(function (e) {
        var a = P[e[0]], b = P[e[1]];
        var depth = (a.z + b.z) / 2;
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.28 + depth * 0.32).toFixed(3) + ')';
        ctx.lineWidth = depth > 0 ? 1.4 : 0.8;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });

      // vertices + labels
      P.forEach(function (p, i) {
        var on = i === current;
        ctx.beginPath();
        ctx.arc(p.x, p.y, on ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = on ? '#F4A36B' : 'rgba(255,255,255,' + (0.55 + p.z * 0.4) + ')';
        if (on) { ctx.shadowColor = 'rgba(244,163,107,.9)'; ctx.shadowBlur = 18; }
        ctx.fill(); ctx.shadowBlur = 0;

        var l = labels[i];
        if (l) {
          var dx = p.x - W / 2, dy = p.y - Hh * 0.47, d = Math.sqrt(dx * dx + dy * dy) || 1;
          var ox = (dx / d) * 30, oy = (dy / d) * 22;
          var lx = p.x + ox, ly = p.y + oy;
          var hw = (l.offsetWidth || 90) / 2 + 4;
          lx = Math.max(hw, Math.min(W - hw, lx));
          l.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px) translate(-50%,-50%)';
          l.style.opacity = on ? 1 : (0.5 + (p.z + 1) * 0.25).toFixed(2);
          l.style.zIndex = Math.round((p.z + 2) * 10);
        }
      });
    }

    function tick() {
      if (!running) return;
      if (!dragging) {
        if (targetRotY !== null) {
          var diff = Math.atan2(Math.sin(targetRotY - rotY), Math.cos(targetRotY - rotY));
          rotY += diff * 0.08;
          if (Math.abs(diff) < 0.002) targetRotY = null;
        } else {
          rotY += velY + dragVel;
          dragVel *= 0.94;
        }
      }
      draw();
      requestAnimationFrame(tick);
    }
    function start() { if (!running && visible) { running = true; requestAnimationFrame(tick); } }
    function stop() { running = false; }

    // drag to spin
    canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; targetRotY = null; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      rotY += dx * 0.01; dragVel = dx * 0.0015;
      if (!running) draw();
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) { canvas.addEventListener(ev, function () { dragging = false; }); });

    window.addEventListener('resize', resize);
    resize();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !reduceMotion) start(); else stop();
      }).observe(canvas);
    }
    if (reduceMotion) { draw(); }
    // keep redrawing on interaction even with reduced motion
    if (reduceMotion) {
      canvas.addEventListener('pointermove', draw);
      if (listEl) listEl.addEventListener('click', function () { if (targetRotY !== null) { rotY = targetRotY; targetRotY = null; } draw(); });
    }
  }

  /* =========================================================
     Enquiry form -> WhatsApp
     ========================================================= */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var F2 = form.elements;
    function setError(input, msgEl, msg) {
      msgEl.textContent = msg;
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = F2.name.value.trim();
      var phone = F2.phone.value.replace(/[^\d]/g, '');
      var nameOk = !!name;
      var phoneOk = phone.length >= 10 && phone.length <= 13;
      setError(F2.name, document.getElementById('e-name'), nameOk ? '' : 'Please enter your name.');
      setError(F2.phone, document.getElementById('e-phone'), phoneOk ? '' : 'Please enter a valid 10-digit phone number.');
      if (!nameOk || !phoneOk) { (nameOk ? F2.phone : F2.name).focus(); return; }

      var lines = [
        'Hi Boss Computers, I have an enquiry.',
        '',
        'Name: ' + name,
        'Phone: ' + F2.phone.value.trim(),
        'Device: ' + F2.device.value,
        F2.brand.value.trim() ? 'Brand/Model: ' + F2.brand.value.trim() : null,
        'Service: ' + F2.service.value,
        F2.message.value.trim() ? 'Problem: ' + F2.message.value.trim() : null
      ].filter(function (l) { return l !== null; });

      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
