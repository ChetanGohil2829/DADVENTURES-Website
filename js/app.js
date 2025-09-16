(()=>{
const $=(s,c=document)=>c.querySelector(s); const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const dbg={panel:$('#debug-panel'),logEl:$('#debug-log'),toggle:$('#debug-toggle'),clearBtn:$('#debug-clear'),closeBtn:$('#debug-close'),dlBtn:$('#debug-download'),
logs:[],ts(){const d=new Date();return d.toTimeString().split(' ')[0];},
add(m,e=false){const line=`[${this.ts()}] ${e?'ERROR: ':''}${m}`;this.logs.push(line);if(this.logEl){this.logEl.textContent+=(this.logEl.textContent?'\n':'')+line;this.logEl.scrollTop=this.logEl.scrollHeight;}(e?console.error:console.log)(line);},
clear(){this.logs=[];if(this.logEl)this.logEl.textContent='';},
download(){const blob=new Blob([this.logs.join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='dadventures-debug-log.txt';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},0);},
init(){if(!this.toggle)return;this.toggle.addEventListener('click',()=>this.panel.classList.toggle('hidden'));this.clearBtn?.addEventListener('click',()=>this.clear());this.closeBtn?.addEventListener('click',()=>this.panel.classList.add('hidden'));this.dlBtn?.addEventListener('click',()=>this.download());this.add('Debug panel ready');}}; dbg.init();

const intro=$('#intro'), introMsg=$('#intro-message'), audio=$('#bg-music'), musicToggle=$('#music-toggle'), musicVol=$('#music-volume');
const skipBtn=$('#skipBtn'), enableSound=$('#enableSound'); const y=$('#y'); if(y) y.textContent=new Date().getFullYear();

const welcome='✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
let i=0;(function type(){ if(i<welcome.length){ const span=document.createElement('span'); span.className='char'; span.textContent=welcome[i++]; introMsg.appendChild(span); setTimeout(type,120);} else {dbg.add('Welcome typing finished');}})();

function startFadeIn(){let v=0; audio.muted=false; const t=setInterval(()=>{v+=.05; if(v>=parseFloat(musicVol.value)){v=parseFloat(musicVol.value);clearInterval(t);} audio.volume=v;},150);}
function tryStartMusic(){audio.volume=0; audio.muted=true; audio.play().then(()=>{dbg.add('Music autoplay started (muted)'); const once=()=>{document.removeEventListener('click',once); startFadeIn();}; document.addEventListener('click',once,{once:true});}).catch(()=>{dbg.add('Autoplay blocked; showing Enable Sound'); enableSound.classList.remove('hidden');});}
window.addEventListener('load', tryStartMusic);
enableSound.addEventListener('click',()=>{enableSound.classList.add('hidden'); audio.play().then(()=>{dbg.add('Sound enabled'); startFadeIn();}).catch(e=>dbg.add('Play failed: '+e,true));});
musicToggle.addEventListener('click',()=>{if(audio.paused){audio.play().then(()=>dbg.add('Music play')); musicToggle.textContent='Pause';}else{audio.pause(); musicToggle.textContent='Play'; dbg.add('Music pause');}});
musicVol.addEventListener('input',e=>{audio.volume=parseFloat(e.target.value||'0');});

const routes=['home','about','events','contact','shop'];
function showRoute(id){const current=$('.route:not(.hidden)'); const next=$('#'+id); if(!next) return;
 if(current){current.classList.add('fading-out'); setTimeout(()=>{current.classList.remove('fading-out','visible'); current.classList.add('hidden'); next.classList.remove('hidden'); next.classList.add('visible'); dbg.add('Navigated to '+id); if(id==='events') ensureCalendar();},250);}
 else {next.classList.remove('hidden'); next.classList.add('visible'); if(id==='events') ensureCalendar();}}
$$('[data-route]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault(); const t=e.currentTarget.getAttribute('data-route'); if(t) showRoute(t);}));
$('.site-logo')?.addEventListener('click',()=>showRoute('home'));

function goHome(){intro.classList.add('fade-out'); setTimeout(()=>{intro.classList.add('hidden'); showRoute('home');},300); dbg.add('Intro → Home (auto)');}
setTimeout(goHome, 30000);
skipBtn.addEventListener('click',()=>goHome());

fetch('content/home.md').then(r=>r.text()).then(t=>{$('#home-hero').innerHTML=t;});
fetch('content/about.md').then(r=>r.text()).then(t=>{$('#about-content').innerHTML=t;});

let calInit=false;
function ensureCalendar(){ if(calInit) return; calInit=true; const el=$('#calendar'); if(!el) return;
  try{ const cal=new FullCalendar.Calendar(el,{initialView:'dayGridMonth',events:async(info,success,failure)=>{try{const res=await fetch('content/events/events.json?ts='+Date.now()); const data=await res.json(); success(data);}catch(err){failure(err); dbg.add('Calendar load error',true);} }, eventClick:(info)=>{const ev=info.event; const ex=ev.extendedProps||{}; const modal=$('#event-modal'), body=$('#event-body'), close=$('#event-close'); const start=ev.start?new Date(ev.start):null; const end=ev.end?new Date(ev.end):null; const fmt=d=>d?d.toLocaleString():''; const img=ex.image?`<img src="${ex.image}" alt="${ev.title}" style="max-width:100%;border-radius:8px;margin:8px 0">`:''; body.innerHTML=`<h2 style="color:var(--gold);margin:.2rem 0">${ev.title}</h2><p>📅 ${fmt(start)}${end?' – '+fmt(end):''}</p><p>📍 ${ex.location||''} ${ex.map?`— <a href="${ex.map}" target="_blank" rel="noopener">View on Map</a>`:''}</p>${ex.route?`<p>🥾 Route: ${ex.route}</p>`:''}${ex.details?`<p>📝 ${ex.details}</p>`:''}${img}<p id="countdown" style="margin-top:8px;"></p>`; modal.classList.remove('hidden'); const cdEl=$('#countdown'); function tick(){ if(!start){cdEl.textContent='';return;} const ms=start-new Date(); if(ms<=0){cdEl.textContent='⏰ Event is starting!'; return;} const d=Math.floor(ms/86400000), h=Math.floor((ms%86400000)/3600000), m=Math.floor((ms%3600000)/60000), s=Math.floor((ms%60000)/1000); cdEl.textContent=`⏰ Starts in ${d}d ${h}h ${m}m ${s}s`; } tick(); const iv=setInterval(tick,1000); close.onclick=()=>{modal.classList.add('hidden'); clearInterval(iv);}; modal.onclick=(e)=>{ if(e.target===modal){ modal.classList.add('hidden'); clearInterval(iv);} } } }); cal.render(); } catch(e){ dbg.add('Calendar init failed: '+e,true); } }

fetch('content/shop/products.json').then(r=>r.json()).then(items=>{ const grid=$('#shop-grid'); if(!grid) return; grid.innerHTML=items.map(p=>`<div class="product card fade-in" style="animation-delay:.2s"><img src="${p.image||'images/shop/tee.jpg'}" alt="${p.name}" style="width:100%;border-radius:10px;margin-bottom:8px"><div class="p-name" style="font-weight:600">${p.name}</div><div class="p-price">£${p.price}</div><a class="btn" href="${p.link||'#'}" target="_blank" rel="noopener">Buy</a></div>`).join(''); }).catch(()=>{});

$('#site-search')?.addEventListener('input', e=>{ const q=(e.target.value||'').toLowerCase().trim();
  ['home-hero','about-content'].forEach(id=>{const el=$('#'+id); if(!el) return; const txt=(el.textContent||'').toLowerCase(); el.style.display=(q && !txt.includes(q))?'none':'';});
  $$('.product').forEach(card=>{ const name=(card.querySelector('.p-name')?.textContent||'').toLowerCase(); card.style.display=(q && !name.includes(q))?'none':''; });
});

function goDonate(){ window.location.href='thank-you.html'; }
$('#donateBtnHeader')?.addEventListener('click', goDonate);
$('#donateBtnFooter')?.addEventListener('click', goDonate);
$('#donateBtnShop')?.addEventListener('click', goDonate);
})();