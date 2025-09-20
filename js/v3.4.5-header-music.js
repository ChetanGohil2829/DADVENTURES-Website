
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // Theme-aware logo glow
  function applyTheme(){
    var theme=localStorage.getItem('dad_theme')||'default';
    var glow='#1fb6ff';
    if(theme==='gold-bronze') glow='#d4af37';
    if(theme==='green-orange') glow='#00ff7f';
    if(theme==='yellow-blue') glow='#ffd700';
    if(theme==='navy-orange') glow='#ff4500';
    if(theme==='maroon-peach') glow='#ff6f61';
    if(theme==='navy-teal') glow='#00ced1';
    if(theme==='black-orange') glow='#ff6600';
    document.documentElement.style.setProperty('--theme-glow',glow);
  }
  applyTheme(); window.addEventListener('storage',applyTheme);

  // Remove left-side arrow icon near clock
  qa('.left-icon, .adjust-icon').forEach(el=>el.remove());

  // MUSIC continuous autoplay with trailer bar controls
  try{
    var audio=q('#bg-music');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='bg-music';
      audio.src='/assets/audio/relaxing-piano.mp3';
      audio.loop=true; audio.preload='auto';
      document.body.appendChild(audio);
    }

    // Restore state
    var savedTime=parseFloat(localStorage.getItem('dad_music_time')||'0');
    var savedVol=parseFloat(localStorage.getItem('dad_music_vol')||'0.6');
    if(!isNaN(savedTime)) audio.currentTime=savedTime;
    audio.volume=savedVol;

    // Try autoplay immediately
    audio.play().catch(()=>{
      // fallback for mobile/autoplay block
      const enable=()=>{ audio.play(); window.removeEventListener('pointerdown',enable); };
      window.addEventListener('pointerdown',enable,{once:true});
    });

    // Trailer bar controls
    var trailer=q('#trailer')||q('footer')||document.body;
    var ctrl=q('#music-controls');
    if(!ctrl){
      ctrl=document.createElement('div');
      ctrl.id='music-controls';
      ctrl.innerHTML='<button id="music-toggle">Pause</button> <input id="music-vol" type="range" min="0" max="1" step="0.01" value="'+savedVol+'" style="width:120px;">';
      trailer.appendChild(ctrl);
    }
    var btn=q('#music-toggle'); var slider=q('#music-vol');
    btn.addEventListener('click',()=>{
      if(audio.paused){ audio.play(); btn.textContent='Pause'; }
      else { audio.pause(); btn.textContent='Play'; }
    });
    slider.addEventListener('input',()=>{
      audio.volume=parseFloat(slider.value||'0'); localStorage.setItem('dad_music_vol',String(audio.volume));
    });

    // Save playback position
    setInterval(()=>{
      try{ localStorage.setItem('dad_music_time',String(audio.currentTime||0)); }catch(e){}
    },1500);
  }catch(e){ console.warn('music init failed',e); }
})();