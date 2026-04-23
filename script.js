'use strict';

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Menu tabs
const tabBtns  = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

function showCategory(category) {
  menuCards.forEach(card => {
    const match = card.dataset.category === category;
    card.classList.toggle('visible', match);
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showCategory(btn.dataset.category);
  });
});

// Show starters by default on page load
showCategory('starters');

// Reservation form
const form        = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');

// Set min date for date input to today
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  form.style.display    = 'none';
  formSuccess.style.display = 'flex';
  setTimeout(() => {
    formSuccess.style.display = 'none';
    form.style.display        = 'flex';
    form.reset();
  }, 5000);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for fade-in sections
const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.about, .menu, .gallery, .contact').forEach(section => {
  section.style.opacity   = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(section);
});
