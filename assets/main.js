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

  btn.hidden = false;
  sync();
  media.addEventListener('change', sync);

  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
    setTimeout(() => root.classList.remove('theme-anim'), 400);
  });
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
