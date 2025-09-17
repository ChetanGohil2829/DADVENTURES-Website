document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const playPause = document.getElementById('playPause');
  const volume = document.getElementById('volume');

  // Music controls
  playPause.addEventListener('click', () => {
    if (music.paused) { music.play(); playPause.textContent = 'Pause'; }
    else { music.pause(); playPause.textContent = 'Play'; }
  });
  volume.addEventListener('input', e => { music.volume = e.target.value; });

  // Welcome animation
  const msg = "Welcome to Dadventures";
  let i = 0;
  function typeWriter() {
    if (i < msg.length) {
      document.getElementById('welcome-message').innerHTML += msg.charAt(i);
      i++;
      setTimeout(typeWriter, 200); // slowed down
    }
  }
  typeWriter();

  // Skip intro after 30s
  setTimeout(() => { document.getElementById('welcome').style.display = 'none'; }, 30000);
  document.getElementById('skip-intro').addEventListener('click', () => {
    document.getElementById('welcome').style.display = 'none';
  });

  // Date + time
  function updateDateTime() {
    document.getElementById('date-time').textContent = new Date().toLocaleString();
  }
  setInterval(updateDateTime, 1000); updateDateTime();

  // Search
  document.getElementById('search').addEventListener('input', e => {
    console.log("Search query:", e.target.value);
  });
});
