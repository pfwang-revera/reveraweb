// ===== HEADER & NAV =====
const header = document.getElementById('siteHeader');
const elevateAt = 6;
const onScrollHeader = () => header?.classList.toggle('elevated', window.scrollY > elevateAt);
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();
document.getElementById('year')?.append?.(new Date().getFullYear());

// ===== LANGUAGE MENU =====
const setupLanguageMenu = () => {
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const langLabel = document.getElementById('langLabel');
  
  if (!langBtn || !langMenu || !langLabel) return;

  const setLangMenu = open => {
    langBtn.setAttribute('aria-expanded', String(open));
    langMenu.setAttribute('aria-hidden', String(!open));
  };

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setLangMenu(langBtn.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang')) setLangMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setLangMenu(false);
  });

  langMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    const map = { en: 'GLOBAL | ENGLISH', zh: 'GLOBAL | 中文', fr: 'GLOBAL | FRANÇAIS' };
    langLabel.textContent = map[btn.dataset.lang];
    setLangMenu(false);
    langBtn.focus();
  });
};

setupLanguageMenu();

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const setMobileMenu = open => {
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
  }
};
mobileMenuBtn?.addEventListener('click', () => setMobileMenu(mobileMenuBtn?.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('click', e => {
  if (!e.target.closest('.mobile-menu') && !e.target.closest('#mobileMenuBtn')) setMobileMenu(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMobileMenu(false); });

// ===== REVEAL ANIMATIONS =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = document.querySelectorAll('.reveal');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-in'));
}

// ===== PARALLAX =====
let ticking = false;
const updateParallax = () => {
  ticking = false;
  const y = window.scrollY || 0;
  document.documentElement.style.setProperty('--par1', (y * -0.03).toFixed(1) + 'px');
  document.documentElement.style.setProperty('--par2', (y * 0.02).toFixed(1) + 'px');
};
const onScrollParallax = () => {
  if (!reduceMotion.matches && !ticking) {
    ticking = true;
    requestAnimationFrame(updateParallax);
  }
};
if (!reduceMotion.matches) {
  window.addEventListener('scroll', onScrollParallax, { passive: true });
  updateParallax();
}

// ===== SCROLLER CONTROLS =====
const initScrollerControls = () => {
  const wireScroller = (scroller) => {
    if (!scroller || scroller.classList.contains('wired') || scroller.classList.contains('no-controls')) return;
    scroller.classList.add('wired');

    let wrap = scroller.parentElement;
    if (!wrap?.classList?.contains('scroller-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'scroller-wrap';
      scroller.parentElement.insertBefore(wrap, scroller);
      wrap.appendChild(scroller);
    }

    let controls = wrap.querySelector('.scroller-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'scroller-controls';
      wrap.appendChild(controls);
    }

    controls.innerHTML = '';

    const btnPrev = document.createElement('button');
    btnPrev.className = 'scroller-ctrl';
    btnPrev.type = 'button';
    btnPrev.textContent = '‹';
    btnPrev.setAttribute('aria-label', 'Scroll left');

    const btnNext = document.createElement('button');
    btnNext.className = 'scroller-ctrl';
    btnNext.type = 'button';
    btnNext.textContent = '›';
    btnNext.setAttribute('aria-label', 'Scroll right');

    controls.appendChild(btnPrev);
    controls.appendChild(btnNext);

    const updateActive = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      btnPrev.disabled = scroller.scrollLeft <= 5;
      btnNext.disabled = scroller.scrollLeft >= max - 5;
      btnPrev.setAttribute('aria-disabled', String(btnPrev.disabled));
      btnNext.setAttribute('aria-disabled', String(btnNext.disabled));
    };

    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      scroller.scrollBy({ left: -Math.round(scroller.clientWidth * 0.85), behavior: 'smooth' });
    });

    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      scroller.scrollBy({ left: Math.round(scroller.clientWidth * 0.85), behavior: 'smooth' });
    });

    let t = null;
    scroller.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(updateActive, 50);
    }, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
  };

  const runInit = () => {
    document.querySelectorAll('.scroller:not(.no-controls), .feature-scroller:not(.no-controls), .coverage-steps:not(.no-controls)').forEach(wireScroller);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }
  setTimeout(runInit, 200);
};

// ===== TIMELINE STEPPER =====
const initTimelineStepper = () => {
  const container = document.querySelector('.timeline-stepper');
  const line = document.querySelector('.timeline-line');
  const steps = container?.querySelectorAll('.timeline-step') || [];
  if (!container || !line || !steps.length) return;

  const updateLine = () => {
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;
    let lastVisibleIndex = -1;

    steps.forEach((step, i) => {
      const stepRect = step.getBoundingClientRect();
      const isVisible = stepRect.top < vh * 0.8 && stepRect.bottom > 0;
      if (isVisible) lastVisibleIndex = i;
    });

    const progress = Math.max(0, Math.min(1, (lastVisibleIndex + 1) / steps.length));
    const containerHeight = container.offsetHeight;
    line.style.height = Math.round(progress * containerHeight) + 'px';
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
      }
    });
  }, { threshold: 0.2 });

  steps.forEach(s => io.observe(s));
  window.addEventListener('scroll', updateLine, { passive: true });
  window.addEventListener('resize', updateLine);
  setTimeout(updateLine, 100);
};

// ===== INIT =====
const initAll = () => {
  initScrollerControls();
  initTimelineStepper();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
