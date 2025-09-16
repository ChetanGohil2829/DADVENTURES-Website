(()=>{
const $=(s,c=document)=>c.querySelector(s); const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const dbg={panel:$('#debug-panel'),sumEl:$('#debug-summary'),logEl:$('#debug-log'),toggle:$('#debug-toggle'),runBtn:$('#debug-runcheck'),clearBtn:$('#debug-clear'),closeBtn:$('#debug-close'),dlBtn:$('#debug-download'),
logs:[],ts(){const d=new Date();return d.toTimeString().split(' ')[0];},
add(m,e=false){const line=`[${this.ts()}] ${e?'ERROR: ':''}${m}`;this.logs.push(line);if(this.logEl){this.logEl.textContent+=(this.logEl.textContent?'\n':'')+line;this.logEl.scrollTop=this.logEl.scrollHeight;}(e?console.error:console.log)(line);},
setSummary(t){if(this.sumEl)this.sumEl.textContent=t;},
clear(){this.logs=[];if(this.logEl)this.logEl.textContent='';},
download(){const blob=new Blob([this.logs.join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='dadventures-debug-log.txt';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},0);},
init(){this.toggle?.addEventListener('click',()=>this.panel.classList.toggle('hidden'));this.clearBtn?.addEventListener('click',()=>this.clear());this.closeBtn?.addEventListener('click',()=>this.panel.classList.add('hidden'));this.dlBtn?.addEventListener('click',()=>this.download());this.runBtn?.addEventListener('click',()=>runSiteCheck());this.add('Debug panel ready');}}; dbg.init();

const intro=$('#intro'), introMsg=$('#intro-message'), audio=$('#bg-music'), musicToggle=$('#music-toggle'), musicVol=$('#music-volume');
const enableSound=$('#enableSound'); const y=$('#y'); if(y) y.textContent=new Date().getFullYear();

// Typing with preserved spacing (slower for elegance)
const welcome='✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
let i=0;(function type(){ if(i<welcome.length){ const span=document.createElement('span'); span.className='char'; span.textContent=welcome[i++]; introMsg.appendChild(span); setTimeout(type,140);} else {dbg.add('Welcome typing finished');}})();

// Music: autoplay muted; unmute + fade on first user action
function startFadeIn(){let v=0; audio.muted=false; const target=parseFloat(musicVol.value||'0.7')||0.7; const t=setInterval(()=>{v+=.05; if(v>=target){v=target; clearInterval(t);} audio.volume=v;},150);}
function firstInteraction(){document.removeEventListener('click',firstInteraction);document.removeEventListener('keydown',firstInteraction);audio.play().then(()=>{dbg.add('Audio play after interaction'); startFadeIn();}).catch(e=>dbg.add('Audio play failed: '+e,true));}
function initAudio(){audio.volume=0; audio.muted=true; audio.play().then(()=>{dbg.add('Autoplay started muted'); document.addEventListener('click',firstInteraction,{once:true}); document.addEventListener('keydown',firstInteraction,{once:true});}).catch(()=>{dbg.add('Autoplay blocked, showing Enable Sound'); enableSound.classList.remove('hidden');});}
window.addEventListener('load', initAudio);
enableSound.addEventListener('click',()=>{enableSound.classList.add('hidden'); firstInteraction();});
musicToggle.addEventListener('click',()=>{ if(audio.paused){ audio.play().then(()=>{dbg.add('Music play (button)'); musicToggle.textContent='Pause';}).catch(e=>dbg.add('Play fail: '+e,true)); } else { audio.pause(); musicToggle.textContent='Play'; dbg.add('Music pause (button)'); } });
const setVol = v=>{ try{ audio.volume=v; dbg.add('Volume set: '+v.toFixed(2)); }catch(e){ dbg.add('Volume set failed (platform): '+e,true);} };
musicVol.addEventListener('input', e=> setVol(parseFloat(e.target.value||'0')));
musicVol.addEventListener('change', e=> setVol(parseFloat(e.target.value||'0')));

// Router
function showRoute(id){const current=$('.route.visible'); const next=$('#'+id); if(!next) return;
 if(current){current.classList.add('fading-out'); setTimeout(()=>{current.classList.remove('fading-out','visible'); current.classList.add('hidden'); next.classList.remove('hidden'); next.classList.add('visible'); dbg.add('Navigated to '+id); if(id==='events') ensureCalendar();},220);}
 else {next.classList.remove('hidden'); next.classList.add('visible'); if(id==='events') ensureCalendar();}}
$$('[data-route]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault(); const t=e.currentTarget.getAttribute('data-route'); if(t) showRoute(t);}));
$('.site-logo')?.addEventListener('click',()=>showRoute('home'));

// Auto-redirect to Home after 30s
setTimeout(()=>{ intro.classList.add('fade-out'); setTimeout(()=>{ intro.classList.add('hidden'); showRoute('home'); },300); dbg.add('Intro → Home (auto 30s)'); }, 30000);

// Content
fetch('content/home.md').then(r=>r.text()).then(t=>{$('#home-hero').innerHTML=t;}).catch(e=>dbg.add('Home load fail: '+e,true));
fetch('content/about.md').then(r=>r.text()).then(t=>{$('#about-content').innerHTML=t;}).catch(e=>dbg.add('About load fail: '+e,true));

// Calendar
let calInit=false;
function ensureCalendar(){ if(calInit) return; calInit=true; const el=$('#calendar'); if(!el) return;
  try{ const cal=new FullCalendar.Calendar(el,{initialView:'dayGridMonth',events:async(info,success,failure)=>{try{const res=await fetch('content/events/events.json?ts='+Date.now()); const data=await res.json(); success(data);}catch(err){failure(err); dbg.add('Calendar load error: '+err,true);} }, eventClick:(info)=>{const ev=info.event; const ex=ev.extendedProps||{}; const modal=$('#event-modal'), body=$('#event-body'), close=$('#event-close'); const start=ev.start?new Date(ev.start):null; const end=ev.end?new Date(ev.end):null; const when=start?start.toLocaleString():'';
        body.innerHTML=`<h2 style="color:#e6c14a;margin:.2rem 0">${ev.title}</h2>
        <p><strong>When:</strong> ${when}</p>
        ${ex.location?`<p><strong>Location:</strong> ${ex.location} — <a href="${ex.map||'#'}" target="_blank" rel="noopener">Map</a></p>`:''}
        ${ex.route?`<p><strong>Route:</strong> ${ex.route}</p>`:''}
        ${ex.details?`<p>${ex.details}</p>`:''}
        ${ex.image?`<img src="${ex.image}" alt="Event image" style="width:100%;border-radius:10px;margin-top:6px">`:''}
        <p id="cd" style="margin-top:.4rem;color:#f7f1d0"></p>`;
        modal.classList.remove('hidden'); const tick=()=>{ const now=new Date(); const diff=(start?start:now)-now; if(diff<=0){$('#cd').textContent='⏰ Event started'; return;} const s=Math.floor(diff/1000); const d=Math.floor(s/86400); const h=Math.floor((s%86400)/3600); const m=Math.floor((s%3600)/60); const sec=s%60; $('#cd').textContent=`Starts in ${d}d ${h}h ${m}m ${sec}s`; requestAnimationFrame(tick);}; tick(); close.onclick=()=>modal.classList.add('hidden'); } }); cal.render(); dbg.add('Calendar rendered'); }catch(e){ dbg.add('Calendar init failed: '+e,true); }
}

// Shop
fetch('content/shop/products.json').then(r=>r.json()).then(items=>{ const grid=$('#shop-grid'); if(!grid) return; grid.innerHTML=items.map(p=>`<div class="product card fade-in" style="animation-delay:.2s"><img src="${p.image||'images/shop/tee.jpg'}" alt="${p.name}" style="width:100%;border-radius:10px;margin-bottom:8px"><div class="p-name" style="font-weight:600">${p.name}</div><div class="p-price">£${p.price}</div><a class="btn" href="${p.link||'#'}" target="_blank" rel="noopener">Buy</a></div>`).join(''); dbg.add('Shop loaded: '+items.length);}).catch(e=>dbg.add('Shop load fail: '+e,true));

// Search
$('#site-search')?.addEventListener('input', e=>{
  const q=(e.target.value||'').toLowerCase().trim();
  ['home-hero','about-content'].forEach(id=>{ const el=$('#'+id); if(!el) return; const txt=(el.textContent||'').toLowerCase(); el.style.display=(q && !txt.includes(q))?'none':''; });
  Array.from(document.querySelectorAll('.product')).forEach(card=>{ const name=(card.querySelector('.p-name')?.textContent||'').toLowerCase(); card.style.display=(q && !name.includes(q))?'none':''; });
  dbg.add('Search query: '+q);
});

// Expose runSiteCheck used by sitecheck.js
window.__dadventures_dbg = { dbg, showRoute, audio, musicToggle, musicVol };
})();