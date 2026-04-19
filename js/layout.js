/* Shared header and footer — injected into every page for easy updates */

document.addEventListener('DOMContentLoaded', () => {
  const headerMount = document.getElementById('site-header-mount');
  const footerMount = document.getElementById('site-footer-mount');

  if (headerMount) {
    headerMount.innerHTML = `
      <div class="announcement">
        🕌 Jumu'ah every Friday &middot; Weekend school registration open for 1447-1448 &mdash; <a href="weekend-school.html">Sign up</a>
      </div>
      <header class="site-header">
        <nav class="nav">
          <a href="index.html" class="nav-brand">
            <img src="images/logo.jpg" alt="Masjid Al-Mumin logo">
            <span>Masjid Al-Mumin</span>
          </a>
          <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="programs.html">Programs</a></li>
            <li><a href="weekend-school.html">Weekend School</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="sheikh-fareed.html">Sheikh Fareed</a></li>
          </ul>
          <a href="donate.html" class="nav-cta">Donate</a>
          <button class="nav-toggle" aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </nav>
      </header>
    `;

    // Active link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === path) link.classList.add('active');
    });

    // Mobile toggle
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
  }

  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="footer-brand-ar">مسجد المؤمن</div>
              <div class="footer-brand">Masjid Al-Mumin</div>
              <p class="footer-desc">
                A community masjid in Los Angeles founded upon the Qur'an and Sunnah with the understanding of the righteous predecessors. Raising the leaders of tomorrow through authentic knowledge and worship.
              </p>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="programs.html">Programs & Classes</a></li>
                <li><a href="weekend-school.html">Weekend School</a></li>
                <li><a href="events.html">Events</a></li>
                <li><a href="sheikh-fareed.html">Sheikh Fareed</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="donate.html">Donate</a></li>
                <li><a href="donate.html#sadaqah">Sadaqah Jariyah</a></li>
                <li><a href="donate.html#zakah">Zakah</a></li>
                <li><a href="weekend-school.html">Register a Child</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Visit Us</h4>
              <ul>
                <li>Los Angeles, CA</li>
                <li><a href="mailto:info@masjidalmumin.org">info@masjidalmumin.org</a></li>
                <li>Open daily for prayer</li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <div>&copy; 2026 Masjid Al-Mumin &middot; All rights reserved</div>
            <div>"The mosques of Allah are only to be maintained by those who believe in Allah." <em>&mdash; At-Tawbah 9:18</em></div>
          </div>
        </div>
      </footer>
    `;
  }
});
