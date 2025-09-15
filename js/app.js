(()=>{
const $=(s,c=document)=>c.querySelector(s); const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));

// Debug
const dbg={panel:$('#debug-panel'),logEl:$('#debug-log'),toggle:$('#debug-toggle'),clearBtn:$('#debug-clear'),closeBtn:$('#debug-close'),dlBtn:$('#debug-download'),
logs:[],ts(){const d=new Date();return d.toTimeString().split(' ')[0];},
add(m,e=false){const line=`[${this.ts()}] ${e?'ERROR: ':''}${m}`;this.logs.push(line);if(this.logEl){this.logEl.textContent+=(this.logEl.textContent?'\n':'')+line;this.logEl.scrollTop=this.logEl.scrollHeight;}(e?console.error:console.log)(line);},
clear(){this.logs=[];if(this.logEl)this.logEl.textContent='';},
download(){const blob=new Blob([this.logs.join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='dadventures-debug-log.txt';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},0);},
init(){if(!this.toggle)return;this.toggle.addEventListener('click',()=>this.panel.classList.toggle('hidden'));this.clearBtn?.addEventListener('click',()=>this.clear());this.closeBtn?.addEventListener('click',()=>this.panel.classList.add('hidden'));this.dlBtn?.addEventListener('click',()=>this.download());this.add('Debug panel ready');}}; dbg.init();

// Elements
const intro=$('#intro'), introMsg=$('#intro-message'), audio=$('#bg-music'), musicToggle=$('#music-toggle'), musicVol=$('#music-volume');
const skipBtn=$('#skipBtn'), enableSound=$('#enableSound'); const y=$('#y'); if(y) y.textContent=new Date().getFullYear();

// Typewriter with per-letter fade
const welcome='✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
let i=0;(function type(){if(i<welcome.length){const span=document.createElement('span');span.className='char';span.textContent=welcome[i++];introMsg.appendChild(span);setTimeout(type,180);}else{dbg.add('Welcome typing finished');}})();

// Music autoplay muted + fade-in on first click
function startFadeIn(){let v=0;audio.muted=false;const t=setInterval(()=>{v+=.05; if(v>=parseFloat(musicVol.value)){v=parseFloat(musicVol.value);clearInterval(t);} audio.volume=v;},180);}
function tryStartMusic(){audio.volume=0;audio.muted=true;audio.play().then(()=>{dbg.add('Music autoplay started (muted)'); const once=()=>{document.removeEventListener('click',once);startFadeIn();}; document.addEventListener('click',once,{once:true});}).catch(()=>{dbg.add('Autoplay blocked; showing Enable Sound'); enableSound.classList.remove('hidden');});}
window.addEventListener('load', tryStartMusic);
enableSound.addEventListener('click',()=>{enableSound.classList.add('hidden'); audio.play().then(()=>{dbg.add('Sound enabled'); startFadeIn();}).catch(e=>dbg.add('Play failed: '+e,true));});
musicToggle.addEventListener('click',()=>{if(audio.paused){audio.play().then(()=>dbg.add('Music play')); musicToggle.textContent='Pause';}else{audio.pause(); musicToggle.textContent='Play'; dbg.add('Music pause');}});
musicVol.addEventListener('input',e=>{audio.volume=parseFloat(e.target.value||'0');});

// Router with fade transitions
const routes=['home','about','events','contact','shop'];
function showRoute(id){const current=$('.route:not(.hidden)'); const next=$('#'+id); if(!next) return;
 if(current){current.classList.add('fading-out'); setTimeout(()=>{current.classList.remove('fading-out','visible'); current.classList.add('hidden'); next.classList.remove('hidden'); next.classList.add('visible'); dbg.add('Navigated to '+id); if(id==='events') ensureCalendar();},300);}
 else {next.classList.remove('hidden'); next.classList.add('visible'); if(id==='events') ensureCalendar();}}
$$('[data-route]').forEach(el=>el.addEventListener('click',e=>{const t=e.currentTarget.getAttribute('data-route'); if(t) showRoute(t);}));
$('.site-logo')?.addEventListener('click',()=>showRoute('home'));

// Auto-redirect after exactly 15s
function goHome(){ intro.classList.add('fade-out'); setTimeout(()=>{ intro.classList.add('hidden'); showRoute('home'); }, 380); dbg.add('Intro → Home (auto)'); }
setTimeout(goHome, 15000);
skipBtn.addEventListener('click',()=>goHome());

// Load content
fetch('content/home.md').then(r=>r.text()).then(t=>{$('#home-hero').innerHTML=t;});
fetch('content/about.md').then(r=>r.text()).then(t=>{$('#about-content').innerHTML=t;});

// Calendar
let calInit=false;
function ensureCalendar(){ if(calInit) return; calInit=true; const el=$('#calendar'); if(!el) return;
  try{ const cal=new FullCalendar.Calendar(el,{initialView:'dayGridMonth',events:async(info,success,failure)=>{try{const res=await fetch('content/events/events.json?ts='+Date.now()); const data=await res.json(); success(data);}catch(err){failure(err); dbg.add('Calendar load error',true);} }, eventClick:(info)=>{const ex=info.event.extendedProps||{}; if(ex.map) window.open(ex.map,'_blank'); }}); cal.render(); }
  catch(e){ dbg.add('Calendar init failed: '+e,true); } }

// Shop
fetch('content/shop/products.json').then(r=>r.json()).then(items=>{ const grid=$('#shop-grid'); if(!grid) return;
  grid.innerHTML=items.map(p=>`<div class="product card fade-in" style="animation-delay:.2s"><div class="p-thumb"></div><div class="p-name">${p.name}</div><div class="p-price">£${p.price}</div><a class="btn" href="${p.link||'#'}" target="_blank" rel="noopener">Buy</a></div>`).join(''); }).catch(()=>{});

// Search
$('#site-search')?.addEventListener('input',e=>{ const q=(e.target.value||'').toLowerCase().trim();
  ['home-hero','about-content'].forEach(id=>{const el=$('#'+id); if(!el) return; const txt=el.textContent||''; el.style.display=(q && !txt.toLowerCase().includes(q))?'none':''; });
  $$('.product').forEach(card=>{ const name=(card.querySelector('.p-name')?.textContent||'').toLowerCase(); card.style.display=(q && !name.includes(q))?'none':''; });
});

// Footer year
$('#y').textContent=(new Date()).getFullYear();
})();