'use strict';

/* ---- Year ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover:hover)').matches) {
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.addEventListener('mouseover', e => {
    if (e.target.matches('a,button,[role="button"],.project-card,.service-card'))
      cursorRing.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches('a,button,[role="button"],.project-card,.service-card'))
      cursorRing.classList.remove('hovered');
  });
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = cursorRing.style.opacity = '1';
  });
}

/* ============================================================
   PAGE TRANSITION
   ============================================================ */
const pageTransition = document.getElementById('pageTransition');

function triggerPageOut(href) {
  if (!pageTransition) { window.location.href = href; return; }
  pageTransition.classList.add('active');
  setTimeout(() => { window.location.href = href; }, 160);
}

document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto') ||
      href.startsWith('tel') || href.startsWith('#') ||
      link.getAttribute('target') === '_blank') return;
  e.preventDefault();
  triggerPageOut(href);
});

function resetTransition() {
  if (!pageTransition) return;
  pageTransition.style.transition = 'none';
  pageTransition.style.transform  = 'scaleY(0)';
  pageTransition.classList.remove('active');
  requestAnimationFrame(() => {
    pageTransition.style.transition = '';
    pageTransition.style.transform  = '';
  });
}

window.addEventListener('load',     resetTransition);
window.addEventListener('pageshow', resetTransition);
window.addEventListener('pagehide', resetTransition);

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileClose   = document.getElementById('mobileClose');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavLinks= document.getElementById('mobileNavLinks');

function openMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  setTimeout(() => { if (mobileClose) mobileClose.focus(); }, 100);
}
function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (hamburger) { hamburger.setAttribute('aria-expanded', 'false'); hamburger.focus(); }
}

if (hamburger)     hamburger.addEventListener('click', openMenu);
if (mobileClose)   mobileClose.addEventListener('click', closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
if (mobileNavLinks) mobileNavLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) closeMenu();
});

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible)');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}
initReveal();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function easeOutQuad(t, b, c, d) { t /= d; return -c * t * (t - 2) + b; }

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const total  = 1800 / 16;
  let current  = 0;
  const timer  = setInterval(() => {
    current++;
    el.textContent = Math.round(easeOutQuad(current, 0, target, total)) + suffix;
    if (current >= total) { el.textContent = target + suffix; clearInterval(timer); }
  }, 16);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
if (statNumbers.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => obs.observe(el));
}

/* ============================================================
   LANGUAGE TOGGLE — COMPLETE TRANSLATION ENGINE
   ============================================================ */
let currentLang = localStorage.getItem('portfolioLang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('portfolioLang', lang);

  const t    = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const html = document.documentElement;

  /* 1. Document direction + language */
  html.lang = lang;
  html.dir  = t.dir;

  /* 2. data-key → textContent (simple text elements) */
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  /* 3. data-html-key → innerHTML (elements that contain inner HTML like spans) */
  document.querySelectorAll('[data-html-key]').forEach(el => {
    const key = el.dataset.htmlKey;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  /* 4. Sync all language toggle buttons */
  document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  /* 5. WhatsApp links — update message text */
  const waMsg = lang === 'ar'
    ? encodeURIComponent('مرحبا، أنا مهتم بخدماتك في تطوير المواقع. هل يمكننا التحدث عن مشروعي؟')
    : encodeURIComponent("Hi, I'm interested in your web development services. Can we discuss my project?");
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    a.href = 'https://wa.me/905355798871?text=' + waMsg;
  });

  /* 6. Re-render JS-injected sections */
  const featuredGrid = document.getElementById('featuredProjectsGrid');
  if (featuredGrid) renderFeaturedProjects();

  const allGrid = document.getElementById('allProjectsGrid');
  if (allGrid) {
    const activeFilter = document.querySelector('.filter-btn.active');
    renderAllProjects(activeFilter ? activeFilter.dataset.filter : 'all');
  }

  /* 7. Notify project.html case study to re-render */
  document.dispatchEvent(new CustomEvent('langChanged'));
}

/* ---- Wire up all lang buttons ---- */
document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

/* ============================================================
   RENDER: FEATURED PROJECTS (homepage)
   ============================================================ */
function renderFeaturedProjects() {
  const grid = document.getElementById('featuredProjectsGrid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  const t       = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const isAr    = currentLang === 'ar';
  const featured= PROJECTS.filter(p => p.featured);

  grid.innerHTML = '';
  featured.forEach((p, i) => {
    const desc     = isAr && p.shortDescAr ? p.shortDescAr : p.shortDesc;
    const category = isAr && p.categoryAr  ? p.categoryAr  : p.category;
    const tags     = isAr && p.tagsAr      ? p.tagsAr      : p.tags;
    const delay    = i + 1;

    grid.innerHTML += `
      <div class="project-card reveal stagger-${delay}">
        <div class="project-img-wrap">
          <img src="${p.thumbnail}" alt="${p.title}" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>${p.title[0]}</div>'" />
          <span class="project-category-tag">${category}</span>
          <div class="project-img-overlay">
            <a href="${p.liveUrl}" target="_blank" rel="noopener">${t.livePreview}</a>
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p  class="project-desc">${desc}</p>
          <div class="project-footer">
            <div class="project-tags">
              ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <a href="project.html?id=${p.id}" class="btn-outline" style="font-size:0.78rem;padding:8px 16px;">
              ${t.viewCaseStudy}
            </a>
          </div>
        </div>
      </div>`;
  });
  initReveal();
}

/* ============================================================
   RENDER: ALL PROJECTS (projects.html)
   ============================================================ */
function renderAllProjects(filter) {
  const grid = document.getElementById('allProjectsGrid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  const t     = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const isAr  = currentLang === 'ar';
  const list  = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  grid.innerHTML = '';
  list.forEach((p, i) => {
    const desc     = isAr && p.shortDescAr ? p.shortDescAr : p.shortDesc;
    const category = isAr && p.categoryAr  ? p.categoryAr  : p.category;
    const tags     = isAr && p.tagsAr      ? p.tagsAr      : p.tags;
    const delay    = (i % 3) + 1;

    grid.innerHTML += `
      <div class="project-card reveal stagger-${delay}">
        <div class="project-img-wrap">
          <img src="${p.thumbnail}" alt="${p.title}" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>${p.title[0]}</div>'" />
          <span class="project-category-tag">${category}</span>
          <div class="project-img-overlay">
            <a href="${p.liveUrl}" target="_blank" rel="noopener">${t.livePreview}</a>
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p  class="project-desc">${desc}</p>
          <div class="project-footer">
            <div class="project-tags">
              ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <a href="project.html?id=${p.id}" class="btn-outline" style="font-size:0.78rem;padding:8px 16px;">
              ${t.viewCaseStudy}
            </a>
          </div>
        </div>
      </div>`;
  });
  initReveal();
}

/* ============================================================
   FILTER BAR (projects.html)
   ============================================================ */
const filterBar = document.getElementById('filterBar');
if (filterBar) {
  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAllProjects(btn.dataset.filter);
  });
}

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const navH = 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   INIT — apply saved language on page load
   ============================================================ */
applyLang(currentLang);

/* Render all-projects grid on projects.html */
if (document.getElementById('allProjectsGrid')) {
  renderAllProjects('all');
}
