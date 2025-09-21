
// Ensure autoplay for music
document.addEventListener('DOMContentLoaded', function() {
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    audio.play();
  });
});
