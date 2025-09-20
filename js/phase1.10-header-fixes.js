
(function(){
  function q(s,root){ return (root||document).querySelector(s); }

  var header = q('header') || q('.site-header');
  if(header){
    var btn = q('#dad-hamburger', header);
    if(!btn){
      btn=document.createElement('button');
      btn.id='dad-hamburger';
      btn.innerHTML='☰';
      header.appendChild(btn);
      btn.addEventListener('click',()=> header.classList.toggle('nav-open'));
    }
  }

  // MUSIC
  try{
    var audio = q('#bg-music');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='bg-music';
      audio.src='/assets/audio/relaxing-piano.mp3';
      audio.loop=true; audio.preload='auto';
      document.body.appendChild(audio);
    }
    var savedTime=parseFloat(localStorage.getItem('dad_music_time')||'0');
    var savedVol=parseFloat(localStorage.getItem('dad_music_vol')||'0.6');
    if(!isNaN(savedTime)) audio.currentTime=savedTime;
    audio.volume=0;
    audio.play().catch(()=>{});

    function fadeTo(target,duration){
      var steps=20,i=0;
      var start=audio.volume,delta=(target-start)/steps;
      var iv=setInterval(function(){
        i++; audio.volume=Math.max(0,Math.min(1,start+delta*i));
        if(i>=steps) clearInterval(iv);
      },duration/steps);
    }

    function firstInteract(){
      fadeTo(savedVol,800);
      document.removeEventListener('click',firstInteract);
      document.removeEventListener('touchstart',firstInteract);
    }
    document.addEventListener('click',firstInteract,{once:true});
    document.addEventListener('touchstart',firstInteract,{once:true});

    setInterval(function(){
      try{
        localStorage.setItem('dad_music_time',String(audio.currentTime||0));
        localStorage.setItem('dad_music_vol',String(audio.volume||0));
      }catch(e){}
    },2000);
  }catch(e){ console.warn('music init failed',e); }

  // THEME-aware logo glow
  function applyThemeGlow(){
    var theme = localStorage.getItem('dad_theme') || 'default';
    var glow = '#1fb6ff';
    if(theme==='gold-bronze') glow='#d4af37';
    if(theme==='green-orange') glow='#00ff7f';
    if(theme==='navy-teal') glow='#00ced1';
    if(theme==='maroon-peach') glow='#ff6f61';
    if(theme==='black-orange') glow='#ff6600';
    document.documentElement.style.setProperty('--theme-glow', glow);
  }
  applyThemeGlow();
  window.addEventListener('storage', applyThemeGlow);
})();