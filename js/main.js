const header = document.querySelector("[data-header]");

if (header) {
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    },
    { passive: true }
  );
}
