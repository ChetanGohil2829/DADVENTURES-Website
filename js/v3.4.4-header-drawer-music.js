
// v3.4.4 header, drawer & music patch
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // Remove stray \1 or /1 from header HTML
  qa('header').forEach(h=>{
    h.innerHTML = h.innerHTML.replaceAll('\\1','').replaceAll('/1','');
  });

  // Ensure unwanted tabs are removed and order is correct
  const header = q('header'); const nav = header ? q('nav', header) : null;
  if(nav){
    qa('a', nav).forEach(a=>{
      const t=(a.textContent||'').toLowerCase();
      if(t.includes('control panel') || t.includes('join us')) a.remove();
    });
    const desired = [
      ['Home','/'],
      ['About','/about.html'],
      ['Events','/events.html'],
      ['Calendar','/calendar.html'],
      ['Blogs','/blogs.html'],
      ['Shop','/shop.html'],
      ['Donate','/donate.html'],
      ['Contact Us','/contact.html'],
      ['Sign In','/signin.html']
    ];
    const have={};
    qa('a',nav).forEach(a=> have[(a.textContent||'').trim().toLowerCase()]=a);
    nav.innerHTML='';
    desired.forEach(([label,href])=>{
      const key=label.toLowerCase();
      let a=have[key];
      if(!a){ a=document.createElement('a'); a.textContent=label; a.href=href; }
      nav.appendChild(a);
    });
  }

  
  // Hamburger Button functionality for mobile navigation
  const btn = document.querySelector('#header-drawer-toggle');
  // Hamburger Button functionality for mobile navigation
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
  }
  // Ensure the mobile navigation closes when any link is clicked
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          mobileNav.classList.remove('open');  // Close the menu after a link is clicked
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

  const clock = q('#dad-clock, .clock, .header-clock, header time') || q('header');
  if(clock && !q('#header-drawer-toggle')){
    const btn = document.createElement('button');
    btn.id='header-drawer-toggle';
    btn.setAttribute('aria-label','Toggle tools');
    btn.textContent='⇕';
    clock.parentNode.insertBefore(btn, clock.nextSibling);
    let drawer = q('#header-drawer');
    if(!drawer){
      drawer = document.createElement('div');
      drawer.id='header-drawer';
      drawer.innerHTML='<div class="drawer-inner">Tools panel</div>';
      header.after(drawer);
    }
    btn.addEventListener('click', ()=>{
      drawer.classList.toggle('open');
    });
  }

  // MUSIC – robust init, autoplay on load (muted if blocked), play/pause + slider wiring, continuity
  try{
    let audio = q('#bg-music');
    if(!audio){
      audio = document.createElement('audio');
      audio.id='bg-music';
      audio.src='/assets/audio/relaxing-piano.mp3';
      
  audio.loop=true;
  // Ensure the music doesn't restart when returning to home or switching tabs
  if (!audio.paused) {
    audio.play();
  }
 audio.preload='auto';
      document.body.appendChild(audio);
    }

    // Map trailer controls if present
    function findMusicUI(){
      // Look for the bottom bar
      const containers = qa('#trailer, .trailer, footer, .footer, body');
      let button=null, slider=null;
      qa('button', document).forEach(b=>{
        const t=(b.textContent||'').trim().toLowerCase();
        if(!button && (t==='play' || t==='pause')) button=b;
      });
      if(!button){
        // create a floating minimal control if none exists
        const ctrl=document.createElement('div');
        ctrl.style.position='fixed'; ctrl.style.right='10px'; ctrl.style.bottom='10px';
        ctrl.style.background='rgba(0,0,0,.6)'; ctrl.style.padding='6px 10px';
        ctrl.style.borderRadius='8px'; ctrl.style.zIndex='9999';
        ctrl.innerHTML='<button id="music-play">Play</button> <input id="music-vol" type="range" min="0" max="1" step="0.01" value="0.6" style="vertical-align:middle;width:120px;">';
        document.body.appendChild(ctrl);
        button=ctrl.querySelector('#music-play');
        slider=ctrl.querySelector('#music-vol');
      } else {
        // try to locate a sibling range for volume
        let input = document.querySelector('input[type="range"]');
        if(input) slider=input;
      }
      return {button, slider};
    }

    const ui = findMusicUI();

    // Restore state
    const savedTime = parseFloat(localStorage.getItem('dad_music_time')||'0');
    const savedVol  = parseFloat(localStorage.getItem('dad_music_vol')||'0.6');
    if(!isNaN(savedTime)) audio.currentTime = savedTime;
    audio.volume = savedVol;

    // Try immediate autoplay
    audio.play().then(()=>{
      // started successfully
      if(ui.button) ui.button.textContent='Pause';
    }).catch(()=>{
      // Autoplay blocked: start muted and enable on first gesture
      audio.volume = 0;
      audio.play().catch(()=>{});
      const enable = ()=>{
        audio.volume = savedVol;
        if(ui.button) ui.button.textContent='Pause';
        window.removeEventListener('pointerdown', enable);
      };
      window.addEventListener('pointerdown', enable, {once:true});
    });

    // Wire controls
    if(ui.button){
      ui.button.addEventListener('click', ()=>{
        if(audio.paused){ audio.play(); ui.button.textContent='Pause'; }
        else { audio.pause(); ui.button.textContent='Play'; }
      });
    }
    if(ui.slider){
      ui.slider.value = String(savedVol);
      ui.slider.addEventListener('input', ()=>{
        audio.volume = parseFloat(ui.slider.value||'0');
        try{ localStorage.setItem('dad_music_vol', String(audio.volume)); }catch(e){}
      });
    }

    // Persist time every second
    setInterval(()=>{
      try{ localStorage.setItem('dad_music_time', String(audio.currentTime||0)); }catch(e){}
    }, 1000);

  }catch(e){ console.warn('music init failed', e); }

  // Theme glow application (kept)
  (function(){
    const theme = localStorage.getItem('dad_theme')||'default';
    const map = {
      'default':'#1fb6ff',
      'gold-bronze':'#d4af37',
      'green-orange':'#00ff7f',
      'yellow-blue':'#ffd700',
      'navy-orange':'#ff4500',
      'maroon-peach':'#ff6f61',
      'navy-teal':'#00ced1',
      'black-orange':'#ff6600'
    };
    const glow = map[theme] || map['default'];
    document.documentElement.style.setProperty('--theme-glow', glow);
  })();

})();