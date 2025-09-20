
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // Nav order
  var header=q('header'); var nav=header?q('nav',header):null;
  if(nav){
    qa('a',nav).forEach(a=>{
      var t=(a.textContent||'').trim().toLowerCase();
      if(t.includes('control panel')||t.includes('join us')) a.remove();
    });
    var desired=[
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
    var map={}; qa('a',nav).forEach(a=>{ map[(a.textContent||'').trim().toLowerCase()]=a; });
    nav.innerHTML='';
    desired.forEach(([label,href])=>{
      var key=label.toLowerCase();
      var a=map[key];
      if(!a){ a=document.createElement('a'); a.textContent=label; a.href=href; }
      nav.appendChild(a);
    });
  }

  // Music
  try{
    var audio=q('#bg-music');
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
    audio.volume=0; audio.play().catch(()=>{});

    function fadeTo(target,duration){
      var steps=20,i=0,start=audio.volume,delta=(target-start)/steps;
      var iv=setInterval(()=>{ i++; audio.volume=Math.max(0,Math.min(1,start+delta*i)); if(i>=steps) clearInterval(iv); },duration/steps);
    }
    function firstInteract(){ fadeTo(savedVol,800); document.removeEventListener('click',firstInteract); document.removeEventListener('touchstart',firstInteract); }
    document.addEventListener('click',firstInteract,{once:true});
    document.addEventListener('touchstart',firstInteract,{once:true});

    setInterval(()=>{
      try{
        localStorage.setItem('dad_music_time',String(audio.currentTime||0));
        localStorage.setItem('dad_music_vol',String(audio.volume||0));
      }catch(e){}
    },2000);
  }catch(e){}

  // Theme glow + favicon
  function applyTheme(){
    var theme=localStorage.getItem('dad_theme')||'default';
    var glow='#1fb6ff'; var fav='favicon-blue.png';
    if(theme==='gold-bronze'){glow='#d4af37'; fav='favicon-gold.png';}
    if(theme==='green-orange'){glow='#00ff7f'; fav='favicon-green.png';}
    if(theme==='yellow-blue'){glow='#ffd700'; fav='favicon-yellow.png';}
    if(theme==='navy-orange'){glow='#ff4500'; fav='favicon-navyorange.png';}
    if(theme==='maroon-peach'){glow='#ff6f61'; fav='favicon-maroon.png';}
    if(theme==='navy-teal'){glow='#00ced1'; fav='favicon-navyteal.png';}
    if(theme==='black-orange'){glow='#ff6600'; fav='favicon-blackorange.png';}
    document.documentElement.style.setProperty('--theme-glow',glow);
    var link=q("link[rel~='icon']")||document.createElement('link'); link.rel='icon'; link.href='/assets/icons/'+fav; document.head.appendChild(link);
  }
  applyTheme(); window.addEventListener('storage',applyTheme);
})();