// v3.4.17-fallback: ensure clock + audio controls exist and work
(function(){
  function ensureClock(){
    let el=document.querySelector('.clock');
    const hdr=document.querySelector('header .inner');
    if(!el && hdr){
      let right=hdr.querySelector('.header-right');
      if(!right){ right=document.createElement('div'); right.className='header-right'; hdr.appendChild(right); }
      el=document.createElement('span'); el.className='clock'; right.prepend(el);
    }
    function p(n){ return String(n).padStart(2,'0'); }
    function fmt(d){
      try{
        const ds=d.toLocaleDateString(undefined,{year:'numeric',month:'2-digit',day:'2-digit'});
        return ds+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
      }catch(e){
        return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
      }
    }
    function tick(){ var n=new Date(); if(el) el.textContent = fmt(n); }
    setInterval(tick,1000); tick();
  }

  function ensureAudioBar(){
    if(!document.getElementById('audioControls')){
      const bar=document.createElement('div');
      bar.id='audioControls';
      bar.innerHTML='<button id="acToggle">Pause</button><div class="spacer"></div><input id="acVol" type="range" min="0" max="1" step="0.01" value="0.4">';
      document.body.appendChild(bar);
    }
    let a=document.getElementById('siteAudio');
    if(!a){
      a=document.createElement('audio'); a.id='siteAudio'; a.loop=true; a.preload='auto';
      try{ a.setAttribute('playsinline',''); }catch(e){}
      document.body.appendChild(a);
    }
    const mp3='audio/relaxing-piano-ambient.mp3'; const wav='audio/relaxing-piano-ambient.wav';
    a.src = (a.canPlayType && a.canPlayType('audio/mpeg'))? mp3 : wav;
    a.addEventListener('error', function _fb(){ if(a.src && a.src.indexOf('.mp3')!==-1){ a.src=wav; a.load(); a.play().catch(()=>{});} a.removeEventListener('error', _fb); });

    const KEY='music.state';
    const state = (function(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {} } })();
    if(typeof state.volume==='number') a.volume=state.volume;

    const btn=document.getElementById('acToggle'); const vol=document.getElementById('acVol');
    function save(){ try{ localStorage.setItem(KEY, JSON.stringify({playing:!a.paused, volume:a.volume, time:a.currentTime||0, ts:Date.now()})); }catch(e){} }
    if(btn){ btn.textContent=a.paused?'Play':'Pause'; btn.addEventListener('click',()=>{ if(a.paused){ a.play().catch(()=>{}); btn.textContent='Pause'; } else { a.pause(); btn.textContent='Play'; } save(); }); }
    if(vol){ if(typeof state.volume==='number') vol.value=state.volume; vol.addEventListener('input',()=>{ a.volume=+vol.value; save(); }); }

    // Continuity resume
    const savedWhen=state.ts||0; const savedTime=state.time||0; const wantPlay = state.playing!==false;
    function resume(){ try{ let t=savedTime||0; if(wantPlay && savedWhen){ const delta=(Date.now()-savedWhen)/1000; t=(savedTime+delta) % (a.duration||3600); } a.currentTime=t; }catch(e){} }
    a.addEventListener('loadedmetadata', resume, {once:true});

    // Start on first gesture (for mobile)
    const first=()=>{ a.muted=false; if(wantPlay){ a.play().catch(()=>{}); } window.removeEventListener('pointerdown', first); window.removeEventListener('click', first); window.removeEventListener('touchstart', first); };
    window.addEventListener('pointerdown', first, {once:true});
    window.addEventListener('click', first, {once:true});
    window.addEventListener('touchstart', first, {once:true});

    setInterval(save, 1200);
  }

  document.addEventListener('DOMContentLoaded', function(){
    try{ ensureClock(); }catch(e){}
    try{ ensureAudioBar(); }catch(e){}
  });
})();

// v3.5.17 ensure clock visible on mobile
(function(){
  var s=document.getElementById('clock-visible');
  if(!s){
    s=document.createElement('style'); s.id='clock-visible';
    s.textContent='@media(max-width:768px){ .header-right .clock{ display:inline-flex !important; } }';
    document.head.appendChild(s);
  }
})();
