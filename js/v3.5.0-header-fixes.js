
// v3.5.0 Header/Logo/Sound/Mobile menu fixes

// Theme glow update + override
(function() {
  function updateGlowColor() {
    let theme = localStorage.getItem('dad_theme') || 'blue';
    let glow = '#1fb6ff';
    if (theme === 'pink') glow = '#ff4d94';
    if (theme === 'purple') glow = '#9b59b6';
    if (theme === 'green') glow = '#2ecc71';
    if (theme === 'orange') glow = '#e67e22';
    if (theme === 'gold') glow = '#f1c40f';
    let override = document.body.getAttribute('data-glow-override');
    if (override) glow = override;
    document.documentElement.style.setProperty('--theme-glow', glow);
  }
  updateGlowColor();
  window.addEventListener('storage', updateGlowColor);
})();

// Mobile menu toggle
(function() {
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle) return;
  let mobileNav = document.querySelector('.mobile-nav');
  if (!mobileNav) return;

  // Backdrop
  let backdrop = document.createElement('div');
  backdrop.className = 'menu-backdrop';
  document.body.appendChild(backdrop);

  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    backdrop.classList.toggle('active');
  });
  backdrop.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    backdrop.classList.remove('active');
  });
})();

// Ensure only one global audio player is active
(function() {
  let globalPlayer = document.getElementById('globalMusic');
  if (globalPlayer) {
    document.querySelectorAll('.volume-controls, .floating-player, .music-overlay, .audio-floating, .player-overlay')
      .forEach(el => el.remove());
  }
})();
