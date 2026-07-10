// Auto-update copyright year
(function () {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// Theme toggle (light / dark), persisted in localStorage
(function () {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = toggleBtn ? toggleBtn.querySelector('.toggle-icon') : null;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (icon) icon.textContent = '◑';
    } else {
      root.removeAttribute('data-theme');
      if (icon) icon.textContent = '◐';
    }
  }

  let saved = null;
  try {
    saved = localStorage.getItem('site-theme');
  } catch (e) {
    // localStorage unavailable — fall back to system preference
  }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('site-theme', next);
      } catch (e) {
        /* ignore */
      }
    });
  }
})();

// Precise anchor scrolling: offset by the real, current height of the sticky nav
(function () {
  const nav = document.querySelector('header.nav');
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        return; // logo link — native scroll to top
      }
      const section = document.querySelector(href);
      if (!section) return;

      e.preventDefault();
      const navHeight = nav ? Math.floor(nav.getBoundingClientRect().height) : 0;
      const rawTop = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.round(rawTop - navHeight),
        behavior: 'smooth'
      });
    });
  });
})();

// Mobile menu toggle
(function () {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Scroll-spy: highlight the nav link for the section currently in view
(function () {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  if (!sections.length || !navLinks.length) return;

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-nav') === id);
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
