/* ==========================================================================
   Masjid Al-Mumin — main.js
   Handles: prayer times (AlAdhan API), slideshow, nav, dynamic content
   ========================================================================== */

// ---- Mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ---- Active nav link based on current page ----
(() => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ==========================================================================
// Prayer Times — AlAdhan API (free, no key required)
// https://aladhan.com/prayer-times-api
// Method 2 = ISNA (North America standard)
// ==========================================================================

const MASJID_LAT = 34.0522;
const MASJID_LNG = -118.2437;
const PRAYER_METHOD = 2; // ISNA

async function loadPrayerTimes() {
  const container = document.getElementById('prayer-times-grid');
  const dateEl = document.getElementById('prayer-date');
  if (!container) return;

  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${MASJID_LAT}&longitude=${MASJID_LNG}&method=${PRAYER_METHOD}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.code !== 200) throw new Error('API error');

    const t = data.data.timings;
    const hijri = data.data.date.hijri;
    const greg = data.data.date.gregorian;

    if (dateEl) {
      dateEl.innerHTML = `${greg.weekday.en}, ${greg.date} &mdash; ${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
    }

    const prayers = [
      { name: 'Fajr', time: t.Fajr },
      { name: 'Sunrise', time: t.Sunrise },
      { name: 'Dhuhr', time: t.Dhuhr },
      { name: 'Asr', time: t.Asr },
      { name: 'Maghrib', time: t.Maghrib },
      { name: 'Isha', time: t.Isha }
    ];

    // Determine active prayer
    const now = today.getHours() * 60 + today.getMinutes();
    const toMinutes = (hm) => {
      const [h, m] = hm.split(':').map(Number);
      return h * 60 + m;
    };
    let activeIdx = -1;
    for (let i = 0; i < prayers.length; i++) {
      const nextTime = i < prayers.length - 1 ? toMinutes(prayers[i + 1].time) : 24 * 60;
      if (now >= toMinutes(prayers[i].time) && now < nextTime) {
        activeIdx = i;
        break;
      }
    }

    container.innerHTML = prayers.map((p, i) => `
      <div class="prayer-cell ${i === activeIdx ? 'active' : ''}">
        <div class="prayer-name">${p.name}</div>
        <div class="prayer-time">${formatTime(p.time)}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Prayer times error:', err);
    if (container) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:2rem; color:var(--gold-soft);">Prayer times temporarily unavailable. Please check back.</div>`;
    }
  }
}

function formatTime(hm) {
  const [h, m] = hm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, '0')} <small>${suffix}</small>`;
}

// ==========================================================================
// Slideshow — auto-advancing with dots + arrows + pause on hover
// ==========================================================================
function initSlideshow(selector) {
  const slideshow = document.querySelector(selector);
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.slide');
  const dots = slideshow.querySelectorAll('.slide-dot');
  const prev = slideshow.querySelector('.slide-arrow.prev');
  const next = slideshow.querySelector('.slide-arrow.next');
  let current = 0;
  let timer;

  const show = (idx) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
    current = idx;
  };

  const start = () => {
    timer = setInterval(() => show((current + 1) % slides.length), 5000);
  };
  const stop = () => clearInterval(timer);

  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); stop(); start(); }));
  if (prev) prev.addEventListener('click', () => { show((current - 1 + slides.length) % slides.length); stop(); start(); });
  if (next) next.addEventListener('click', () => { show((current + 1) % slides.length); stop(); start(); });

  slideshow.addEventListener('mouseenter', stop);
  slideshow.addEventListener('mouseleave', start);

  start();
}

// ==========================================================================
// Dynamic content loaders — programs and events from JSON
// ==========================================================================

async function loadPrograms(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const res = await fetch('data/programs.json');
    const data = await res.json();
    const programs = limit ? data.programs.slice(0, limit) : data.programs;
    container.innerHTML = programs.map(p => `
      <article class="program-card reveal">
        <div class="program-day">${p.day} &middot; ${p.time}</div>
        <h3>${p.title}</h3>
        <div class="arabic" style="font-size:1.5rem;color:var(--gold-deep);margin-bottom:1rem;">${p.arabic}</div>
        <div class="program-teacher">Taught by <strong>${p.teacher}</strong><br><em style="font-size:0.88rem;">${p.teacherBio}</em></div>
        <p class="program-desc">${p.description}</p>
        <div class="program-meta">
          <span>📖 ${p.category}</span>
          <span>◆ ${p.level}</span>
        </div>
      </article>
    `).join('');
    initReveal();
  } catch (err) {
    console.error('Programs load error:', err);
  }
}

async function loadEvents(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const res = await fetch('data/events.json');
    const data = await res.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort by date ascending, filter upcoming
    let events = data.events
      .map(e => ({ ...e, dateObj: new Date(e.date) }))
      .filter(e => e.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (limit) events = events.slice(0, limit);

    if (events.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:var(--ink-muted);padding:3rem 0;">No upcoming events. Check back soon, insha'Allah.</p>`;
      return;
    }

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    container.innerHTML = events.map(e => `
      <article class="event-card reveal">
        <div class="event-date">
          <span class="day">${e.dateObj.getDate()}</span>
          <span class="month">${months[e.dateObj.getMonth()]} ${e.dateObj.getFullYear()}</span>
        </div>
        <div class="event-details">
          <h3>${e.title}</h3>
          <p>${e.description}</p>
          <div class="event-meta">📍 ${e.location} &middot; 🕌 ${e.time}</div>
        </div>
        <a href="${e.link || '#'}" class="btn btn-outline" style="white-space:nowrap;">Details</a>
      </article>
    `).join('');
    initReveal();
  } catch (err) {
    console.error('Events load error:', err);
  }
}

// ==========================================================================
// Scroll reveal
// ==========================================================================
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ==========================================================================
// Donate amount selector
// ==========================================================================
(() => {
  const amounts = document.querySelectorAll('.donate-amount');
  const customInput = document.getElementById('donate-custom');
  amounts.forEach(btn => {
    btn.addEventListener('click', () => {
      amounts.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (customInput) customInput.value = btn.dataset.amount;
    });
  });
})();

// ==========================================================================
// Init
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadPrayerTimes();
  initSlideshow('.slideshow');
  loadPrograms('programs-preview', 4);
  loadPrograms('programs-full');
  loadEvents('events-preview', 3);
  loadEvents('events-full');
  initReveal();
});
