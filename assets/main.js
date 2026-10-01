// Light / dark toggle. Default follows the system; a manual choice is remembered.
(() => {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : media.matches);
  const sync = () => {
    btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  };

  const announce = () => document.dispatchEvent(new Event('themechange'));

  btn.hidden = false;
  sync();
  media.addEventListener('change', () => { sync(); announce(); });

  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
    announce();
    setTimeout(() => root.classList.remove('theme-anim'), 400);
  });
})();

// Canvas art: neural network, synapses, hero waves and a heartbeat line.
// One shared loop that runs only while a band is on screen; a single still frame
// under prefers-reduced-motion. Colours come from the --art tokens (theme aware).
(() => {
  const canvases = [...document.querySelectorAll('[data-art] canvas')];
  if (!canvases.length) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const smooth = (x) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

  // Each canvas reads its colours from its own element, so a band can override the --art tokens
  // (the wine red section does). A probe element turns var() and light-dark() into plain rgb.
  const FALLBACK = ['#f4d35e', '#f9e29a', '#e3b93c', '#2f6b4c', '#d9d9de'];
  let colors = FALLBACK;
  const readColors = (st) => {
    const probe = document.createElement('i');
    probe.style.display = 'none';
    st.canvas.parentElement.append(probe);
    st.colors = ['--art-a', '--art-b', '--art-c', '--field', '--line'].map((v, i) => {
      probe.style.color = `var(${v})`;
      return getComputedStyle(probe).color || FALLBACK[i];
    });
    probe.remove();
  };

  // Sparse network: drifting nodes, faint links between neighbours, and small pulses
  // of light travelling along a link now and then.
  const network = {
    init(st) {
      const n = Math.min(90, Math.max(10, Math.round((st.w * st.h) / 9000)));
      st.reach = Math.min(190, Math.max(110, st.w * 0.2));
      st.pulses = [];
      st.nodes = Array.from({ length: n }, () => {
        const a = rand(0, TAU), v = rand(5, 13);
        return { x: rand(0, st.w), y: rand(0, st.h), vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rand(1.6, 3.2) };
      });
    },
    step(st, dt) {
      const m = 16;
      for (const p of st.nodes) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -m) p.x = st.w + m; else if (p.x > st.w + m) p.x = -m;
        if (p.y < -m) p.y = st.h + m; else if (p.y > st.h + m) p.y = -m;
      }
      for (const q of st.pulses) q.t += dt / q.dur;
      st.pulses = st.pulses.filter((q) => q.t < 1);
      if (st.pulses.length < 14 && Math.random() < dt * 0.9 * ((st.w * st.h) / 190000)) {
        const a = st.nodes[Math.floor(Math.random() * st.nodes.length)];
        const near = st.nodes.filter((b) => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < st.reach * 0.9);
        if (near.length) st.pulses.push({ a, b: near[Math.floor(Math.random() * near.length)], t: 0, dur: rand(0.9, 1.6) });
      }
    },
    draw(st) {
      const { ctx, w, h, nodes, reach } = st;
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors[1];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d >= reach) continue;
          ctx.globalAlpha = (1 - d / reach) * 0.55;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = colors[0];
      ctx.globalAlpha = 0.95;
      for (const p of nodes) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = colors[1];
      for (const q of st.pulses) {
        const e = smooth(q.t);
        const x = q.a.x + (q.b.x - q.a.x) * e;
        const y = q.a.y + (q.b.y - q.a.y) * e;
        const fade = Math.sin(Math.PI * q.t);
        ctx.globalAlpha = 0.28 * fade;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
        ctx.globalAlpha = 0.95 * fade;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  };

  // Hero waves: layered thin ribbons that drift slowly on the right of the hero and
  // fade out towards the text. They swell gently around the pointer (fine pointers only).
  const field = {
    init(st) {
      st.n = st.w < 700 ? 9 : 16;
      st.px = st.tx = st.w * 0.7;
      st.py = st.ty = st.h * 0.5;
      st.pw = st.tw = 0;
      st.waves = [
        { k: rand(1.0, 1.4), w: 0.22, a: 1 },
        { k: rand(2.3, 3.0), w: 0.38, a: 0.45 },
        { k: rand(4.5, 6), w: 0.6, a: 0.18 },
      ];
      const hero = st.canvas.closest('section');
      if (!st.bound && hero && !still && window.matchMedia('(pointer: fine)').matches) {
        st.bound = true;
        hero.addEventListener('pointermove', (e) => {
          const r = st.canvas.getBoundingClientRect();
          st.tx = e.clientX - r.left;
          st.ty = e.clientY - r.top;
          st.tw = 1;
        }, { passive: true });
        hero.addEventListener('pointerleave', () => { st.tw = 0; });
      }
    },
    step(st, dt) {
      st.pw += (st.tw - st.pw) * Math.min(1, dt * 2.5);
      st.px += (st.tx - st.px) * Math.min(1, dt * 6);
      st.py += (st.ty - st.py) * Math.min(1, dt * 6);
    },
    draw(st, t) {
      const { ctx, w, h, n, waves } = st;
      const narrow = w < 700;
      const amp = h * 0.11;
      ctx.lineWidth = 1.1;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = colors[3];
      for (let i = 0; i < n; i++) {
        const f = i / (n - 1);
        const y0 = h * (0.3 + 0.62 * f);
        ctx.globalAlpha = (0.1 + 0.28 * f) * (narrow ? 0.7 : 1);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const u = (x / w) * TAU;
          let v = 0;
          for (const m of waves) v += m.a * Math.sin(m.k * u + m.w * t + i * 0.32);
          let y = y0 + v * amp * smooth((x / w - 0.08) / 0.6);
          if (st.pw > 0.01) {
            const dx = x - st.px, dy = y0 - st.py;
            const near = Math.exp(-(dx * dx) / (2 * 170 * 170)) * Math.exp(-(dy * dy) / (2 * 120 * 120));
            y += dy * 0.22 * near * st.pw;
          }
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // fade the left side so the name and text stay perfectly legible
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      if (!narrow) g.addColorStop(0.35, 'rgba(0,0,0,0.9)');
      g.addColorStop(narrow ? 0.9 : 0.7, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    },
  };

  // Heartbeat: a flat line with one ECG complex gliding across it every few seconds.
  const gauss = (r, c, wd, a) => a * Math.exp(-(((r - c) / wd) ** 2));
  const beat = (r) =>
    gauss(r, -0.72, 0.12, 0.14) + gauss(r, -0.1, 0.025, -0.18) + gauss(r, 0, 0.03, 1) +
    gauss(r, 0.09, 0.03, -0.3) + gauss(r, 0.5, 0.13, 0.26);
  const pulse = {
    init() {},
    draw(st, t) {
      const { ctx, w, h } = st;
      const y0 = h / 2;
      const span = Math.min(130, w * 0.28);
      const amp = h * 0.36;
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors[4];
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y0);
      ctx.stroke();

      const period = 6.5;
      const head = still ? w * 0.62 : ((t % period) / period) * (w + 2 * span) - span;
      const env = smooth(head / (w * 0.15)) * smooth((w - head) / (w * 0.15));
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = colors[3];
      ctx.globalAlpha = 0.95 * env;
      ctx.beginPath();
      for (let x = Math.max(0, head - span); x <= Math.min(w, head + span); x += 2) {
        const y = y0 - beat((x - head) / span) * amp;
        x <= Math.max(0, head - span) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
  };

  // Synapses: small neurons with fine branching dendrites. Impulses travel from a cell body
  // out to a branch tip, where a soft ring flashes like a synaptic release.
  const synapse = {
    grow(cx, cy) {
      const nodes = [{ x: cx, y: cy, parent: -1, depth: 0, ph: rand(0, TAU), amp: 0 }];
      const tips = [];
      const branch = (from, angle, depth, steps) => {
        let prev = from;
        for (let k = 0; k < steps; k++) {
          const p = nodes[prev];
          angle += rand(-0.4, 0.4);
          const len = rand(12, 26) * (1 - depth * 0.12);
          nodes.push({ x: p.x + Math.cos(angle) * len, y: p.y + Math.sin(angle) * len, parent: prev, depth, ph: rand(0, TAU), amp: 0 });
          prev = nodes.length - 1;
          if (depth < 3 && k >= 1 && k < steps - 1 && nodes.length < 110 && Math.random() < 0.32) {
            branch(prev, angle + (Math.random() < 0.5 ? -1 : 1) * rand(0.45, 0.9), depth + 1, Math.max(2, steps - 2 - k));
          }
        }
        tips.push(prev);
      };
      const n = Math.floor(rand(4, 7));
      for (let i = 0; i < n; i++) branch(0, (i / n) * TAU + rand(-0.3, 0.3), 0, Math.floor(rand(4, 8)));
      for (const nd of nodes) nd.amp = Math.min(3.2, Math.hypot(nd.x - cx, nd.y - cy) * 0.025);
      return { nodes, tips, pos: nodes.map((nd) => ({ x: nd.x, y: nd.y })) };
    },
    init(st) {
      const count = Math.min(10, Math.max(2, Math.round((st.w * st.h) / 80000)));
      const cols = Math.max(1, Math.round(Math.sqrt((count * st.w) / st.h)));
      const rows = Math.ceil(count / cols);
      st.cells = Array.from({ length: count }, (_, i) =>
        synapse.grow(((i % cols) + rand(0.25, 0.75)) * (st.w / cols), (Math.floor(i / cols) + rand(0.25, 0.75)) * (st.h / rows)));
      st.pulses = [];
      st.rings = [];
    },
    step(st, dt) {
      for (const q of st.pulses) q.t += dt / q.dur;
      for (const q of st.pulses) {
        if (q.t < 1) continue;
        const tip = q.cell.pos[q.path[q.path.length - 1]];
        st.rings.push({ x: tip.x, y: tip.y, t: 0 });
      }
      st.pulses = st.pulses.filter((q) => q.t < 1);
      for (const r of st.rings) r.t += dt / 0.9;
      st.rings = st.rings.filter((r) => r.t < 1);
      if (st.pulses.length < 12 && Math.random() < dt * 0.7 * ((st.w * st.h) / 190000)) {
        const cell = st.cells[Math.floor(Math.random() * st.cells.length)];
        const path = [];
        for (let i = cell.tips[Math.floor(Math.random() * cell.tips.length)]; i >= 0; i = cell.nodes[i].parent) path.push(i);
        path.reverse();
        let total = 0;
        const lens = path.map((id, k) => (k ? (total += Math.hypot(cell.pos[id].x - cell.pos[path[k - 1]].x, cell.pos[id].y - cell.pos[path[k - 1]].y)) : 0));
        st.pulses.push({ cell, path, lens, total, t: 0, dur: 0.8 + total / 220 });
      }
    },
    draw(st, t) {
      const { ctx } = st;
      ctx.lineCap = 'round';
      for (const cell of st.cells) {
        cell.nodes.forEach((nd, i) => {
          cell.pos[i].x = nd.x + Math.sin(t * 0.5 + nd.ph) * nd.amp;
          cell.pos[i].y = nd.y + Math.cos(t * 0.42 + nd.ph) * nd.amp * 0.8;
        });
        ctx.strokeStyle = colors[1];
        for (let d = 0; d <= 3; d++) {
          ctx.lineWidth = Math.max(0.45, 1.25 - d * 0.25);
          ctx.globalAlpha = 0.58 - d * 0.1;
          ctx.beginPath();
          cell.nodes.forEach((nd, i) => {
            if (nd.depth !== d || nd.parent < 0) return;
            ctx.moveTo(cell.pos[nd.parent].x, cell.pos[nd.parent].y);
            ctx.lineTo(cell.pos[i].x, cell.pos[i].y);
          });
          ctx.stroke();
        }
        ctx.fillStyle = colors[1];
        ctx.globalAlpha = 0.8;
        for (const i of cell.tips) {
          ctx.beginPath();
          ctx.arc(cell.pos[i].x, cell.pos[i].y, 1.3, 0, TAU);
          ctx.fill();
        }
        const soma = cell.pos[0];
        ctx.fillStyle = colors[0];
        ctx.globalAlpha = 0.16;
        ctx.beginPath(); ctx.arc(soma.x, soma.y, 11, 0, TAU); ctx.fill();
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(soma.x, soma.y, 4.2, 0, TAU); ctx.fill();
      }
      for (const q of st.pulses) {
        const d = q.t * q.total;
        let k = 1;
        while (k < q.lens.length - 1 && q.lens[k] < d) k++;
        const a = q.cell.pos[q.path[k - 1]], b = q.cell.pos[q.path[k]];
        const f = Math.min(1, Math.max(0, (d - q.lens[k - 1]) / Math.max(1e-6, q.lens[k] - q.lens[k - 1])));
        const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
        ctx.fillStyle = colors[1];
        ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
        ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = colors[1];
      ctx.lineWidth = 1;
      for (const r of st.rings) {
        ctx.globalAlpha = 0.55 * (1 - r.t);
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3 + r.t * 16, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  };

  const arts = { network, synapse, field, pulse };
  const states = canvases.map((canvas) => ({
    canvas,
    ctx: canvas.getContext('2d'),
    art: arts[canvas.parentElement.dataset.art] || network,
    w: 0, h: 0, visible: false,
  }));

  const render = (st, t) => {
    colors = st.colors;
    st.ctx.clearRect(0, 0, st.w, st.h);
    st.art.draw(st, t);
  };

  const resize = (st) => {
    const rect = st.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, rect.width < 768 ? 1.5 : 2);
    st.w = rect.width;
    st.h = rect.height;
    st.canvas.width = Math.round(st.w * dpr);
    st.canvas.height = Math.round(st.h * dpr);
    st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    st.art.init(st);
  };

  const now = () => performance.now() / 1000;
  states.forEach((st) => { readColors(st); resize(st); render(st, now()); });
  document.addEventListener('themechange', () => {
    states.forEach((st) => { readColors(st); render(st, now()); });
  });

  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const st = states.find((s) => s.canvas === e.target);
      if (st) { resize(st); render(st, now()); }
    }
  });
  canvases.forEach((c) => ro.observe(c));

  if (still || !('IntersectionObserver' in window)) return;

  let raf = 0;
  let last = 0;
  const loop = (ts) => {
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    let any = false;
    for (const st of states) {
      if (!st.visible) continue;
      any = true;
      if (st.art.step) st.art.step(st, dt);
      render(st, ts / 1000);
    }
    raf = any ? requestAnimationFrame(loop) : 0;
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const st = states.find((s) => s.canvas === e.target);
      if (st) st.visible = e.isIntersecting;
    }
    if (!raf && states.some((s) => s.visible)) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  states.forEach((st) => io.observe(st.canvas));
})();

// Highlight the nav link of the section currently in view.
(() => {
  const links = [...document.querySelectorAll('.nav nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id], main .dive[id]')];
  if (!('IntersectionObserver' in window) || !links.length) return;
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const a = byId.get(e.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((el) => io.observe(el));
})();

// Split the about statement into words so CSS can light them up one by one.
(() => {
  const el = document.querySelector('.statement');
  if (!el) return;
  let i = 0;
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const part of child.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(part); continue; }
          const span = document.createElement('span');
          span.className = 'w';
          span.style.setProperty('--i', i++);
          span.textContent = part;
          frag.append(span);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    }
  };
  walk(el);
})();

// Reveal sections as they enter the viewport. Content stays visible without JS
// or with reduced motion (the CSS only hides .reveal inside the no-preference query).
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  items.forEach((el) => io.observe(el));
})();
