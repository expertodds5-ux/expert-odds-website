/* ============================================================
   EXPERT ODDS — Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 500);
  });
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scroll-progress');
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });

  /* ---------- Header scrolled state + at-hero tracking ---------- */
  const header = document.getElementById('site-header');
  const heroEl = document.querySelector('.hero');
  function updateHeaderState() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 40);
    if (heroEl) {
      document.body.classList.toggle('at-hero', scrollY < heroEl.offsetHeight - 120);
    }
  }
  document.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Theme toggle (Dark/Light) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.className = 'fa-solid fa-moon';
    }
  }
  let currentTheme = 'light';
  applyTheme(currentTheme);
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---------- Instant quote calculator ---------- */
  const qService = document.getElementById('q-service');
  const qLevel = document.getElementById('q-level');
  const qPages = document.getElementById('q-pages');
  const qDeadline = document.getElementById('q-deadline');
  const quotePrice = document.getElementById('quote-price');
  const quoteForm = document.getElementById('quote-form');

  const levelMultiplier = { 'Standard': 1, 'Advanced': 1.35, 'Executive / Specialist': 1.8 };
  const baseRate = {
    'Business & Professional Writing': 16,
    'Content Writing': 12,
    'Editing & Proofreading': 8,
    'Research & Data Consulting': 18,
    'Other': 14
  };

  function calcQuote() {
    const pages = Math.max(parseInt(qPages.value, 10) || 1, 1);
    const deadlineMult = parseFloat(qDeadline.value) || 4;
    const levelMult = levelMultiplier[qLevel.value] || 1;
    const rate = baseRate[qService.value] || 14;
    const price = pages * rate * levelMult * (deadlineMult / 4);
    quotePrice.textContent = `$${Math.max(Math.round(price), 20)}`;
  }
  [qService, qLevel, qPages, qDeadline].forEach(el => el && el.addEventListener('input', calcQuote));
  calcQuote();

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = quoteForm.querySelector('.quote-submit');
    const original = btn.textContent;
    btn.textContent = 'Request Sent ✓';
    btn.style.opacity = '0.8';
    setTimeout(() => { btn.textContent = original; btn.style.opacity = '1'; }, 2400);
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    setTimeout(() => { btn.textContent = original; }, 2400);
    contactForm.reset();
  });

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Subscribed ✓';
    setTimeout(() => { btn.textContent = original; }, 2400);
    newsletterForm.reset();
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testi-track');
  const cards = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('testi-dots');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  let testiIndex = 0;

  function cardsPerView() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }
  function maxIndex() { return Math.max(cards.length - cardsPerView(), 0); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial group ${i + 1}`);
      if (i === testiIndex) dot.classList.add('active');
      dot.addEventListener('click', () => { testiIndex = i; renderTesti(); });
      dotsWrap.appendChild(dot);
    }
  }

  function renderTesti() {
    if (!cards.length) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    testiIndex = Math.min(testiIndex, maxIndex());
    const offset = testiIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === testiIndex));
  }

  if (track) {
    buildDots();
    renderTesti();
    prevBtn.addEventListener('click', () => { testiIndex = Math.max(testiIndex - 1, 0); renderTesti(); });
    nextBtn.addEventListener('click', () => { testiIndex = Math.min(testiIndex + 1, maxIndex()); renderTesti(); });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { buildDots(); renderTesti(); }, 200);
    });

    let autoTimer = setInterval(advanceTesti, 5000);
    function advanceTesti() {
      testiIndex = testiIndex >= maxIndex() ? 0 : testiIndex + 1;
      renderTesti();
    }
    [prevBtn, nextBtn].forEach(btn => btn.addEventListener('click', () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(advanceTesti, 5000);
    }));
  }

  /* ---------- Smooth-scroll offset correction for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
