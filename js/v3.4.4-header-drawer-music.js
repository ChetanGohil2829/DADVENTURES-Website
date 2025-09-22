
(function(){
  // Hamburger Button - Ensure mobile navigation is toggling correctly
  const btn = document.querySelector('#header-drawer-toggle');
  const mobileNav = document.querySelector('#header-drawer');
  if (btn && mobileNav) {
      btn.addEventListener('click', () => {
          mobileNav.classList.toggle('open');
          document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });
  }
  // Ensure the mobile navigation closes when any link is clicked
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';  // Re-enable body scrolling when menu is closed
      });
  });

  // Volume Slider functionality for mobile
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

  // Persist the audio state across page transitions
  if (!audio.paused) {
      localStorage.setItem('audio-playing', true);
  } else {
      if (localStorage.getItem('audio-playing') === 'true') {
          audio.play();
      }
  }
  audio.loop = true;
})();
