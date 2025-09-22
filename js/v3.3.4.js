
// v3.3.4 global
(function(){
  // clock
  function fmt(d){const p=n=>String(n).padStart(2,'0');return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`}
  function tick(){ const el=document.querySelector('.clock'); if(el) el.textContent=fmt(new Date()); }
  setInterval(tick,1000); tick();
  // search teepee
  document.querySelectorAll('input[type="search"]').forEach(i=>i.classList.add('with-icon'));
  const sb=document.querySelector('.searchbar'); if(sb){ sb.classList.add('with-icon'); }
  // strip stray leading text like "\1"
  const n=document.body.firstChild; if(n && n.nodeType===3 && /\\1/.test(n.textContent)) n.textContent="";
  // remove header audio controls
  document.querySelectorAll('.volume-controls, header input[type="range"]').forEach(n=>n.remove());
  // ensure footer links/copyright centered
  const f=document.querySelector('footer .inner'); if(f){
    // Add links row if missing
    if(!f.querySelector('.footer-links')){
      const div=document.createElement('div'); div.className='footer-links';
      div.innerHTML='<a href="https://www.tiktok.com/" target="_blank" rel="noopener">TikTok</a> · <a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a>';
      f.appendChild(div);
    }
    // Move copyright to bottom
    let copy=f.querySelector('.footer-copy');
    if(!copy){
      const t=[...f.childNodes].find(n=>n.nodeType===3 && /Copyright/i.test(n.textContent));
      if(t){ copy=document.createElement('div'); copy.className='footer-copy'; copy.textContent=t.textContent.trim(); t.remove(); }
    }
    if(copy){ f.appendChild(copy); }
  }
  // inject clock container if missing
  const hdr=document.querySelector('header .inner'); if(hdr && !document.querySelector('.clock')){
    const r=document.createElement('div'); r.className='header-right'; r.innerHTML='<span class="clock"></span>'; hdr.appendChild(r);
  }
  // bottom audio
  function ensureAudio(){
    if(document.getElementById('audioControls')) return;
    const wrap=document.createElement('div');
    wrap.id='audioControls'; wrap.innerHTML='<button id="acToggle">Pause</button><div class="spacer"></div><input id="acVol" type="range" min="0" max="1" step="0.01" value="0.4">';
    document.body.appendChild(wrap);
    const a=document.getElementById('siteAudio') || (function(){const el=document.createElement('audio'); el.id='siteAudio'; el.loop=true; el.preload="auto"; document.body.appendChild(el); return el;})();
    /* v3.4.17 MP3+WAV support */ 
    (function(){
      try{ a.setAttribute('playsinline',''); }catch(e){}
      const mp3='audio/relaxing-piano-ambient.mp3';
      const wav='audio/relaxing-piano-ambient.wav';
      const pick = (a.canPlayType && a.canPlayType('audio/mpeg')) ? mp3 : wav;
      a.src=pick;
      a.addEventListener('error', function _fb(){
        if(a.src && a.src.indexOf('.mp3')!==-1){ a.src=wav; a.load(); a.play().catch(()=>{}); }
        a.removeEventListener('error', _fb);
      });
    })();
    a.volume=.4; a.muted=false; a.play().catch(()=>{});
    const btn=document.getElementById('acToggle'), vol=document.getElementById('acVol');
    btn.addEventListener('click',()=>{ if(a.paused){ a.play(); btn.textContent='Pause'; } else { a.pause(); btn.textContent='Play'; } });
    vol.addEventListener('input',()=>{ a.volume=+vol.value; });
  }
  document.addEventListener('DOMContentLoaded', ensureAudio);
})();

// Reserve space for audio bar so it doesn't cover footer
(function(){
  function pad(){
    const ac=document.getElementById('audioControls');
    if(!ac) return;
    const h=ac.getBoundingClientRect().height||60;
    document.body.style.paddingBottom = (h+24)+'px';
  }
  const ro=new ResizeObserver(pad); 
  window.addEventListener('load',()=>{ const ac=document.getElementById('audioControls'); if(ac){ ro.observe(ac); pad(); } });
})();

// v3.3.9 favicon swap by theme
(function(){
  function hrefFor(theme){
    switch((theme||'').toLowerCase()){
      case 'gold': case 'bronze': return 'images/favicon-goldbronze.svg';
      case 'green': case 'orange': return 'images/favicon-greenorange.svg';
      default: return 'images/favicon-bluepink.svg';
    }
  }
  function applyFav(theme){
    var link=document.querySelector('link#favicon');
    if(!link){
      link=document.createElement('link');
      link.id='favicon'; link.rel='icon'; link.type='image/svg+xml';
      document.head.appendChild(link);
    }
    link.href=hrefFor(theme);
  }
  // apply on load and when theme changes (if admin stores it)
  window.addEventListener('DOMContentLoaded', function(){
    var theme = localStorage.getItem('theme');
    applyFav(theme);
    window.addEventListener('storage', function(e){
      if(e.key==='theme'){ applyFav(e.newValue); }
    });
  });
  // expose setter
  window._setThemeFavicon = applyFav;
})();

// v3.4.2 header & audio enhancements
(function(){
  const HPOS='header.pos'; const APOS='audio.pos'; const SKEY='music.state';
  function applyHeaderPos(){ document.documentElement.setAttribute('data-header-pos', localStorage.getItem(HPOS)||'top'); }
  function toggleHeaderPos(){ localStorage.setItem(HPOS, (localStorage.getItem(HPOS)||'top')==='top'?'bottom':'top'); applyHeaderPos(); }
  function applyAudioPos(){ document.documentElement.setAttribute('data-audio-pos', localStorage.getItem(APOS)||'bottom'); }
  function toggleAudioPos(){ localStorage.setItem(APOS, (localStorage.getItem(APOS)||'bottom')==='bottom'?'top':'bottom'); applyAudioPos(); padForBar(); }
  function padForBar(){
    const ac=document.getElementById('audioControls'); if(!ac) return;
    const h=ac.getBoundingClientRect().height||60, pos=(localStorage.getItem(APOS)||'bottom');
    document.body.style.paddingBottom = pos==='bottom' ? (h+16)+'px' : '';
    document.body.style.paddingTop    = pos==='top'    ? (h+16)+'px' : '';
  }
  function ensureHeaderButtons(){
    const right=document.querySelector('header .header-right'); if(!right) return;
    // v3.4.17: removed extra toggle button near clock, keep clock intact
}
  }
  function ensureAudio(){
    if(!document.getElementById('audioControls')){
      const bar=document.createElement('div');
      bar.id='audioControls';
      bar.innerHTML='<button id="acToggle">Pause</button><input id="acVol" type="range" min="0" max="1" step="0.01" value="0.4"><button id="acPos" title="Move player top/bottom">↕</button>';
      document.body.appendChild(bar);
    }
    let a=document.getElementById('siteAudio');
    if(!a){ a=document.createElement('audio'); a.id='siteAudio'; a.loop=true; a.preload='auto'; /* v3.4.17 MP3+WAV support */ 
    (function(){
      try{ a.setAttribute('playsinline',''); }catch(e){}
      const mp3='audio/relaxing-piano-ambient.mp3';
      const wav='audio/relaxing-piano-ambient.wav';
      const pick = (a.canPlayType && a.canPlayType('audio/mpeg')) ? mp3 : wav;
      a.src=pick;
      a.addEventListener('error', function _fb(){
        if(a.src && a.src.indexOf('.mp3')!==-1){ a.src=wav; a.load(); a.play().catch(()=>{}); }
        a.removeEventListener('error', _fb);
      });
    })(); document.body.appendChild(a); }
    const state=JSON.parse(localStorage.getItem(SKEY)||'{}');
    if(typeof state.volume==='number') a.volume=state.volume;
    const wantPlay = state.playing!==false;
    const savedWhen = state.ts||0;
    const savedTime = state.time||0;
    function resumeAtMetadata(){
      let target = savedTime||0;
      if(wantPlay && savedWhen){ const delta=(Date.now()-savedWhen)/1000; target=(savedTime+delta) % (a.duration||3600); }
      try{ a.currentTime=target; }catch(e){}
    }
    a.addEventListener('loadedmetadata', resumeAtMetadata, {once:true});
    // nav click intent for autoplay
    document.querySelectorAll('a[href$=".html"]').forEach(x=>x.addEventListener('click',()=>{ try{ localStorage.setItem('music.intent','1') }catch(e){} },{capture:true}));
    function first(){ a.muted=false; if(wantPlay){ a.play().catch(()=>{}) } document.removeEventListener('click', first) }
    document.addEventListener('click', first, {once:true});
    document.addEventListener('pointerdown', first, {once:true});
    document.addEventListener('touchstart', first, {once:true});
    if(wantPlay) a.play().catch(()=>{});
    const btn=document.getElementById('acToggle'); const vol=document.getElementById('acVol'); const pos=document.getElementById('acPos');
    if(btn){ btn.textContent=a.paused?'Play':'Pause'; btn.addEventListener('click',()=>{ if(a.paused){ a.play(); btn.textContent='Pause' } else { a.pause(); btn.textContent='Play' } save(); }); }
    if(vol){ vol.value=(typeof state.volume==='number')? state.volume : a.volume; vol.addEventListener('input',()=>{ a.volume=+vol.value; save(); }); vol.addEventListener('change',()=>{ a.volume=+vol.value; save(); }); vol.addEventListener('touchstart',()=>{ a.muted=false; }); vol.addEventListener('pointerdown',()=>{ a.muted=false; }); }
    if(pos){ pos.addEventListener('click', toggleAudioPos); }
    function save(){ try{ localStorage.setItem(SKEY, JSON.stringify({volume:a.volume, playing:!a.paused, time:a.currentTime||0, ts:Date.now()})) }catch(e){} }
    setInterval(save, 1200); window.addEventListener('beforeunload', save);
    applyAudioPos(); padForBar();
  }
  function boot(){
    applyHeaderPos();
    ensureHeaderButtons();
    ensureAudio();
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
// v3.4.2 autoplay on next page if user clicked nav
(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    try{
      if(localStorage.getItem('music.intent')==='1'){
        const a=document.getElementById('siteAudio'); if(a){ a.muted=false; a.play().catch(()=>{}) }
      }
      localStorage.removeItem('music.intent');
    }catch(e){}
  });
})();
