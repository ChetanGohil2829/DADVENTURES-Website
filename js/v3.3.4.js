
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
    a.src = 'audio/relaxing-piano-ambient.wav';
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

(function(){
  const THEMES=[
    ['bluepinkpurple','#34b4ff'],
    ['goldbronze','#caa74b'],
    ['greenorange','#31d27f'],
    ['yellowblue','#f4d13f'],
    ['navyorange','#ff7a1a'],
    ['maroonpeach','#ffbd9b'],
    ['navyteal','#16c2b4'],
    ['blackorange','#ff7a1a']
  ];
  function setFavicon(key){
    let link=document.getElementById('favicon');
    if(!link){ link=document.createElement('link'); link.id='favicon'; link.rel='icon'; link.type='image/svg+xml'; document.head.appendChild(link); }
    link.href='images/favicon-'+key+'.svg';
  }
  function setTheme(key, accent){
    localStorage.setItem('theme.key', key);
    localStorage.setItem('theme.accent', accent);
    document.documentElement.style.setProperty('--accent', accent);
    setFavicon(key);
    const img=document.querySelector('header .logo img');
    if(img){ img.style.filter='drop-shadow(0 0 8px '+accent+'66)'; }
  }
  function cycleTheme(){
    const cur=localStorage.getItem('theme.key')||THEMES[0][0];
    const idx=Math.max(0, THEMES.findIndex(t=>t[0]===cur));
    const next=THEMES[(idx+1)%THEMES.length];
    setTheme(next[0], next[1]);
  }
  function applyStored(){
    const k=localStorage.getItem('theme.key')||THEMES[0][0];
    const a=localStorage.getItem('theme.accent')||THEMES[0][1];
    setTheme(k,a);
  }
  function setHeaderPos(pos){ document.documentElement.setAttribute('data-header-pos', pos); localStorage.setItem('header.pos',pos); }
  function toggleHeaderPos(){ setHeaderPos((localStorage.getItem('header.pos')||'top')==='top'?'bottom':'top'); }
  function install(){
    const wrap=document.querySelector('header .header-right'); if(!wrap) return;
    const pos=document.createElement('button'); pos.className='header-btn'; pos.title='Move header top/bottom'; pos.textContent='↕'; pos.addEventListener('click', toggleHeaderPos);
    const pal=document.createElement('button'); pal.className='header-btn'; pal.title='Change theme'; pal.textContent='🎨'; pal.addEventListener('click', cycleTheme);
    wrap.prepend(pal); wrap.prepend(pos);
  }
  document.addEventListener('DOMContentLoaded', function(){
    applyStored();
    setHeaderPos(localStorage.getItem('header.pos')||'top');
    install();
  });
})();
// v3.4.1 persistent audio + movable player
(function(){
  const SKEY='music.state';    // {volume, playing, time, ts, src}
  const POS='audio.pos';       // 'top' | 'bottom'
  function get(k){ try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return{}} }
  function set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function getPos(){ return localStorage.getItem(POS)||'bottom'; }
  function applyPos(){ document.documentElement.setAttribute('data-audio-pos', getPos()); }
  function togglePos(){ const next=getPos()==='bottom'?'top':'bottom'; localStorage.setItem(POS,next); applyPos(); padForBar(); }
  function padForBar(){
    const ac=document.getElementById('audioControls'); if(!ac) return;
    const h=ac.getBoundingClientRect().height||60, pos=getPos();
    document.body.style.paddingBottom = pos==='bottom'? (h+16)+'px' : '';
    document.body.style.paddingTop    = pos==='top'   ? (h+16)+'px' : '';
  }
  function ensureControls(){
    if(document.getElementById('audioControls')) return;
    const bar=document.createElement('div'); bar.id='audioControls';
    bar.innerHTML='<button id="acToggle">Pause</button><input id="acVol" type="range" min="0" max="1" step="0.01" value="0.4"><button id="acPos" title="Move player top/bottom">↕</button>';
    document.body.appendChild(bar);
  }
  function init(){
    applyPos();
    ensureControls();
    let a=document.getElementById('siteAudio');
    if(!a){
      a=document.createElement('audio'); a.id='siteAudio'; a.loop=true; a.preload='auto';
      a.src='audio/ambient_loop.wav';
      a.addEventListener('error',()=>{ if(a.src.indexOf('relaxing')<0) a.src='audio/relaxing-piano-ambient.wav'; else a.src='audio_loop.wav'; a.load(); });
      document.body.appendChild(a);
    }
    const state=get(SKEY);
    if(typeof state.volume==='number') a.volume=state.volume;
    const wantPlay = state.playing!==false; // default true
    const savedWhen = state.ts||0;
    const savedTime = state.time||0;
    function resumeAtMetadata(){
      let target = savedTime||0;
      if(wantPlay && savedWhen){
        const delta=(Date.now()-savedWhen)/1000;
        target = (savedTime + delta) % (a.duration||3600);
      }
      try{ a.currentTime = target; }catch(e){}
    }
    a.addEventListener('loadedmetadata', resumeAtMetadata, {once:true});
    // Autoplay policy: unmute & play on first user interaction
    function firstInteract(){ a.muted=false; if(wantPlay) a.play().catch(()=>{}); document.removeEventListener('click', firstInteract); }
    document.addEventListener('click', firstInteract, {once:true});
    if(wantPlay){ a.play().catch(()=>{}); } else { a.pause(); }
    // Wire controls
    const btn=document.getElementById('acToggle'); const vol=document.getElementById('acVol'); const pos=document.getElementById('acPos');
    if(btn){ btn.textContent=a.paused?'Play':'Pause'; btn.addEventListener('click',()=>{ if(a.paused){ a.play(); btn.textContent='Pause'; } else { a.pause(); btn.textContent='Play'; } save(); }); }
    if(vol){ vol.value = (typeof state.volume==='number')? state.volume : a.volume; vol.addEventListener('input',()=>{ a.volume=+vol.value; save(); }); }
    if(pos){ pos.addEventListener('click', togglePos); }
    // Save periodically and on unload
    function save(){ set(SKEY,{ volume:a.volume, playing:!a.paused, time:a.currentTime||0, ts:Date.now(), src:a.currentSrc||a.src }); }
    setInterval(save, 1500); window.addEventListener('beforeunload', save);
    // Maintain padding around the bar
    padForBar(); new ResizeObserver(padForBar).observe(document.getElementById('audioControls'));
  }
  document.addEventListener('DOMContentLoaded', init);
})();
