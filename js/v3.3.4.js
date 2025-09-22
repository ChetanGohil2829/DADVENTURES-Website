
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
    $1if(vol){
      ['input','change','touchstart','touchmove','pointerdown','pointermove'].forEach(function(ev){
        vol.addEventListener(ev, function(){ try{ a.muted=false; a.volume=+vol.value; save(); }catch(e){} });
      });
    }); }
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
