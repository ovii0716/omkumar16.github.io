/* ─────────────────────────────────────────────
   script.js — Om Kumar Portfolio
   ─────────────────────────────────────────────  */

"use strict";

/* ══════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  // Only show custom cursor on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .skill-tag, .project-card, .achievement-card, .timeline-card'
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovered');
      follower.classList.add('is-hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovered');
      follower.classList.remove('is-hovered');
    });
  });
})();


/* ══════════════════════════════════
   2. NAVBAR — SCROLL BEHAVIOUR
══════════════════════════════════ */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!nav) return;

  // Scroll class
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 60);
    lastScrollY = scrollY;
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();


/* ══════════════════════════════════
   3. INTERSECTION OBSERVER — REVEAL
══════════════════════════════════ */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal-up:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(delay, 400));

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ══════════════════════════════════
   4. HERO — TYPEWRITER EFFECT
══════════════════════════════════ */
(function initHeroReveal() {
  // Trigger hero elements quickly on load
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
})();


/* ══════════════════════════════════
   5. PARALLAX ON PROJECT CARDS
══════════════════════════════════ */
(function initParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);

      const rotateX =  dy * -4;  // degrees
      const rotateY =  dx *  4;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
      // Remove transition after it settles
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
})();


/* ══════════════════════════════════
   6. SMOOTH SCROLL for CTA
══════════════════════════════════ */
(function initSmoothScroll() {
  const btn = document.getElementById('view-work-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();


/* ══════════════════════════════════
   7. ACTIVE NAV HIGHLIGHTING
══════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.style.color = 'var(--accent)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
})();


/* ══════════════════════════════════
   8. SKILLS CLOUD — SHUFFLE ON LOAD
══════════════════════════════════ */
(function shuffleSkills() {
  const cloud = document.querySelector('.skills-cloud');
  if (!cloud) return;

  const tags = Array.from(cloud.children);
  // Fisher-Yates shuffle for a more organic look
  for (let i = tags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    cloud.appendChild(tags[j]);
    tags.splice(j, 1);
  }
})();


/* ══════════════════════════════════
   9. HERO BG TEXT PARALLAX
══════════════════════════════════ */
(function initHeroBgParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    bgText.style.transform = `translateY(calc(-50% + ${scrolled * 0.3}px))`;
  }, { passive: true });
})();


/* ══════════════════════════════════
   10. FOOTER EMAIL COPY-TO-CLIPBOARD
══════════════════════════════════ */
(function initEmailCopy() {
  const emailLink = document.getElementById('email-link');
  if (!emailLink) return;

  emailLink.addEventListener('click', (e) => {
    const email = emailLink.href.replace('mailto:', '');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        const original = emailLink.textContent.trim();
        emailLink.textContent = '✓ Copied to clipboard!';
        emailLink.style.color = '#22c55e';
        setTimeout(() => {
          emailLink.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            ${email}`;
          emailLink.style.color = '';
        }, 2000);
      });
    }
    // If clipboard fails, let the mailto href do its thing
  });
})();
