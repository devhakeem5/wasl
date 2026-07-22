/* =====================================================================
   وصل لنمو الأعمال — main.js
   إعادة كتابة كاملة v2 — فلسفة "الخط الذي يصل"
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initManyDrawer();
  initConsultModal();
  initHeroSimple();
  initWhyScroll();
  initMomentsAutoScroll();
  initTransformScatter();
  initSystemCards();
  initRevealOnScroll();
  initSmoothAnchors();
  initServicesTrunkScroll();
  initVIPCursor();
  initCardSpotlightAndTilt();
  initServicePills();
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
   2. Many Drawer (off-canvas navigation)
   ------------------------------------------------------------------ */
function initManyDrawer() {
  const toggle = document.querySelector("[data-many-toggle]");
  const drawer = document.querySelector("[data-many-drawer]");
  const overlay = document.querySelector("[data-many-overlay]");
  const closeBtn = document.querySelector("[data-many-close]");
  if (!toggle || !drawer || !overlay) return;

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  drawer.querySelectorAll("[data-many-link]").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });
}

/* ------------------------------------------------------------------
   3. Consultation Modal
   ------------------------------------------------------------------ */
function initConsultModal() {
  const openTriggers = document.querySelectorAll("[data-open-consult]");
  const modal = document.querySelector("[data-consult-modal]");
  const overlay = document.querySelector("[data-consult-overlay]");
  const closeBtn = document.querySelector("[data-consult-close]");
  const form = document.querySelector("[data-consult-form]");
  const successMsg = document.querySelector("[data-consult-success]");
  if (!modal || !overlay) return;

  const open = () => {
    modal.classList.add("is-open");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("input");
    if (firstInput) setTimeout(() => firstInput.focus(), 300);
  };

  const close = () => {
    modal.classList.remove("is-open");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      open();
      const preset = btn.dataset.servicePreset;
      if (preset) {
        const pill = modal.querySelector(`[data-service="${preset}"]`);
        if (pill && !pill.classList.contains("is-selected")) {
          pill.click();
        }
      }
    });
  });
  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (successMsg) {
        successMsg.classList.add("is-visible");
        setTimeout(() => {
          form.reset();
          close();
          successMsg.classList.remove("is-visible");
        }, 2200);
      }
    });
  }
}

/* ------------------------------------------------------------------
   4. Hero Simple — reveal sequence: الفكرة → شعار → الأثر → نص → زر
   ------------------------------------------------------------------ */
function initHeroSimple() {
  const words = document.querySelectorAll("[data-hero-word]");
  if (!words.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    words.forEach((w) => w.classList.add("is-visible"));
    return;
  }

  words.forEach((word, i) => {
    setTimeout(() => word.classList.add("is-visible"), 200 + i * 220);
  });
}

/* ------------------------------------------------------------------
   5. Why Scroll — Sticky Cinematic Narrative Chamber Switcher
   ------------------------------------------------------------------ */
function initWhyScroll() {
  const section = document.querySelector(".why");
  const acts = document.querySelectorAll("[data-narrative-act]");
  const scrubberSteps = document.querySelectorAll("[data-why-step]");
  if (!section || !acts.length) return;

  const updateAct = (index) => {
    acts.forEach((act, i) => {
      act.classList.toggle("is-active", i === index);
    });
    scrubberSteps.forEach((step, i) => {
      step.classList.toggle("is-active", i === index);
    });
  };

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    if (sectionHeight <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

    let activeAct = 0;
    if (progress > 0.62) {
      activeAct = 2;
    } else if (progress > 0.28) {
      activeAct = 1;
    } else {
      activeAct = 0;
    }

    updateAct(activeAct);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  scrubberSteps.forEach((step) => {
    step.addEventListener("click", () => {
      const stepIdx = parseInt(step.dataset.whyStep, 10);
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const targetScroll = sectionTop + (stepIdx / 2) * sectionHeight;

      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    });
  });
}

/* ------------------------------------------------------------------
   6. Moments Auto-Scroll — لحظات نصنع فيها الفرق
   يمرر تلقائيًا عند عدم كفاية العرض لإظهار كل البطاقات
   ------------------------------------------------------------------ */
function initMomentsAutoScroll() {
  const track = document.querySelector("[data-moments-track]");
  if (!track) return;

  const wrap = track.parentElement;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let autoScrollTimer = null;
  let isHovering = false;
  let isInView = false;

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      if (isHovering || !isInView) return;
      const maxScroll = track.scrollWidth - wrap.clientWidth;
      if (maxScroll <= 0) return;

      if (wrap.scrollLeft >= maxScroll - 4) {
        wrap.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        wrap.scrollBy({ left: wrap.clientWidth * 0.85, behavior: "smooth" });
      }
    }, 3200);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
  };

  // Only auto-scroll if content overflows
  const checkOverflow = () => {
    const overflows = track.scrollWidth > wrap.clientWidth + 8;
    if (overflows) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  };

  wrap.addEventListener("mouseenter", () => (isHovering = true));
  wrap.addEventListener("mouseleave", () => (isHovering = false));
  wrap.addEventListener("touchstart", () => (isHovering = true), { passive: true });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
      });
    },
    { threshold: 0.3 }
  );
  sectionObserver.observe(wrap);

  window.addEventListener("resize", checkOverflow, { passive: true });
  checkOverflow();
}

/* ------------------------------------------------------------------
   7. Transform Scatter → Assembled List
   الأيقونات موزعة عشوائياً، وعند التمرير العمودي تتجمع في قائمة
   ------------------------------------------------------------------ */
function initTransformScatter() {
  const stage = document.querySelector("[data-transform-stage]");
  if (!stage) return;

  const items = stage.querySelectorAll("[data-transform-item]");
  if (!items.length) return;

  items.forEach((item, i) => {
    item.style.setProperty("--item-idx", i);
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    stage.classList.add("is-assembled");
    return;
  }

  const section = stage.closest(".transform") || stage;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stage.classList.add("is-assembled");
        } else {
          stage.classList.remove("is-assembled");
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
}

/* ------------------------------------------------------------------
   8. System Cards — connected interaction
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
   9. Services Trunk — scroll-driven draw
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
   10. Reveal on Scroll (generic)
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
   11. Smooth scrolling for anchor links
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

/* ------------------------------------------------------------------
   12. VIP Custom Magnetic Cursor & Inertia Aura
   ------------------------------------------------------------------ */
function initVIPCursor() {
  const dot = document.querySelector("[data-custom-cursor]");
  const aura = document.querySelector("[data-cursor-aura]");
  if (!dot || !aura) return;

  if (window.matchMedia("(pointer: coarse)").matches) {
    dot.style.display = "none";
    aura.style.display = "none";
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function renderAura() {
    auraX += (mouseX - auraX) * 0.16;
    auraY += (mouseY - auraY) * 0.16;
    aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderAura);
  }
  requestAnimationFrame(renderAura);

  const hoverSelectors = 'a, button, input, textarea, select, .moment-card, .system-card, .transform-item, .service-branch-card, .service-pill';
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSelectors)) {
      aura.classList.add("is-hovered");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverSelectors)) {
      aura.classList.remove("is-hovered");
    }
  });
}

/* ------------------------------------------------------------------
   13. Card Spotlight & 3D Tilt Interactivity
   ------------------------------------------------------------------ */
function initCardSpotlightAndTilt() {
  const cards = document.querySelectorAll(
    ".moment-card, .system-card, .transform-item, .service-branch-card, .consult-modal"
  );
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add("spotlight-card");

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ------------------------------------------------------------------
   14. Service Pills Selection in Consultation Modal
   ------------------------------------------------------------------ */
function initServicePills() {
  const pills = document.querySelectorAll("[data-consult-pills] .service-pill");
  const hiddenInput = document.querySelector("[data-selected-services]");
  if (!pills.length || !hiddenInput) return;

  const selectedServices = new Set();

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const service = pill.dataset.service;
      if (selectedServices.has(service)) {
        selectedServices.delete(service);
        pill.classList.remove("is-selected");
      } else {
        selectedServices.add(service);
        pill.classList.add("is-selected");
      }
      hiddenInput.value = Array.from(selectedServices).join(", ");
    });
  });
}
