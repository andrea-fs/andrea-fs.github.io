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

// Art bands: EEG-like biosignal traces and a sparse neural network, drawn on canvas.
// One shared loop that runs only while a band is on screen; a single still frame
// under prefers-reduced-motion. Colours come from the --art tokens (theme aware).
(() => {
  const canvases = [...document.querySelectorAll('.band canvas')];
  if (!canvases.length) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const smooth = (x) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

  let colors = ['#f4d35e', '#f9e29a', '#e3b93c'];
  const readColors = () => {
    const s = getComputedStyle(document.documentElement);
    colors = ['--art-a', '--art-b', '--art-c'].map((v, i) => s.getPropertyValue(v).trim() || colors[i]);
  };

  // Biosignal traces: a few channels, each a sum of slow, mid and fast rhythms with a
  // slowly breathing envelope, travelling right to left like a live recording.
  const eeg = {
    init(st) {
      const n = st.w < 520 ? 4 : 6;
      st.chan = Array.from({ length: n }, (_, i) => ({
        comps: [
          { k: rand(0.9, 1.6), w: rand(0.35, 0.7), a: 1, p: rand(0, TAU) },
          { k: rand(3, 5), w: rand(1.0, 1.8), a: rand(0.35, 0.6), p: rand(0, TAU) },
          { k: rand(9, 14), w: rand(2.5, 4), a: rand(0.1, 0.22), p: rand(0, TAU) },
        ],
        env: { k: rand(0.5, 1.2), w: rand(0.15, 0.35), p: rand(0, TAU) },
        alpha: 0.95 - (i / Math.max(1, n - 1)) * 0.5,
        color: i % 2 ? 1 : 0,
      }));
    },
    draw(st, t) {
      const { ctx, w, h, chan } = st;
      const gap = h / (chan.length + 1);
      const amp = Math.min(gap * 0.8, 22);
      ctx.lineWidth = 1.4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      chan.forEach((c, i) => {
        ctx.globalAlpha = c.alpha;
        ctx.strokeStyle = colors[c.color];
        ctx.beginPath();
        const y0 = gap * (i + 1);
        for (let x = 0; x <= w; x += 3) {
          const u = (x / w) * TAU;
          let v = 0;
          for (const m of c.comps) v += m.a * Math.sin(m.k * u + m.w * t + m.p);
          const burst = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(c.env.k * u + c.env.w * t + c.env.p));
          const edge = smooth(x / (w * 0.12)) * smooth((w - x) / (w * 0.12));
          const y = y0 + (v / 1.6) * amp * burst * edge;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    },
  };

  // Sparse network: drifting nodes, faint links between neighbours, and small pulses
  // of light travelling along a link now and then.
  const network = {
    init(st) {
      const n = Math.min(44, Math.max(10, Math.round((st.w * st.h) / 9000)));
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
      if (Math.random() < dt * 0.9 * (st.w / 1000)) {
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

  const arts = { eeg, network };
  const states = canvases.map((canvas) => ({
    canvas,
    ctx: canvas.getContext('2d'),
    art: arts[canvas.parentElement.dataset.art] || network,
    w: 0, h: 0, visible: false,
  }));

  const render = (st, t) => {
    st.ctx.clearRect(0, 0, st.w, st.h);
    st.art.draw(st, t);
  };

  const resize = (st) => {
    const rect = st.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    st.w = rect.width;
    st.h = rect.height;
    st.canvas.width = Math.round(st.w * dpr);
    st.canvas.height = Math.round(st.h * dpr);
    st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    st.art.init(st);
  };

  const now = () => performance.now() / 1000;
  readColors();
  states.forEach((st) => { resize(st); render(st, now()); });
  document.addEventListener('themechange', () => {
    readColors();
    states.forEach((st) => render(st, now()));
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
