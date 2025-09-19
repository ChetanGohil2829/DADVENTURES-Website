
(function(){
  const VKEY='dadventures.volume', TKEY='dadventures.audio.time', AID='globalAudio';
  function ensureControls(){
    if(document.getElementById('audioControls')) return;
    const bar=document.createElement('div'); bar.id='audioControls';
    bar.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:40;display:flex;gap:10px;align-items:center;justify-content:center;background:rgba(0,0,0,.35);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12);padding:8px 12px;border-radius:14px';
    bar.innerHTML='<button id="acToggle">Pause</button><input id="acVol" type="range" min="0" max="1" step="0.01" style="width:220px">';
    document.body.appendChild(bar);
  }
  function init(){
    let a=document.getElementById(AID);
    if(!a){ a=document.createElement('audio'); a.id=AID; a.src='audio/ambient_loop.wav'; a.autoplay=true; document.body.appendChild(a); }
    a.loop=true; a.muted=true; a.volume=parseFloat(localStorage.getItem(VKEY)||'0.35');
    const last=parseFloat(localStorage.getItem(TKEY)||'0'); try{ a.currentTime=last%Math.max(1,a.duration||60);}catch(e){}
    const play=()=>a.play().catch(()=>{}); play();
    document.addEventListener('click',()=>{ a.muted=false; play(); },{once:true});
    a.addEventListener('error',()=>{ a.src='audio_loop.wav'; a.load(); play(); }); // fallback
    setInterval(()=>{ try{ localStorage.setItem(TKEY,String(a.currentTime||0)); }catch(e){} },2000);
    ensureControls();
    const btn=document.getElementById('acToggle'); const vol=document.getElementById('acVol'); vol.value=String(a.volume);
    btn.addEventListener('click',()=>{ if(a.paused){ a.play(); btn.textContent='Pause'; } else { a.pause(); btn.textContent='Play'; } });
    vol.addEventListener('input',()=>{ const v=Math.max(0,Math.min(1,parseFloat(vol.value))); a.volume=v; localStorage.setItem(VKEY,String(v)); });
  }
  document.addEventListener('DOMContentLoaded', init);
})();
