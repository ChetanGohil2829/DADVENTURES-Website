
// v3.4.9 Header/Logo/Sound fixes

// Update theme glow dynamically when theme changes
(function() {
  function updateGlowColor() {
    let theme = localStorage.getItem('dad_theme') || 'blue';
    let glow = '#1fb6ff'; // default blue
    if (theme === 'pink') glow = '#ff4d94';
    if (theme === 'purple') glow = '#9b59b6';
    if (theme === 'green') glow = '#2ecc71';
    if (theme === 'orange') glow = '#e67e22';
    if (theme === 'gold') glow = '#f1c40f';
    document.documentElement.style.setProperty('--theme-glow', glow);
  }
  updateGlowColor();
  window.addEventListener('storage', updateGlowColor);
})();
