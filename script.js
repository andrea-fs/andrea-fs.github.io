/* ============================================
   ANDREA FOSSÀ — PORTFOLIO JS
   ============================================ */

// --- Header scroll ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// --- Mobile menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
        closeMenu();
    } else {
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// --- Reveal on scroll ---
const revealElements = document.querySelectorAll('section:not(.hero)');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// --- Active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

// --- Staggered reveal for cards ---
const staggerItems = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .contact-card');
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, i * 80);
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });

staggerItems.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    staggerObserver.observe(el);
});
