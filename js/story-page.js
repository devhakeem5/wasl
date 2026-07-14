/* ==========================================================================
   STORY PAGE JS - SYMMETRICAL STORYBOOK
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const scenes = document.querySelectorAll('.s-scene');
  const scrollInd = document.getElementById('scroll-ind');

  const observerOptions = {
    root: document.querySelector('.story-snap-container'),
    rootMargin: '0px',
    threshold: 0.6 // Trigger when 60% of the scene is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        
        // Hide scroll indicator if we pass the first scene
        if (entry.target.id !== 'scene-1' && scrollInd) {
          scrollInd.classList.add('hidden');
        }
      } else {
        // Optional: Remove class if you want animations to replay on scroll back
        // entry.target.classList.remove('is-active');
      }
    });
  }, observerOptions);

  scenes.forEach(scene => observer.observe(scene));
});
