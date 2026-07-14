/* =====================================================================
   وصل لنمو الأعمال — main.js
   إعادة كتابة كاملة — فلسفة "الخط الذي يصل"
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileMenu();
  initHeroSequence();
  initStoryParts();
  initJourneyPath();
  initSystemCards();
  initRevealOnScroll();
  initSmoothAnchors();
  initStoryLineScroll();
  initServicesTrunkScroll();
});

/* ------------------------------------------------------------------
   1. Header scroll state
   ------------------------------------------------------------------ */
function initHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------------
   2. Mobile menu
   ------------------------------------------------------------------ */
function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (!toggle || !nav) return;

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "إغلاق القائمة");
    document.body.classList.add("menu-open");
    nav.classList.add("is-open");
  };

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح القائمة");
    document.body.classList.remove("menu-open");
    nav.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("click", (e) => {
    if (
      document.body.classList.contains("menu-open") &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      close();
      toggle.focus();
    }
  });
}

/* ------------------------------------------------------------------
   3. Hero Animation Sequence
   الفكرة → خط ذهبي → الأثر → نص → أزرار → وعد
   ------------------------------------------------------------------ */
function initHeroSequence() {
  const idea = document.querySelector("[data-hero-idea]");
  const impact = document.querySelector("[data-hero-impact]");
  const line = document.querySelector("[data-hero-line]");
  const badge = document.querySelector("[data-hero-badge]");
  const branch = document.querySelector("[data-hero-branch]");
  const lead = document.querySelector("[data-hero-lead]");
  const desc = document.querySelector("[data-hero-desc]");
  const promise = document.querySelector("[data-hero-promise]");

  if (!idea || !impact || !line) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // Show everything instantly
    [idea, impact].forEach(el => el.classList.add("is-visible"));
    line.classList.add("is-drawn");
    if (badge) badge.classList.add("is-visible");
    if (branch) branch.classList.add("is-visible");
    if (lead) lead.classList.add("is-visible");
    if (desc) desc.classList.add("is-visible");
    const actions = document.querySelector(".hero-actions");
    if (actions) actions.classList.add("is-visible");
    if (promise) promise.classList.add("is-visible");
    return;
  }

  // Sequential animation
  const sequence = [
    { delay: 200,  action: () => idea.classList.add("is-visible") },
    { delay: 600,  action: () => line.classList.add("is-drawn") },
    { delay: 1400, action: () => impact.classList.add("is-visible") },
    { delay: 1700, action: () => { if (badge) badge.classList.add("is-visible"); } },
    { delay: 2000, action: () => { if (branch) branch.classList.add("is-visible"); } },
    { delay: 2100, action: () => { if (lead) lead.classList.add("is-visible"); } },
    { delay: 2400, action: () => { if (desc) desc.classList.add("is-visible"); } },
    { delay: 2600, action: () => {
      const actions = document.querySelector(".hero-actions");
      if (actions) actions.classList.add("is-visible");
    }},
    { delay: 2900, action: () => { if (promise) promise.classList.add("is-visible"); } },
  ];

  sequence.forEach(({ delay, action }) => {
    setTimeout(action, delay);
  });
}

/* ------------------------------------------------------------------
   4. Story Parts — activate on scroll
   ------------------------------------------------------------------ */
function initStoryParts() {
  const parts = document.querySelectorAll("[data-story-part]");
  if (!parts.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    parts.forEach(p => p.classList.add("is-active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: "-5% 0px -5% 0px",
    }
  );

  parts.forEach((part) => observer.observe(part));
}

/* ------------------------------------------------------------------
   5. Story Line — scroll-driven draw
   ------------------------------------------------------------------ */
function initStoryLineScroll() {
  const storySection = document.getElementById("story");
  const storyLine = document.querySelector("[data-story-line]");
  if (!storySection || !storyLine) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    storyLine.style.strokeDashoffset = "0";
    return;
  }

  const updateLine = () => {
    const rect = storySection.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrolled = viewportHeight - rect.top;
    const total = sectionHeight + viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / total));

    // stroke-dasharray is "100", so dashoffset goes from 100 to 0
    storyLine.style.strokeDashoffset = String(100 - progress * 100);
  };

  window.addEventListener("scroll", updateLine, { passive: true });
  updateLine();
}

/* ------------------------------------------------------------------
   6. Journey Path — horizontal path & node interaction
   ------------------------------------------------------------------ */
function initJourneyPath() {
  const pathContainer = document.querySelector("[data-journey-path]");
  const nodes = document.querySelectorAll("[data-journey-node]");
  const details = document.querySelectorAll("[data-journey-detail]");
  const pathLine = document.querySelector("[data-journey-line]");

  if (!pathContainer || !nodes.length || !details.length) return;

  // Activate node on click
  const activateNode = (index) => {
    nodes.forEach((n, i) => {
      n.classList.toggle("is-active", i === index);
    });
    details.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });
  };

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const idx = parseInt(node.dataset.journeyNode, 10);
      activateNode(idx);
    });
  });

  // Draw path line on scroll
  if (pathLine) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      pathLine.style.strokeDashoffset = "0";
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              pathLine.style.strokeDashoffset = "0";
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(pathContainer);
    }
  }

  // Auto-cycle nodes on scroll
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    const journeySection = document.getElementById("journey");
    if (journeySection) {
      const scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Stagger activate nodes
              nodes.forEach((_, i) => {
                setTimeout(() => {
                  if (i < nodes.length) {
                    activateNode(i);
                  }
                }, i * 800);
              });
              scrollObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      scrollObserver.observe(journeySection);
    }
  }
}

/* ------------------------------------------------------------------
   7. System Cards — connected interaction
   ------------------------------------------------------------------ */
function initSystemCards() {
  const cards = document.querySelectorAll("[data-system-card]");
  const details = document.querySelectorAll("[data-system-detail]");
  if (!cards.length || !details.length) return;

  const activateCard = (index) => {
    cards.forEach((c, i) => {
      const isActive = i === index;
      c.classList.toggle("is-active", isActive);
      c.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
    details.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.dataset.systemCard, 10);
      activateCard(idx);
    });
  });
}

/* ------------------------------------------------------------------
   8. Services Trunk — scroll-driven draw
   ------------------------------------------------------------------ */
function initServicesTrunkScroll() {
  const servicesSection = document.getElementById("services");
  const trunkLine = document.querySelector("[data-services-trunk-line]");
  if (!servicesSection || !trunkLine) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    trunkLine.style.strokeDashoffset = "0";
    return;
  }

  const updateTrunk = () => {
    const rect = servicesSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrolled = viewportHeight - rect.top;
    const total = sectionHeight + viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / total));

    trunkLine.style.strokeDashoffset = String(100 - progress * 100);
  };

  window.addEventListener("scroll", updateTrunk, { passive: true });
  updateTrunk();
}

/* ------------------------------------------------------------------
   9. Reveal on Scroll (generic)
   ------------------------------------------------------------------ */
function initRevealOnScroll() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------
   10. Smooth scrolling for anchor links
   ------------------------------------------------------------------ */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${targetId}`);

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true }
      );
    });
  });
}
