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

// Confetti bands. Small flat pieces drifting down with a gentle sway and flutter.
// One shared animation loop; it runs only while a band is on screen, and stays
// as a single still frame when the visitor prefers reduced motion.
(() => {
  const bands = [...document.querySelectorAll('.band canvas')];
  if (!bands.length) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);

  let colors = [];
  const readColors = () => {
    const s = getComputedStyle(document.documentElement);
    colors = ['--confetti-a', '--confetti-b', '--confetti-c'].map((v) => s.getPropertyValue(v).trim());
  };

  const make = (w, h, anywhere) => ({
    x: rand(0, w),
    y: anywhere ? rand(0, h) : rand(-20, -4),
    size: rand(6, 13),
    round: Math.random() < 0.28,
    color: Math.floor(rand(0, 3)),
    vy: rand(14, 34),           // px per second, falling
    sway: rand(10, 34),         // horizontal amplitude in px
    swaySpeed: rand(0.25, 0.7), // radians per second
    phase: rand(0, TAU),
    rot: rand(0, TAU),
    spin: rand(-1.2, 1.2),      // radians per second
    flutter: rand(0.8, 2.2),    // speed of the flip
  });

  const states = bands.map((canvas) => ({
    canvas, ctx: canvas.getContext('2d'), w: 0, h: 0, dpr: 1, parts: [], visible: false,
  }));

  const resize = (st) => {
    const rect = st.canvas.getBoundingClientRect();
    st.dpr = Math.min(window.devicePixelRatio || 1, 2);
    st.w = rect.width;
    st.h = rect.height;
    st.canvas.width = Math.round(st.w * st.dpr);
    st.canvas.height = Math.round(st.h * st.dpr);
    st.ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
    const count = Math.max(16, Math.round((st.w * st.h) / 3600));
    st.parts = Array.from({ length: count }, () => make(st.w, st.h, true));
  };

  const draw = (st, t) => {
    const { ctx, w, h } = st;
    ctx.clearRect(0, 0, w, h);
    for (const p of st.parts) {
      const x = p.x + Math.sin(t * p.swaySpeed + p.phase) * p.sway;
      const flip = Math.cos(t * p.flutter + p.phase); // squashes the piece like it is turning in the air
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.25 + 0.75 * Math.abs(flip));
      ctx.fillStyle = colors[p.color];
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.42, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size * 0.28, p.size, p.size * 0.56);
      }
      ctx.restore();
    }
  };

  const step = (st, dt) => {
    for (const p of st.parts) {
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      if (p.y - p.size > st.h) Object.assign(p, make(st.w, st.h, false));
    }
  };

  const redrawAll = () => states.forEach((st) => st.w && draw(st, performance.now() / 1000));

  readColors();
  states.forEach(resize);
  redrawAll();
  document.addEventListener('themechange', () => { readColors(); redrawAll(); });

  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const st = states.find((s) => s.canvas === e.target);
      if (st) { resize(st); draw(st, performance.now() / 1000); }
    }
  });
  bands.forEach((c) => ro.observe(c));

  if (still || !('IntersectionObserver' in window)) return;

  let raf = 0;
  let last = 0;
  const loop = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    let any = false;
    for (const st of states) {
      if (!st.visible) continue;
      any = true;
      step(st, dt);
      draw(st, now / 1000);
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
