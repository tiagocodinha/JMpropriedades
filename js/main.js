/* ============================================================
   JM Villas Nazaré — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ── Language Switcher ──────────────────────────────────── */
  const LANG_KEY = 'jm_lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.body.classList.toggle('is-pt', lang === 'pt');
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
  }

  document.addEventListener('DOMContentLoaded', () => {
    setLang(currentLang);
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
    });
  });

  /* ── Sticky Header ──────────────────────────────────────── */
  const header = document.getElementById('header');

  // On inner pages the header starts as 'scrolled' — never switch to hero-mode
  const IS_INNER_PAGE = header && !header.classList.contains('hero-mode');

  function onScroll() {
    if (!header) return;
    if (!IS_INNER_PAGE) {
      const scrolled = window.scrollY > 60;
      header.classList.toggle('scrolled', scrolled);
      header.classList.toggle('hero-mode', !scrolled);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('DOMContentLoaded', onScroll);

  /* ── Mobile Menu ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  });

  /* ── Scroll Reveal ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });

  /* ── Hero BG pan ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
  });

  /* ── FAQ Accordion ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  });

  /* ── Active nav link ────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  });

  /* ── Contact form submit (demo) ─────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const enMsg = 'Message sent! We\'ll be in touch within 24 hours.';
      const ptMsg = 'Mensagem enviada! Respondemos em 24 horas.';
      btn.textContent = currentLang === 'pt' ? ptMsg : enMsg;
      btn.disabled = true;
      btn.style.background = '#2d7a4a';
    });
  });

  /* ── Hero Booking Bar (Flatpickr) ───────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('heroCheckin')) return;

    const dispIn  = document.getElementById('dispCheckin');
    const dispOut = document.getElementById('dispCheckout');
    const guestsNum   = document.getElementById('guestsNum');
    const guestsMinus = document.getElementById('guestsMinus');
    const guestsPlus  = document.getElementById('guestsPlus');
    const bookBtn     = document.getElementById('heroBookBtn');
    const lang = document.body.classList.contains('is-pt') ? 'pt' : 'en';

    const fmt = d => d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'short' });

    let selectedStart = null, selectedEnd = null;

    const months = window.innerWidth >= 768 ? 2 : 1;

    const fpOut = flatpickr('#heroCheckout', {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      locale: lang === 'pt' ? 'pt' : 'default',
      showMonths: months,
      disableMobile: true,
      onChange([date]) {
        selectedEnd = date;
        dispOut.innerHTML = `<strong>${fmt(date)}</strong>`;
        document.getElementById('fieldCheckout').classList.add('has-value');
      }
    });

    flatpickr('#heroCheckin', {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      locale: lang === 'pt' ? 'pt' : 'default',
      showMonths: months,
      disableMobile: true,
      onChange([date]) {
        selectedStart = date;
        dispIn.innerHTML = `<strong>${fmt(date)}</strong>`;
        document.getElementById('fieldCheckin').classList.add('has-value');
        // auto-open checkout, set min date
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        fpOut.set('minDate', next);
        if (!selectedEnd || selectedEnd <= date) {
          selectedEnd = null;
          dispOut.innerHTML = '<span class="en">Select date</span><span class="pt">Escolher data</span>';
          document.getElementById('fieldCheckout').classList.remove('has-value');
        }
        setTimeout(() => fpOut.open(), 50);
      }
    });

    // Click on display areas also opens pickers
    document.getElementById('fieldCheckin').addEventListener('click', () =>
      document.getElementById('heroCheckin')._flatpickr.open());
    document.getElementById('fieldCheckout').addEventListener('click', () =>
      document.getElementById('heroCheckout')._flatpickr.open());

    // Guest counter
    let guests = 2;
    guestsMinus.addEventListener('click', () => {
      if (guests > 1) { guests--; guestsNum.textContent = guests; }
    });
    guestsPlus.addEventListener('click', () => {
      if (guests < 10) { guests++; guestsNum.textContent = guests; }
    });

    // Book — replace URL with Lodgify/Hostaway/Smoobu booking page
    const BOOKING_URL = 'https://booking.lodgify.com/casadaencosta'; // ← substituir
    bookBtn.addEventListener('click', () => {
      if (!selectedStart || !selectedEnd) {
        document.getElementById('heroCheckin')._flatpickr.open();
        return;
      }
      const toStr = d => d.toISOString().split('T')[0];
      const params = new URLSearchParams({
        startDate: toStr(selectedStart),
        endDate:   toStr(selectedEnd),
        guests
      });
      window.open(`${BOOKING_URL}?${params}`, '_blank');
    });
  });

  /* ── Smooth anchor scroll ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    /* ── Auto copyright year ──────────────────────────────── */
    document.querySelectorAll('.copy-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  });

})();
