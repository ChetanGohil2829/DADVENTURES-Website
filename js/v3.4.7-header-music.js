
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // Theme glow for logo
  function applyThemeGlow(){
    var theme=localStorage.getItem('dad_theme')||'default';
    var map={'default':'#1fb6ff','gold-bronze':'#d4af37','green-orange':'#00ff7f','yellow-blue':'#ffd700','navy-orange':'#ff4500','maroon-peach':'#ff6f61','navy-teal':'#00ced1','black-orange':'#ff6600'};
    document.documentElement.style.setProperty('--theme-glow', map[theme]||map['default']);
  }
  applyThemeGlow(); window.addEventListener('storage',applyThemeGlow);

  // Remove both left/right small icons near clock if present
  qa('header .left-icon, header .right-icon, header .adjust-icon, header .drawer-icon').forEach(el=>el.remove());

  // Insert burger/folder button if not present (desktop & mobile)
  var header=q('header');
  if(header && !q('#nav-toggle',header)){
    var btn=document.createElement('button'); btn.id='nav-toggle'; btn.setAttribute('aria-label','Menu'); btn.textContent='☰';
    var logo=q('.logo, .brand, .logo-wrap', header) || header.firstChild;
    if(logo && logo.parentNode) logo.parentNode.insertBefore(btn, logo.nextSibling);
    else header.insertBefore(btn, header.firstChild);
    btn.addEventListener('click', ()=> header.classList.toggle('nav-open'));
  }

  // MUSIC: keep only one trailer bar; no floating duplicates
  try{
    qa('#music-controls, .floating-music, .music-float').forEach(el=>el.remove());

    var audio=q('#bg-music');
    if(!audio){ audio=document.createElement('audio'); audio.id='bg-music'; audio.src='/assets/audio/relaxing-piano.mp3'; audio.loop=true; audio.preload='auto'; document.body.appendChild(audio); }
    var savedTime=parseFloat(localStorage.getItem('dad_music_time')||'0');
    var savedVol=parseFloat(localStorage.getItem('dad_music_vol')||'0.6');
    if(!isNaN(savedTime)) audio.currentTime=savedTime;
    audio.volume=savedVol;

    audio.play().catch(()=>{ const enable=()=>{ audio.play().catch(()=>{}); window.removeEventListener('pointerdown',enable); }; window.addEventListener('pointerdown',enable,{once:true}); });

    function findBottom(selector){
      let scope = q('#trailer') || q('footer');
      if(scope){ let el=scope.querySelector(selector); if(el) return el; }
      let arr=qa(selector, document); return arr.length ? arr[arr.length-1] : null;
    }
    var playBtn=findBottom('button');
    if(playBtn){
      const setLabel=()=> playBtn.textContent = audio.paused ? 'Play' : 'Pause';
      setLabel();
      playBtn.addEventListener('click', ()=>{ if(audio.paused) audio.play(); else audio.pause(); setLabel(); });
      audio.addEventListener('play', setLabel); audio.addEventListener('pause', setLabel);
    }
    var vol=findBottom('input[type="range"]');
    if(vol){
      vol.value=String(savedVol);
      vol.addEventListener('input', ()=>{ audio.volume=parseFloat(vol.value||'0'); try{ localStorage.setItem('dad_music_vol', String(audio.volume)); }catch(e){} });
    }
    setInterval(()=>{ try{ localStorage.setItem('dad_music_time', String(audio.currentTime||0)); }catch(e){} }, 1200);
  }catch(e){ console.warn('music init failed', e); }
})();