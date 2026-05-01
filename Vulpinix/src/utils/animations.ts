/**
 * Vulpinix AI — Global Animation Controller
 * Handles: scroll progress, custom cursor, IntersectionObserver reveals,
 *          counter animations, bar animations, chart bars.
 * Pure JS — no new packages. Called once from App.tsx useEffect.
 */
export function initAnimations() {
  if (typeof window === "undefined") return;

  /* ── SCROLL PROGRESS BAR ─────────────────────────────────────────── */
  const progressBar = document.getElementById("vx-scroll-progress");
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : "0%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ── CUSTOM CURSOR ───────────────────────────────────────────────── */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

  if (dot && ring) {
    // Move dot instantly
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Move ring with smooth lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover effect on interactive elements
    const interactives = 'a, button, input, textarea, select, [role="button"], .plat-card, .feat-card, .vx-card, .nav-link, label';
    
    const addHoverToBody = (el: Element) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    };

    document.querySelectorAll(interactives).forEach(addHoverToBody);

    new MutationObserver((muts) => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n instanceof Element) {
          if (n.matches(interactives)) addHoverToBody(n);
          n.querySelectorAll(interactives).forEach(addHoverToBody);
        }
      }));
    }).observe(document.body, { childList: true, subtree: true });

    // Click effect
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ── INTERSECTION OBSERVER — REVEAL ──────────────────────────────── */
  const prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  if (prefersMotion) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vx-visible");
            revealObs.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const revealAll = () => {
      document.querySelectorAll(
        ".vx-reveal, .vx-reveal-left, .vx-reveal-right, .vx-reveal-scale, .vx-heading-underline"
      ).forEach(el => revealObs.observe(el));
    };
    revealAll();

    // Re-observe on DOM changes
    new MutationObserver(revealAll).observe(document.body, { childList: true, subtree: true });
  }

  /* ── COUNTER ANIMATION ───────────────────────────────────────────── */
  const animateCounter = (el: HTMLElement) => {
    const target    = parseFloat(el.dataset.countTarget || "0");
    const suffix    = el.dataset.countSuffix  || "";
    const prefix    = el.dataset.countPrefix  || "";
    const decimals  = parseInt(el.dataset.countDecimals || "0");
    const duration  = 2800; // slower duration
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quart for a very smooth slow finish
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;
      
      el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
        el.classList.add("vx-count-done");
      }
    };
    requestAnimationFrame(step);
  };

  const counterObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target as HTMLElement);
        counterObs.unobserve(e.target);
      }
    }),
    { threshold: 0.3 }
  );
  const observeCounters = () => {
    document.querySelectorAll("[data-count-target]").forEach(el => counterObs.observe(el));
  };
  observeCounters();
  new MutationObserver(observeCounters).observe(document.body, { childList: true, subtree: true });

  /* ── BAR WIDTH ANIMATION ─────────────────────────────────────────── */
  const barObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("vx-visible");
        barObs.unobserve(e.target);
      }
    }),
    { threshold: 0.2 }
  );
  const observeBars = () => {
    document.querySelectorAll(".vx-bar-animated").forEach(el => barObs.observe(el));
  };
  observeBars();
  new MutationObserver(observeBars).observe(document.body, { childList: true, subtree: true });

  /* ── CHART BAR ANIMATION ─────────────────────────────────────────── */
  const chartBarObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        // stagger each bar
        const bars = e.target.querySelectorAll(".vx-chart-bar");
        bars.forEach((b, i) => {
          setTimeout(() => b.classList.add("vx-visible"), i * 80);
        });
        chartBarObs.unobserve(e.target);
      }
    }),
    { threshold: 0.2 }
  );
  const observeChartBars = () => {
    document.querySelectorAll(".vx-chart-group").forEach(el => chartBarObs.observe(el));
  };
  observeChartBars();
  new MutationObserver(observeChartBars).observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener("scroll", updateProgress);
  };
}
