
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // THEME glow for logo
  function applyThemeGlow(){
    var theme=localStorage.getItem('dad_theme')||'default';
    var glow={'default':'#1fb6ff','gold-bronze':'#d4af37','green-orange':'#00ff7f','yellow-blue':'#ffd700','navy-orange':'#ff4500','maroon-peach':'#ff6f61','navy-teal':'#00ced1','black-orange':'#ff6600'}[theme] || '#1fb6ff';
    document.documentElement.style.setProperty('--theme-glow', glow);
  }
  applyThemeGlow(); window.addEventListener('storage', applyThemeGlow);

  // Remove left-side icon near clock if present
  qa('header .left-icon, header .adjust-icon').forEach(el=>el.remove());

  // MOBILE BURGER
  var header = q('header');
  if(header && !q('#nav-toggle', header)){
    var burger=document.createElement('button');
    burger.id='nav-toggle'; burger.setAttribute('aria-label','Menu'); burger.textContent='☰';
    // insert burger just after logo
    var logo = q('.logo, header .logo-wrap, header .brand', header) || header.firstChild;
    if(logo && logo.parentNode){
      logo.parentNode.insertBefore(burger, logo.nextSibling);
    }else{
      header.insertBefore(burger, header.firstChild);
    }
    burger.addEventListener('click', ()=> header.classList.toggle('nav-open'));
  }

  // MUSIC: autoplay + continuous + wire to existing trailer controls (no extra UI)
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

    // Try autoplay immediately; if blocked, enable on first gesture anywhere
    audio.play().catch(()=>{
      const unblock=()=>{ audio.play().catch(()=>{}); window.removeEventListener('pointerdown',unblock); };
      window.addEventListener('pointerdown',unblock,{once:true});
    });

    // Wire existing bottom controls if present
    function findPlayButton(){
      // prefer trailer/footer buttons with text Play/Pause
      const buttons = qa('footer button, #trailer button, .trailer button, button');
      for(const b of buttons){
        const t=(b.textContent||'').trim().toLowerCase();
        if(t==='play' || t==='pause') return b;
      }
      return null;
    }
    function findSlider(){
      // prefer a volume-looking range near the bottom
      const inputs = qa('footer input[type="range"], #trailer input[type="range"], .trailer input[type="range"], input[type="range"]');
      return inputs.length ? inputs[inputs.length-1] : null;
    }
    var playBtn=findPlayButton();
    var vol=findSlider();

    if(playBtn){
      // Sync initial label
      playBtn.textContent = audio.paused ? 'Play' : 'Pause';
      playBtn.addEventListener('click', ()=>{
        if(audio.paused){ audio.play(); playBtn.textContent='Pause'; }
        else { audio.pause(); playBtn.textContent='Play'; }
      });
    }
    if(vol){
      vol.value = String(savedVol);
      vol.addEventListener('input', ()=>{
        audio.volume = parseFloat(vol.value||'0');
        try{ localStorage.setItem('dad_music_vol', String(audio.volume)); }catch(e){}
      });
    }
    // Persist playback position
    setInterval(()=>{
      try{ localStorage.setItem('dad_music_time', String(audio.currentTime||0)); }catch(e){}
    }, 1200);
  }catch(e){ console.warn('music init failed', e); }

})();