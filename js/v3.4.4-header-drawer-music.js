
(function(){
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

  // Persistent audio state across page transitions (store audio play state in localStorage)
  if (!audio.paused) {
      localStorage.setItem('audio-playing', true);  // Store play state in localStorage
  } else {
      if (localStorage.getItem('audio-playing') === 'true') {
          audio.play();  // Resume playing if it was playing before
      }
  }
  audio.loop = true;
})();
