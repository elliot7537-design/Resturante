'use strict';

// ── Navbar & hero parallax ────────────────────────────
const navbar       = document.getElementById('navbar');
const heroEl       = document.querySelector('.hero');
const heroContent  = document.querySelector('.hero-content');
const heroMandalas = document.querySelectorAll('.hero .mandala');

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);

  if (heroEl && y < heroEl.offsetHeight) {
    heroMandalas.forEach((m, i) => {
      m.style.transform = `translateY(${y * (i % 2 === 0 ? 0.15 : -0.1)}px)`;
    });
    if (heroContent) {
      heroContent.style.transform = `translateY(${y * 0.12}px)`;
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile nav ────────────────────────────────────────
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ── Menu tabs with staggered entrance ────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

function showCategory(category) {
  let idx = 0;
  menuCards.forEach(card => {
    card.classList.remove('visible');
    if (card.dataset.category === category) {
      card.style.animationDelay = `${idx * 0.08}s`;
      void card.offsetWidth; // force reflow to restart CSS animation
      card.classList.add('visible');
      idx++;
    }
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showCategory(btn.dataset.category);
  });
});

showCategory('starters');

// ── Reservation form ─────────────────────────────────
const form        = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');
const dateInput   = document.getElementById('date');

if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', e => {
  e.preventDefault();
  form.style.display        = 'none';
  formSuccess.style.display = 'flex';
  setTimeout(() => {
    formSuccess.style.display = 'none';
    form.style.display        = 'flex';
    form.reset();
  }, 5000);
});

// ── Smooth scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── Scroll reveal with stagger ────────────────────────
// Staggered groups — each selector gets per-element delay
const staggeredGroups = [
  ['.about-text > h2',  'from-right'],
  ['.about-text > p',   'from-right'],
  ['.stat',              null],
  ['.about-img',        'from-left'],
  ['.gallery-img',       null],
  ['.contact-card',     'from-right'],
];

staggeredGroups.forEach(([sel, dir]) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (dir) el.classList.add(dir);
    el.dataset.delay = (i * 0.13).toFixed(2);
  });
});

// Single elements — no stagger
['.section-tag', '.section-title', '.section-subtitle', '.contact-form-wrap']
  .forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.add('reveal')));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseFloat(el.dataset.delay || 0) * 1000;
    setTimeout(() => el.classList.add('in-view'), delay);
    revealObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Stats counter (ease-out-cubic) ───────────────────
function countUp(el) {
  const raw    = el.textContent.trim();
  const num    = parseInt(raw);
  const suffix = raw.replace(/[0-9]/g, '');
  if (isNaN(num)) return;
  let frame = 0;
  const TOTAL = 60;
  const tick = () => {
    frame++;
    const ease = 1 - Math.pow(1 - frame / TOTAL, 3);
    el.textContent = Math.round(num * ease) + suffix;
    if (frame < TOTAL) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('strong').forEach(countUp);
    statsObs.unobserve(entry.target);
  });
}, { threshold: 0.6 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObs.observe(statsEl);

// ── Active nav link highlight ────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => {
      a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObs.observe(s));
