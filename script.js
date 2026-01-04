// ===== HEADER & NAV =====
const header = document.getElementById('siteHeader');
const elevateAt = 6;
const onScrollHeader = () => header?.classList.toggle('elevated', window.scrollY > elevateAt);
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();
document.getElementById('year')?.append?.(new Date().getFullYear());

// ===== LANGUAGE MENU =====
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
const langLabel = document.getElementById('langLabel');
const setLangMenu = open => {
  langBtn?.setAttribute('aria-expanded', String(open));
  langMenu?.setAttribute('aria-hidden', String(!open));
};
langBtn?.addEventListener('click', () => setLangMenu(langBtn?.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('click', e => { if (!e.target.closest('.lang')) setLangMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setLangMenu(false); });
langMenu?.addEventListener('click', e => {
  const btn = e.target.closest('button[data-lang]');
  if (!btn) return;
  const map = { en: 'GLOBAL | ENGLISH', zh: 'GLOBAL | 中文', fr: 'GLOBAL | FRANÇAIS' };
  if (langLabel && map[btn.dataset.lang]) langLabel.textContent = map[btn.dataset.lang];
  setLangMenu(false);
  langBtn?.focus();
});

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

// ===== HERO CAROUSEL =====
const heroTrack = document.getElementById('heroTrack');
const dotsWrap = document.getElementById('heroDots');
const btnPrev = document.getElementById('heroPrev');
const btnNext = document.getElementById('heroNext');
const btnPP = document.getElementById('heroPlayPause');
const ppIcon = document.getElementById('ppIcon');
const ppLabel = document.getElementById('ppLabel');

const imagePaths = [
  './Images/Landing/Eames chair.jpeg',
  './Images/Landing/Flowerpot-VP2_Cobalt-Blue-Twilight-Blue-Pattern_-Front_On-1200x1600.jpg',
  './Images/Landing/Flowerpot lamps.jpg',
  './Images/Landing/Cosmetics.jpg',
  './Images/Landing/peacoat.jpeg',
  './Images/Landing/Petra-VB3_Sheepskin-Moonlight-17mm-w.-Oak-1200x1600.jpg',
  './Images/Landing/DPP.PNG',
  './Images/Landing/EU Commission.webp',
  './Images/Landing/Flowerpot-VP10_Black-and-white-pattern_off-1200x1600.jpg',
  './Images/Landing/SBUX interior.jpeg'
];

if (heroTrack) {
  heroTrack.innerHTML = '';
  imagePaths.forEach((p, i) => {
    const art = document.createElement('article');
    art.className = 'slide';
    art.setAttribute('data-title', `Image ${i+1}`);
    art.innerHTML = `<div class="slide-inner"><img class="slide-img" src="${encodeURI(p)}" alt="Hero image ${i+1}"></div>`;
    heroTrack.appendChild(art);
  });

  let slides = Array.from(heroTrack.querySelectorAll('.slide'));
  let heroIndex = 0;
  let playing = !reduceMotion.matches;
  let timer = null;

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.type = 'button';
      b.setAttribute('aria-label', `Go to image ${i+1}`);
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(b);
    });
  };

  const setDots = idx => {
    Array.from(dotsWrap?.children || []).forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
  };

  const nearestIndex = () => {
    const x = heroTrack.scrollLeft;
    let best = 0, bestDist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - x);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  };

  const goTo = (idx, userInitiated = false) => {
    heroIndex = (idx + slides.length) % slides.length;
    const target = slides[heroIndex];
    heroTrack.scrollTo({ left: target.offsetLeft, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    setDots(heroIndex);
    if (userInitiated && playing) restartTimer();
  };

  const next = () => goTo(heroIndex + 1, true);
  const prev = () => goTo(heroIndex - 1, true);

  const stopTimer = () => { if (timer) clearInterval(timer); timer = null; };
  const restartTimer = () => {
    stopTimer();
    if (playing) timer = setInterval(() => goTo(heroIndex + 1, false), 6000);
  };

  const setPlayState = isPlaying => {
    playing = isPlaying && !reduceMotion.matches;
    btnPP?.setAttribute('aria-pressed', String(playing));
    if (playing) {
      if (ppLabel) ppLabel.textContent = 'Pause';
      if (ppIcon) ppIcon.innerHTML = '<path fill="currentColor" d="M7 6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1 1Zm6 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1Z"/>';
      restartTimer();
    } else {
      if (ppLabel) ppLabel.textContent = 'Play';
      if (ppIcon) ppIcon.innerHTML = '<path fill="currentColor" d="M8 5a1 1 0 0 1 1v12a1 1 0 0 1-2 0V6a1 1 0 0 1-1 1-1H8a1 1 0 0 1-1 1Zm10 6.5a1 1 0 0 1 0 1.7l-8 5A1 1 0 0 1 1.5-.9l8 5Z"/>';
      stopTimer();
    }
  };

  btnNext?.addEventListener('click', next);
  btnPrev?.addEventListener('click', prev);
  btnPP?.addEventListener('click', () => setPlayState(!playing));

  let scrollEndT = null;
  heroTrack.addEventListener('scroll', () => {
    if (scrollEndT) clearTimeout(scrollEndT);
    scrollEndT = setTimeout(() => {
      heroIndex = nearestIndex();
      setDots(heroIndex);
    }, 80);
  }, { passive: true });

  buildDots();
  setDots(0);
  goTo(0, false);
  setPlayState(playing);
}

// ===== SCROLLER CONTROLS =====
const initScrollerControls = () => {
  const wireScroller = (scroller) => {
    if (!scroller || scroller.classList.contains('wired')) return;
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

    const items = Array.from(scroller.children).filter(c => c.nodeType === 1 && (c.classList.contains('know-card') || c.classList.contains('card') || c.classList.contains('tile')));

    const getCenterIndex = () => {
      const scRect = scroller.getBoundingClientRect();
      const scCenter = scRect.left + scRect.width / 2;
      let best = 0, bestDist = Infinity;
      items.forEach((it, i) => {
        const itRect = it.getBoundingClientRect();
        const center = itRect.left + itRect.width / 2;
        const d = Math.abs(center - scCenter);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    };

    const updateActive = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      btnPrev.disabled = scroller.scrollLeft <= 5;
      btnNext.disabled = scroller.scrollLeft >= max - 5;
      btnPrev.setAttribute('aria-disabled', String(btnPrev.disabled));
      btnNext.setAttribute('aria-disabled', String(btnNext.disabled));
    };

    const scrollToIndex = (idx) => {
      const target = items[idx];
      if (!target) return;
      const scRect = scroller.getBoundingClientRect();
      const itRect = target.getBoundingClientRect();
      const targetLeft = scroller.scrollLeft + (itRect.left + itRect.width / 2) - (scRect.left + scRect.width / 2);
      scroller.scrollTo({ left: targetLeft, behavior: 'smooth' });
    };

    const scrollByAmount = (amt) => scroller.scrollBy({ left: amt, behavior: 'smooth' });

    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = getCenterIndex();
      if (idx > 0) scrollToIndex(idx - 1);
      scrollByAmount(-Math.round(scroller.clientWidth * 0.7));
    });

    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = getCenterIndex();
      if (idx < items.length - 1) scrollToIndex(idx + 1);
      scrollByAmount(Math.round(scroller.clientWidth * 0.7));
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

initScrollerControls();
initTimelineStepper();

// ===== TIMELINE =====
const initTimeline = (containerId, drawId) => {
  const container = document.getElementById(containerId);
  const draw = document.getElementById(drawId);
  if (!container || !draw) return false;

  const pathLen = draw.getTotalLength();
  draw.style.strokeDasharray = `${pathLen} ${pathLen}`;
  draw.style.strokeDashoffset = pathLen;
  draw.classList.add('timeline-draw');
  draw.getBoundingClientRect();

  const update = () => {
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
    draw.style.strokeDashoffset = Math.round(pathLen * (1 - progress));
  };

  const steps = container.querySelectorAll('.timeline-step');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
      else e.target.classList.remove('is-visible');
    });
  }, { threshold: 0.35 });
  steps.forEach(s => { s.classList.add('is-hidden'); io.observe(s); });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
  return true;
};

// ===== TIMELINE STEPPER =====
const initTimelineStepper = () => {
  const container = document.querySelector('.timeline-stepper');
  const draw = document.querySelector('.timeline-stepper .timeline-path');
  if (!container || !draw) return;

  const pathLen = draw.getTotalLength();
  draw.style.strokeDasharray = `${pathLen} ${pathLen}`;
  draw.style.strokeDashoffset = pathLen;

  const updateLine = () => {
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;
    const steps = container.querySelectorAll('.timeline-step');
    let lastVisibleStep = -1;

    steps.forEach((step, i) => {
      const stepRect = step.getBoundingClientRect();
      const isVisible = stepRect.top < vh * 0.85 && stepRect.bottom > 0;
      if (isVisible) lastVisibleStep = i;
    });

    const totalSteps = steps.length;
    const progress = Math.max(0, Math.min(1, (lastVisibleStep + 1) / totalSteps));
    draw.style.strokeDashoffset = Math.round(pathLen * (1 - progress));

    const containerHeight = container.offsetHeight;
    const pathHeight = containerHeight - 100;
    draw.setAttribute('d', `M0 0 V${Math.max(0, progress * pathHeight)}`);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
      }
    });
  }, { threshold: 0.2 });

  const steps = container.querySelectorAll('.timeline-step');
  steps.forEach(s => io.observe(s));

  window.addEventListener('scroll', updateLine, { passive: true });
  window.addEventListener('resize', updateLine);

  setTimeout(updateLine, 100);
  setTimeout(() => updateLine(), 500);
};

  const pathLen = draw.getTotalLength();
  draw.style.strokeDasharray = `${pathLen} ${pathLen}`;
  draw.style.strokeDashoffset = pathLen;
  draw.classList.add('timeline-draw');
  draw.getBoundingClientRect();

  const update = () => {
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
    draw.style.strokeDashoffset = Math.round(pathLen * (1 - progress));
  };

  const steps = container.querySelectorAll('.timeline-step');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
      else e.target.classList.remove('is-visible');
    });
  }, { threshold: 0.35 });
  steps.forEach(s => { s.classList.add('is-hidden'); io.observe(s); });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
  return true;
};

// ===== SCROLLER PROGRESS CURVE =====
const initScrollerProgress = () => {
  const wireProgress = (scroller) => {
    if (!scroller || scroller.classList.contains('progress-wired')) return;

    scroller.classList.add('progress-wired');
    let wrap = scroller.parentElement;
    if (!wrap?.classList?.contains('scroller-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'scroller-wrap';
      scroller.parentElement.insertBefore(wrap, scroller);
      wrap.appendChild(scroller);
    }

    // Progress line SVG
    let curve = wrap.querySelector('.scroller-curve');
    const cards = Array.from(scroller.querySelectorAll('.service-card'));
    if (!curve || !cards.length) return;

    const drawPath = (percent) => {
      // Draw from left (0%) to right (100%) as a sine wave that connects cards
      const width = wrap.offsetWidth;
      const height = 8;
      const midY = height / 2;
      const amplitude = height * 0.3;
      const freq = 4; // Wave frequency

      let d = `M0,${midY} `;

      // Calculate curve points
      const segments = cards.map((card, i) => {
        const x = (i + 1) * (width / (cards.length + 1));
        const y = midY + Math.sin((x / width) * freq * Math.PI * 2) * i) * amplitude);
        d += ` L${x} ${y}`;
        return ` L${x} ${y} `;
      });

      if (segments.length > 1) {
        d += segments.join(' ');
      }

      // Close the path at bottom
      d += ` L${width}, 0 `;
      return d.trim();
    };

    const updateProgress = () => {
      const scrollerRect = scroller.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollMax = scroller.scrollWidth - scroller.clientWidth;
      // Progress based on how much has scrolled
      const scrollRatio = Math.min(1, scroller.scrollLeft / (scrollMax || 1));

      // Only draw if scroller is in view
      const isVisible = scrollerRect.bottom > 0 && scrollerRect.top < vh;

      if (isVisible) {
        const percentage = scrollRatio * 100;
        curve.setAttribute('d', drawPath(percentage / 100));
      }
    };

    const updateActive = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      if (wrap.querySelector('.scroller-ctrl.prev')) {
        wrap.querySelector('.scroller-ctrl.prev').disabled = scroller.scrollLeft <= 5;
      }
      if (wrap.querySelector('.scroller-ctrl.next')) {
        wrap.querySelector('.scroller-ctrl.next').disabled = scroller.scrollLeft >= max - 5;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  };

    // Reuse regular scroller controls
    initScrollerControls();
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
