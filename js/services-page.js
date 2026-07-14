/* ==========================================================================
   SERVICES PAGE JAVASCRIPT - ADVANCED CINEMATIC LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Text Splitting for 3D Spring Blur Animation
  const splitTargets = document.querySelectorAll("[data-split-words]");
  splitTargets.forEach(el => {
    const text = el.textContent.trim();
    if (!text) return;
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="s-word" style="--wi:${i}">${w}</span>`)
      .join(" ");
  });

  // 2. Intersection Observer & Nav State
  const container = document.querySelector(".services-container");
  if (!container) return;

  const scenes = document.querySelectorAll(".service-scene");
  const navButtons = document.querySelectorAll(".services-nav button");
  const progressBar = document.querySelector(".services-progress");

  function updateNav(index) {
    navButtons.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });
    // Calculate progress percentage
    const progress = (index / (scenes.length - 1)) * 100;
    progressBar.style.setProperty("--progress", `${progress}%`);
  }

  const observerOptions = {
    root: container,
    rootMargin: "0px",
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add active class to trigger CSS animations
        entry.target.classList.add("is-active");
        
        // Reset word animations to ensure they replay
        const words = entry.target.querySelectorAll(".s-word, .glass-tag");
        words.forEach(w => {
          w.style.animation = "none";
          void w.offsetWidth; // force reflow
          w.style.animation = "";
        });

        const index = Array.from(scenes).indexOf(entry.target);
        updateNav(index);
      } else {
        entry.target.classList.remove("is-active");
      }
    });
  }, observerOptions);

  scenes.forEach(scene => observer.observe(scene));

  // Click on nav buttons to scroll to scene
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-goto"), 10);
      scenes[index].scrollIntoView({ behavior: "smooth" });
    });
  });

  // 3. Advanced Parallax & 3D Interactivity
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    const activeScene = document.querySelector(".service-scene.is-active");
    if (!activeScene) return;

    // A. Move the background visual in parallax
    const visual = activeScene.querySelector(".scene-visuals");
    if (visual) {
      visual.style.transform = `translate(${mouseX * -40}px, ${mouseY * -40}px)`;
    }

    // B. Move the giant watermark number in the opposite direction
    const watermark = activeScene.querySelector(".watermark-num");
    if (watermark) {
      // Keep it centered but add parallax
      watermark.style.transform = `translate(calc(-50% + ${mouseX * 80}px), calc(-50% + ${mouseY * 80}px))`;
    }

    // C. Make the orbit center (constellation) lean towards the mouse (3D tilt)
    const orbit = activeScene.querySelector(".orbit-center");
    if (orbit) {
      // Rotation X uses mouseY, Rotation Y uses mouseX
      orbit.style.transform = `rotateX(${mouseY * -20}deg) rotateY(${mouseX * 20}deg)`;
    }
  });
  
  // Trigger first scene on load
  setTimeout(() => {
    if(scenes[0]) {
      scenes[0].classList.add("is-active");
      updateNav(0);
    }
  }, 100);
});
