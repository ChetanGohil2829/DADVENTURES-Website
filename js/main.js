
// Global music controls
(function(){
  const audio = document.getElementById('globalMusic');
  const playBtns = document.querySelectorAll('[data-audio=play]');
  const volSliders = document.querySelectorAll('[data-audio=vol]');
  if(!audio){ return; }
  playBtns.forEach(btn=>btn.addEventListener('click', ()=>{
    if(audio.paused){ audio.muted=false; audio.play().catch(()=>{}); btn.textContent='Pause'; }
    else { audio.pause(); btn.textContent='Play'; }
    document.querySelectorAll('[data-audio=play]').forEach(b=> b.textContent = audio.paused ? 'Play' : 'Pause');
  }));
  volSliders.forEach(sl=>{
    sl.addEventListener('input', ()=>{ audio.volume = sl.value; });
    // sync all sliders together
    sl.addEventListener('input', ()=> document.querySelectorAll('[data-audio=vol]').forEach(s=>{ if(s!==sl) s.value = sl.value; }));
  });
})();
