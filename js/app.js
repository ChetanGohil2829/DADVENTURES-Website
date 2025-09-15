(()=>{
const byId = id => document.getElementById(id);
const qsa = sel => document.querySelectorAll(sel);

// Debug (manual only)
const dbg = {
  panel: byId('debug-panel'),
  logEl: byId('debug-log'),
  toggleBtn: byId('debug-toggle'),
  clearBtn: byId('debug-clear'),
  closeBtn: byId('debug-close'),
  dlBtn: byId('debug-download'),
  logs: [],
  ts(){ const d=new Date(); return d.toTimeString().split(' ')[0]; },
  add(msg,isErr=false){
    const line=`[${this.ts()}] ${isErr?'ERROR: ':''}${msg}`;
    this.logs.push(line);
    if(this.logEl){ this.logEl.textContent += (this.logEl.textContent?'\n':'') + line; this.logEl.scrollTop = this.logEl.scrollHeight; }
    (isErr?console.error:console.log)(line);
  },
  clear(){ this.logs=[]; if(this.logEl) this.logEl.textContent=''; },
  download(){
    const blob = new Blob([this.logs.join('\n')], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'dadventures-debug-log.txt';
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
  },
  init(){
    if(!this.toggleBtn) return;
    this.toggleBtn.addEventListener('click', ()=> this.panel.classList.toggle('hidden'));
    this.clearBtn.addEventListener('click', ()=> this.clear());
    this.closeBtn.addEventListener('click', ()=> this.panel.classList.add('hidden'));
    this.dlBtn.addEventListener('click', ()=> this.download());
    this.add('Debug panel initialized');
  }
}; dbg.init();

// Elements
const intro = byId('intro'), introMsg = byId('intro-message');
const audio = byId('bg-music'), musicToggle = byId('music-toggle'), musicVol = byId('music-volume');
const skipBtn = byId('skipBtn'), enableSound = byId('enableSound');
const y = byId('y'); if(y) y.textContent = new Date().getFullYear();

// Typewriter (elegant)
const message = '✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
let i = 0;
(function typeEffect(){
  if (i < message.length) {
    introMsg.textContent += message.charAt(i++);
    setTimeout(typeEffect, 120);
  } else {
    dbg.add('Welcome message typing finished');
  }
})();

// Music: autoplay muted; fade-in on first click; loop
function startFadeIn(){
  let v = 0;
  audio.muted = false;
  const timer = setInterval(()=>{
    v += 0.05;
    if (v >= parseFloat(musicVol.value)) { v = parseFloat(musicVol.value); clearInterval(timer); }
    audio.volume = v;
  }, 180);
}

function tryStartMusic(){
  audio.volume = 0; audio.muted = true;
  audio.play().then(()=>{
    dbg.add('Music autoplay started (muted)');
    const once = ()=>{ document.removeEventListener('click', once); startFadeIn(); };
    document.addEventListener('click', once, { once:true });
  }).catch(()=>{
    dbg.add('Autoplay blocked; waiting for user gesture');
    enableSound.classList.remove('hidden');
  });
}
window.addEventListener('load', tryStartMusic);

enableSound.addEventListener('click', ()=>{
  enableSound.classList.add('hidden');
  audio.play().then(()=>{ dbg.add('Sound enabled by user'); startFadeIn(); }).catch(e=>dbg.add('Play failed: '+e,true));
});

// Controls
musicToggle.addEventListener('click', ()=>{
  if (audio.paused) {
    audio.play().then(()=>dbg.add('Music play pressed')).catch(err=>dbg.add('Music play failed: '+err,true));
    musicToggle.textContent = 'Pause';
  } else {
    audio.pause(); musicToggle.textContent = 'Play'; dbg.add('Music paused');
  }
});
musicVol.addEventListener('input', e=>{
  const val = parseFloat(e.target.value || '0'); audio.volume = val; dbg.add('Volume changed: ' + val.toFixed(2));
});

// Router
const routes = ['home','about','events','contact','shop'];
function showRoute(id){
  routes.forEach(r => byId(r).classList.add('hidden'));
  byId(id).classList.remove('hidden');
  dbg.add('Navigated to ' + id.charAt(0).toUpperCase() + id.slice(1));
  if (id === 'events') ensureCalendar();
}
qsa('[data-route]').forEach(el => el.addEventListener('click', e => {
  const t = e.currentTarget.getAttribute('data-route'); if(t) showRoute(t);
}));

// Auto-redirect to Home after 10s
function goHome(){ intro.classList.add('hidden'); showRoute('home'); dbg.add('Intro hidden → Home shown'); }
setTimeout(goHome, 10000);
skipBtn.addEventListener('click', ()=>{ dbg.add('Skip clicked'); goHome(); });

// Content
fetch('content/home.md').then(r=>r.text()).then(t=>{ const el=byId('home-hero'); if(el) el.innerHTML=t; dbg.add('Loaded content/home.md'); }).catch(err=>dbg.add('Failed home.md: '+err,true));
fetch('content/about.md').then(r=>r.text()).then(t=>{ const el=byId('about-content'); if(el) el.innerHTML=t; dbg.add('Loaded content/about.md'); }).catch(err=>dbg.add('Failed about.md: '+err,true));

// Calendar
let calInit=false;
function ensureCalendar(){
  if(calInit) return; calInit=true;
  const el=byId('calendar'); if(!el) return;
  try{
    const cal = new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      events: async (info, success, failure) => {
        try{
          const res = await fetch('content/events/events.json?ts=' + Date.now());
          const data = await res.json(); success(data);
          dbg.add('Events loaded: ' + data.length + ' items');
        }catch(err){ failure(err); dbg.add('Failed events.json: ' + err, true); }
      },
      eventClick: (info) => {
        const ev = info.event.extendedProps || {};
        dbg.add('Event clicked: ' + (info.event.title || 'Untitled'));
        if (ev.map) window.open(ev.map, '_blank');
      }
    });
    cal.render(); dbg.add('Calendar rendered');
  }catch(err){ dbg.add('Calendar init error: ' + err, true); }
}

// Shop
fetch('content/shop/products.json').then(r=>r.json()).then(items=>{
  const grid = byId('shop-grid'); if(!grid) return;
  grid.innerHTML = items.map(p=>`
    <div class="product">
      <div class="p-thumb"></div>
      <div class="p-name">${p.name}</div>
      <div class="p-price">£${p.price}</div>
      <a class="p-buy" href="${p.link||'#'}" target="_blank" rel="noopener">Buy</a>
    </div>
  `).join('');
  dbg.add('Shop products loaded: ' + items.length);
}).catch(err=>dbg.add('Failed products.json: ' + err, true));

// Contact (no PII)
const contactForm = byId('contact-form');
if (contactForm){ contactForm.addEventListener('submit', ()=>{ dbg.add('Contact form submitted successfully'); }); }
})();