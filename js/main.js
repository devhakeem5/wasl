/* =====================================================================
   وصل لنمو الأعمال — main.js
   التفاعلات والحركة (المرحلة السابعة)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileMenu();
  initRevealOnScroll();
  initJourneyTimeline();
  initSystemTabs();
  initSmoothAnchors();
  initCounterAnimation();
});

/* ------------------------------------------------------------------
   1. تغيير حالة الهيدر عند التمرير
   ------------------------------------------------------------------ */
function initHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // تحديث فوري عند التحميل في حالة صفحة مُحدّثة في منتصفها
  onScroll();
}

/* ------------------------------------------------------------------
   2. قائمة الجوال
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

  // إغلاق عند النقر على أي رابط داخل القائمة
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  // إغلاق عند النقر خارج القائمة
  document.addEventListener("click", (e) => {
    if (
      document.body.classList.contains("menu-open") &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      close();
    }
  });

  // إغلاق عند ضغط Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      close();
      toggle.focus();
    }
  });
}

/* ------------------------------------------------------------------
   3. إظهار العناصر عند التمرير (Reveal on Scroll)
   ------------------------------------------------------------------ */
function initRevealOnScroll() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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
   4. Timeline مراحل رحلتك مع وصل
   ------------------------------------------------------------------ */
function initJourneyTimeline() {
  const timeline = document.querySelector("[data-journey]");
  if (!timeline) return;

  const steps = timeline.querySelectorAll(".journey-step");
  if (!steps.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) {
    steps.forEach((step) => step.classList.add("is-active"));
    return;
  }

  const activateStep = (step) => {
    steps.forEach((s) => s.classList.remove("is-active"));
    step.classList.add("is-active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateStep(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "-10% 0px -10% 0px",
    }
  );

  steps.forEach((step) => observer.observe(step));

  // تفعيل أول خطوة تلقائياً
  if (steps[0]) {
    steps[0].classList.add("is-active");
  }
}

/* ------------------------------------------------------------------
   5. Tabs منظومة وصل
   ------------------------------------------------------------------ */
function initSystemTabs() {
  const tabsContainer = document.querySelector("[data-tabs]");
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll("[data-tab]");
  const panels = tabsContainer.querySelectorAll("[data-panel]");

  if (!tabs.length || !panels.length) return;

  const activateTab = (targetTab) => {
    const targetPanelId = targetTab.dataset.tab;

    // تحديث حالة الأزرار
    tabs.forEach((tab) => {
      const isTarget = tab === targetTab;
      tab.classList.toggle("is-active", isTarget);
      tab.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    // تحديث حالة الـ panels مع تأثير ناعم
    panels.forEach((panel) => {
      const isTarget = panel.id === targetPanelId;

      if (isTarget) {
        panel.removeAttribute("hidden");
        // تأخير طفيف لضمان تفعيل الـ transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.classList.add("is-active");
          });
        });
      } else {
        panel.classList.remove("is-active");
        // إخفاء بعد انتهاء الـ transition
        const onTransitionEnd = () => {
          panel.setAttribute("hidden", "");
          panel.removeEventListener("transitionend", onTransitionEnd);
        };
        panel.addEventListener("transitionend", onTransitionEnd);
      }
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));

    // دعم لوحة المفاتيح (الأسهم)
    tab.addEventListener("keydown", (e) => {
      const tabList = [...tabs];
      const currentIndex = tabList.indexOf(tab);
      let nextIndex = -1;

      // RTL: اليمين = السابق، اليسار = التالي
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        nextIndex = (currentIndex + 1) % tabList.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabList.length - 1;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        tabList[nextIndex].focus();
        activateTab(tabList[nextIndex]);
      }
    });
  });
}

/* ------------------------------------------------------------------
   6. التمرير السلس للروابط الداخلية
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

      // تحديث الـ URL بدون إعادة تحميل
      history.pushState(null, "", `#${targetId}`);

      // تركيز على العنصر لإمكانية الوصول
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
   7. تحريك الأرقام عند الظهور (اختياري - للإثراء البصري)
   ------------------------------------------------------------------ */
function initCounterAnimation() {
  // لا يوجد حالياً عناصر أرقام لتحريكها بشكل منفصل
  // هذه الدالة جاهزة لإضافة عدادات مستقبلاً
}
