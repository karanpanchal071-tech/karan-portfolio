/**
 * KARAN PANCHAL — PORTFOLIO
 * script.js
 */

'use strict';

/* ============================================================
   NAVIGATION
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = navLinks.querySelectorAll('.nav-link');

  // Scrolled class
  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActive();
  }

  // Active section highlight
  function highlightActive() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const scrollY  = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }

  // Mobile menu
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 68;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   HERO CANVAS PARTICLES
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId;

  const CFG = {
    count:      55,
    maxRadius:  2,
    minRadius:  0.4,
    speed:      0.3,
    connectDist: 130,
    colors:     ['#3b82f6', '#8b5cf6', '#06b6d4'],
  };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function randomColor() {
    return CFG.colors[Math.floor(Math.random() * CFG.colors.length)];
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < CFG.count; i++) {
      particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    Math.random() * (CFG.maxRadius - CFG.minRadius) + CFG.minRadius,
        vx:   (Math.random() - 0.5) * CFG.speed,
        vy:   (Math.random() - 0.5) * CFG.speed,
        color: randomColor(),
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.connectDist) {
          const opacity = (1 - dist / CFG.connectDist) * 0.1;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${opacity})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Reduce particles on small screens
  function initResponsive() {
    if (window.innerWidth < 768) {
      CFG.count       = 28;
      CFG.connectDist = 90;
    } else {
      CFG.count       = 55;
      CFG.connectDist = 130;
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(canvas);

  initResponsive();
  resize();
  loop();
})();

/* ============================================================
   KEYWORD ROTATOR
   ============================================================ */
(function initKeywordRotator() {
  const rotator = document.getElementById('keywordRotator');
  if (!rotator) return;

  const keywords = rotator.querySelectorAll('.keyword');
  if (keywords.length === 0) return;

  let current = 0;

  setInterval(() => {
    keywords[current].classList.remove('active');
    current = (current + 1) % keywords.length;
    keywords[current].classList.add('active');
  }, 2400);
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el       = entry.target;
        const target   = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1400;
        const start    = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3);
          const value    = (target * ease).toFixed(decimals);
          el.textContent = value;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   SKILL BAR ANIMATION
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ============================================================
   CERTIFICATE MODAL
   ============================================================ */
(function initCertModal() {
  const modal   = document.getElementById('certModal');
  const overlay = document.getElementById('certModalOverlay');
  const close   = document.getElementById('certModalClose');
  const img     = document.getElementById('certModalImg');

  if (!modal) return;

  function openModal(src) {
    img.src = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.src = '';
  }

  // Open via view buttons
  document.querySelectorAll('.cert-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const certSrc = btn.dataset.cert;
      if (certSrc) openModal(certSrc);
    });
  });

  // Close handlers
  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Trap focus in modal
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
})();

/* ============================================================
   PROJECT ITEMS — KEYBOARD SUPPORT
   ============================================================ */
(function initProjectItems() {
  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('expanded');
      }
    });
  });
})();

/* ============================================================
   HERO IMAGE PARALLAX (subtle)
   ============================================================ */
(function initParallax() {
  const frame = document.querySelector('.hero-image-frame');
  if (!frame) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', e => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth  - 0.5) * 10;
    const y = (e.clientY / innerHeight - 0.5) * 8;
    frame.style.transform = `translate(${x}px, ${y}px)`;
  });
})();
