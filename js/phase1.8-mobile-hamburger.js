
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // Remove any stray "/1" or "\1"
  qa('header').forEach(h=>{ if(h) h.innerHTML = h.innerHTML.replaceAll('/1','').replaceAll('\\1',''); });

  // ===== NAV cleanup & order =====
  var header = q('header') || q('.site-header');
  var nav = header ? (q('nav', header) || q('.nav', header)) : null;
  if(nav){
    // Remove unwanted tabs
    qa('a', nav).forEach(a=>{
      var t=(a.textContent||'').trim().toLowerCase();
      if(t.includes('join us') || t.includes('control panel')) a.remove();
    });

    // Desired order (Calendar between Events and Shop)
    var desired = [
      ['Home','/'],
      ['About','/about.html'],
      ['Events','/events.html'],
      ['Calendar','/calendar.html'],
      ['Shop','/shop.html'],
      ['Blogs','/blogs.html'],
      ['Donate','/donate.html'],
      ['Contact Us','/contact.html'],
      ['Sign In','/signin.html']
    ];

    // Map existing links by label (case-insensitive)
    var linksByText = {};
    qa('a', nav).forEach(a=>{ linksByText[(a.textContent||'').trim().toLowerCase()] = a; });

    // Clear nav and rebuild in desired order (create Calendar if missing)
    nav.innerHTML='';
    desired.forEach(([label,href])=>{
      var key=label.toLowerCase();
      var a = linksByText[key];
      if(!a){
        a=document.createElement('a'); a.textContent=label; a.href=href;
      } else {
        a.href = a.href || href;
      }
      nav.appendChild(a);
    });
  }

  // ===== Hamburger toggle on mobile =====
  if(header){
    var existingBtn = q('#dad-hamburger', header);
    if(!existingBtn){
      var btn = document.createElement('button');
      btn.id='dad-hamburger';
      btn.setAttribute('aria-label','Open navigation');
      btn.innerHTML='☰';
      header.appendChild(btn);
      btn.addEventListener('click', function(){
        header.classList.toggle('nav-open');
      });
    }
  }

  // ===== MUSIC: continuous autoplay across pages =====
  try{
    var audio = q('#bg-music');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='bg-music';
      audio.src='/assets/audio/relaxing-piano.mp3';
      audio.loop=true; audio.preload='auto';
      document.body.appendChild(audio);
    }

    // Restore state
    var savedTime = parseFloat(localStorage.getItem('dad_music_time')||'0');
    var savedVol = parseFloat(localStorage.getItem('dad_music_vol')||'0.6');

    if(!isNaN(savedTime)) audio.currentTime = savedTime;
    audio.volume = 0; // start muted
    var tryPlay = audio.play();
    if(tryPlay && tryPlay.catch){ tryPlay.catch(()=>{}); }

    function fadeTo(target, duration){
      var steps=20, i=0;
      var start=audio.volume, delta=(target - start)/steps;
      var iv=setInterval(function(){
        i++; audio.volume = Math.max(0, Math.min(1, start + delta*i));
        if(i>=steps) clearInterval(iv);
      }, duration/steps);
    }

    // Unmute & fade on first interaction
    function firstInteract(){
      fadeTo(savedVol, 800);
      document.removeEventListener('click', firstInteract);
      document.removeEventListener('touchstart', firstInteract);
    }
    document.addEventListener('click', firstInteract, {once:true});
    document.addEventListener('touchstart', firstInteract, {once:true});

    // Save progress every 2s
    setInterval(function(){
      try{
        localStorage.setItem('dad_music_time', String(audio.currentTime||0));
        localStorage.setItem('dad_music_vol', String(audio.volume||0));
      }catch(e){}
    }, 2000);

    window.addEventListener('beforeunload', function(){
      try{
        localStorage.setItem('dad_music_time', String(audio.currentTime||0));
        localStorage.setItem('dad_music_vol', String(audio.volume||0));
      }catch(e){}
    });
  }catch(e){ console.warn('music init failed', e); }

  // Remove any legacy trailer music icon/panel if still present
  qa('#dad-music-icon, #dad-music-panel').forEach(el => el.remove());
})();