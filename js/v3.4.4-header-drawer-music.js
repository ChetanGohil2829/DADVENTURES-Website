
(function(){
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return Array.from((root || document).querySelectorAll(s)); }
  
  // Hamburger Button - Ensure mobile navigation is toggling correctly
  const btn = document.querySelector('#header-drawer-toggle');
  const mobileNav = document.querySelector('#header-drawer');
  if (btn && mobileNav) {
      btn.addEventListener('click', () => {
          mobileNav.classList.toggle('open');  // Toggle the drawer menu
      });
  }
  // Close the mobile navigation when any link is clicked
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          mobileNav.classList.remove('open');  // Close the menu after a link is clicked
      });
  });

  // Volume Slider Fix - Add touch and pointer events for mobile
  const audio = document.querySelector('#bg-music');
  const slider = document.querySelector('#music-vol');
  if (slider && audio) {
      slider.addEventListener('input', (e) => {
          audio.volume = e.target.value;
      });
      slider.addEventListener('touchmove', (e) => {
          audio.volume = e.target.value;
      });
      slider.addEventListener('pointermove', (e) => {
          audio.volume = e.target.value;
      });
  }
})();
