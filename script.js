/**
 * TEJASHRI PATIL PORTFOLIO — SCRIPT.JS
 * Modern Portfolio with Animations, Interactivity & More
 * 2026
 */

'use strict';

/* =============================================
   1. LOADING SCREEN
   ============================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero animations after load
    initReveal();
  }, 1800);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';


/* =============================================
   2. THEME TOGGLE (Dark / Light Mode)
   ============================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}


/* =============================================
   3. STICKY NAVBAR & ACTIVE LINK TRACKING
   ============================================= */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky shadow
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Active nav link
  let currentId = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) currentId = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });

  // Back to top button
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);

  // Trigger counter animations when achievements are in view
  triggerCounters();
  // Trigger skill bars
  triggerSkillBars();
  // Trigger CGPA bar
  triggerCgpaBars();
});

// Smooth scroll nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile nav
      document.getElementById('nav-links')?.classList.remove('open');
    }
  });
});


/* =============================================
   4. HAMBURGER MENU (Mobile)
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  navMenu?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navMenu?.classList.contains('open');
  if (spans.length === 3) {
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  }
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (navMenu?.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger?.contains(e.target)) {
    navMenu.classList.remove('open');
    const spans = hamburger?.querySelectorAll('span');
    if (spans) { spans[0].style.transform = ''; spans[1].style.opacity = '1'; spans[2].style.transform = ''; }
  }
});


/* =============================================
   5. TYPING ANIMATION
   ============================================= */
const typingEl = document.getElementById('typing-text');
const phrases  = [
  'web experiences.',
  'React.js apps.',
  'backend systems.',
  'clean interfaces.',
  'scalable products.',
  'impactful software.',
];

let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
let typingTimer;

function typeText() {
  const currentPhrase = phrases[phraseIdx];

  if (isDeleting) {
    charIdx--;
  } else {
    charIdx++;
  }

  if (typingEl) typingEl.textContent = currentPhrase.slice(0, charIdx);

  let delay = isDeleting ? 60 : 90;

  if (!isDeleting && charIdx === currentPhrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting  = false;
    phraseIdx   = (phraseIdx + 1) % phrases.length;
    delay = 300;
  }

  typingTimer = setTimeout(typeText, delay);
}

setTimeout(typeText, 1200);


/* =============================================
   6. SCROLL REVEAL ANIMATIONS
   ============================================= */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// Call immediately for content above the fold
document.addEventListener('DOMContentLoaded', initReveal);


/* =============================================
   7. ANIMATED STAT COUNTERS (Hero)
   ============================================= */
const heroStats = document.querySelectorAll('.hero-stats .stat-number');
let heroCountersStarted = false;

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isLarge = target >= 1000;
  
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);

    if (isLarge) {
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'K'
        : current.toString();
    } else {
      el.textContent = current.toString();
    }

    if (progress < 1) requestAnimationFrame(step);
    else {
      el.textContent = isLarge && target >= 1000
        ? (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'K'
        : target.toString();
    }
  }
  requestAnimationFrame(step);
}

// Trigger hero counters when hero section is visible
const heroSection = document.getElementById('home');
function checkHeroCounters() {
  if (heroCountersStarted || !heroSection) return;
  const rect = heroSection.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    heroCountersStarted = true;
    heroStats.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      animateCounter(el, target);
    });
  }
}

window.addEventListener('scroll', checkHeroCounters);
checkHeroCounters(); // Check on load


/* =============================================
   8. COUNTER CARDS (Achievements)
   ============================================= */
const counterEls = document.querySelectorAll('.counter-number');
let countersStarted = false;

function triggerCounters() {
  if (countersStarted) return;
  const counterSection = document.querySelector('.counter-grid');
  if (!counterSection) return;
  const rect = counterSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersStarted = true;
    counterEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      animateCounter(el, target, 2000);
    });
  }
}


/* =============================================
   9. SKILL BARS ANIMATION
   ============================================= */
const skillFills = document.querySelectorAll('.skill-fill');
let skillsTriggered = false;

function triggerSkillBars() {
  if (skillsTriggered) return;
  const skillsSection = document.querySelector('.skills-section');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    skillsTriggered = true;
    skillFills.forEach((fill, i) => {
      const width = fill.getAttribute('data-width') || '0';
      setTimeout(() => {
        fill.style.width = `${width}%`;
      }, i * 60);
    });
  }
}


/* =============================================
   10. CGPA BARS ANIMATION
   ============================================= */
const cgpaBars = document.querySelectorAll('.cgpa-bar');
let cgpaTriggered = false;

function triggerCgpaBars() {
  if (cgpaTriggered) return;
  const eduSection = document.querySelector('.education-section');
  if (!eduSection) return;
  const rect = eduSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    cgpaTriggered = true;
    cgpaBars.forEach((bar, i) => {
      const w = bar.getAttribute('data-width') || '0';
      setTimeout(() => {
        bar.style.width = `${w}%`;
      }, i * 100);
    });
  }
}


/* =============================================
   11. PROJECT FILTER
   ============================================= */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach((card, idx) => {
      const category = card.getAttribute('data-category') || '';
      const matches  = filter === 'all' || category.includes(filter);

      if (matches) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // force reflow
        card.style.animation = `fadeInUp 0.4s ease ${idx * 0.05}s both`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* =============================================
   12. CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate fields
  const fields = contactForm.querySelectorAll('input, textarea');
  let valid = true;
  fields.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--accent)';
      valid = false;
    }
  });
  if (!valid) return;

  // Animate submit button
  const btnSpan = submitBtn?.querySelector('span');
  const btnIcon = submitBtn?.querySelector('i');
  if (submitBtn) {
    submitBtn.disabled = true;
    if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
    if (btnSpan) btnSpan.textContent = 'Sending...';
  }

  // Simulate send (replace with actual email service like EmailJS or Formspree)
  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
      if (btnSpan) btnSpan.textContent = 'Send Message';
    }
    if (formSuccess) formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(() => {
      if (formSuccess) formSuccess.classList.remove('show');
    }, 5000);
  }, 1500);
});


/* =============================================
   13. BACK TO TOP
   ============================================= */
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =============================================
   14. DOWNLOAD RESUME BUTTON
   ============================================= */
document.getElementById('downloadBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  // Create a placeholder download (in production, link to actual PDF)
  const btn = document.getElementById('downloadBtn');
  if (!btn) return;

  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Resume Downloaded!';
  btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
  }, 2500);

  // Actual file download — uncomment & update path when you have the PDF
  // const link = document.createElement('a');
  // link.href = 'Tejashri_Patil_Resume.pdf';
  // link.download = 'Tejashri_Patil_Resume.pdf';
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
});


/* =============================================
   15. SMOOTH SECTION HIGHLIGHTING HERO BLOB
   ============================================= */
document.addEventListener('mousemove', (e) => {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  blobs[0].style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  blobs[1].style.transform = `translate(${-x * 0.2}px, ${-y * 0.2}px)`;
});


/* =============================================
   16. NAVBAR LINK SMOOTH SCROLL FOR ALL ANCHORS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* =============================================
   17. INTERSECTION OBSERVER FOR SECTION ENTRANCE
   ============================================= */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.section').forEach(sec => sectionObserver.observe(sec));


/* =============================================
   18. CARD TILT EFFECT (Hero profile)
   ============================================= */
const profileWrap = document.querySelector('.hero-image-wrapper');
if (profileWrap) {
  profileWrap.addEventListener('mousemove', (e) => {
    const rect = profileWrap.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    profileWrap.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });
  profileWrap.addEventListener('mouseleave', () => {
    profileWrap.style.transform = '';
    profileWrap.style.transition = 'transform 0.5s ease';
  });
  profileWrap.addEventListener('mouseenter', () => {
    profileWrap.style.transition = 'transform 0.1s ease';
  });
}


/* =============================================
   19. COPY EMAIL ON CLICK
   ============================================= */
document.querySelectorAll('.contact-link-card').forEach(card => {
  const valueEl = card.querySelector('.contact-link-value');
  const label   = card.querySelector('.contact-link-label');
  if (!valueEl || !label) return;

  if (label.textContent.toLowerCase() === 'email') {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (card.tagName === 'A') return; // Let links do their thing
      const text = valueEl.textContent;
      navigator.clipboard?.writeText(text).then(() => {
        const orig = valueEl.textContent;
        valueEl.textContent = 'Copied!';
        valueEl.style.color = 'var(--green)';
        setTimeout(() => {
          valueEl.textContent = orig;
          valueEl.style.color = '';
        }, 2000);
      });
    });
  }
});


/* =============================================
   20. INIT ON DOM READY
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Initial reveal check (for elements above fold)
  window.dispatchEvent(new Event('scroll'));

  // Add stagger delay to project cards
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.05}s`;
  });

  // Add stagger to counter cards
  document.querySelectorAll('.counter-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // Achievement card stagger
  document.querySelectorAll('.achievement-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });
});


/* =============================================
   21. CONSOLE GREETING
   ============================================= */
console.log(
  '%c👋 Hey there, Developer!',
  'font-size: 18px; font-weight: bold; color: #6C63FF;'
);
console.log(
  '%cThis is Tejashri Patil\'s Portfolio.\nBuilt with ❤️ using HTML, CSS & JavaScript.',
  'font-size: 13px; color: #475569;'
);
console.log(
  '%c📧 patil.t.tejashri@gmail.com\n🐙 github.com/tejupatil015',
  'font-size: 12px; color: #8B5CF6;'
);