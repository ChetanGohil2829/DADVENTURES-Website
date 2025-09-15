(()=>{
const byId = id => document.getElementById(id);
const qsa = sel => document.querySelectorAll(sel);

// Debug panel
const dbg = {
  panel: byId('debug-panel'),
  logEl: byId('debug-log'),
  toggleBtn: byId('debug-toggle'),
  clearBtn: byId('debug-clear'),
  closeBtn: byId('debug-close'),
  dlBtn: byId('debug-download'),
  logs: [],
  ts(){ const d=new Date(); return d.toTimeString().split(' ')[0]; },
  add(msg, isErr=false){
    const line = `[${this.ts()}] ${isErr? 'ERROR: ' : ''}${msg}`;
    this.logs.push(line);
    if(this.logEl){ this.logEl.textContent += (this.logEl.textContent ? '\n' : '') + line; this.logEl.scrollTop = this.logEl.scrollHeight; }
    (isErr? console.error : console.log)(line);
    if(isErr && this.panel && this.panel.classList.contains('hidden')) this.panel.classList.remove('hidden');
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
    this.toggleBtn.addEventListener('click', ()=>{ this.panel.classList.toggle('hidden'); });
    this.clearBtn.addEventListener('click', ()=> this.clear());
    this.closeBtn.addEventListener('click', ()=> this.panel.classList.add('hidden'));
    this.dlBtn.addEventListener('click', ()=> this.download());
    // Drag from header
    let dragging=false, offsetX=0, offsetY=0;
    this.panel.addEventListener('mousedown', (e)=>{
      if(e.target.closest('.debug-header')){
        dragging=true; this.panel.classList.add('debug-dragging');
        const rect=this.panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
      }
    });
    window.addEventListener('mousemove',(e)=>{
      if(!dragging) return;
      this.panel.style.left = (e.clientX - offsetX) + 'px';
      this.panel.style.top  = (e.clientY - offsetY) + 'px';
      this.panel.style.bottom = 'auto'; this.panel.style.right='auto';
    });
    window.addEventListener('mouseup',()=>{ dragging=false; this.panel.classList.remove('debug-dragging'); });
    // Resource load failures
    window.addEventListener('error', (e)=>{
      try{
        if(e && e.target && (e.target.src || e.target.href)){
          const url = e.target.src || e.target.href;
          this.add(`Failed to load resource: ${url}`, true);
        }
      }catch(_){}
    }, true);
    this.add('Debug panel initialized');
  }
};
dbg.init();

// Core app
const intro = byId('intro');
const introMsg = byId('intro-message');
const audio = byId('bg-music');
const musicToggle = byId('music-toggle');
const musicVol = byId('music-volume');
const skipBtn = byId('skipBtn');
const enableSound = byId('enableSound');

const y = byId('y'); if (y) y.textContent = new Date().getFullYear();

// Typewriter
const message = '✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
let i = 0;
(function typeEffect(){
  if(i < message.length){
    introMsg.textContent += message.charAt(i++);
    setTimeout(typeEffect, 35);
  } else {
    dbg.add('Welcome message typing finished');
  }
})();

// Music
function tryStartMusic(){
  audio.volume = 0; audio.muted = true;
  audio.play().then(()=>{
    dbg.add('Music autoplay started (muted)');
    let v=0; const fade=setInterval(()=>{
      v += 0.05; if(v>=0.7){ v=0.7; clearInterval(fade); }
      audio.volume=v; audio.muted=false; musicVol.value=v.toFixed(2);
    }, 200);
  }).catch(()=>{
    dbg.add('Autoplay blocked; showing Enable Sound', true);
    enableSound.classList.remove('hidden');
  });
}
window.addEventListener('load', tryStartMusic);

enableSound.addEventListener('click', ()=>{
  enableSound.classList.add('hidden');
  tryStartMusic();
});

audio.addEventListener('ended', ()=>{ dbg.add('Music ended → restarting loop'); audio.currentTime=0; audio.play(); });

musicToggle.addEventListener('click', ()=>{
  if(audio.paused){
    audio.play().then(()=>dbg.add('Music play pressed')).catch(err=>dbg.add('Music play failed: '+err, true));
    musicToggle.textContent = 'Pause';
  }else{
    audio.pause(); musicToggle.textContent = 'Play'; dbg.add('Music paused');
  }
});
musicVol.addEventListener('input', e => { audio.volume = e.target.value; dbg.add('Volume changed: '+e.target.value); });

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

function goHome(){ intro.classList.add('hidden'); showRoute('home'); dbg.add('Intro hidden → Home shown'); }
setTimeout(goHome, 10000);
skipBtn.addEventListener('click', ()=>{ dbg.add('Skip clicked'); goHome(); });

// Content
fetch('content/home.md').then(r=>r.text()).then(t=>{
  const el = byId('home-hero'); if(el) el.innerHTML = t;
  dbg.add('Loaded content/home.md');
}).catch(err=>dbg.add('Failed to load content/home.md: '+err, true));

fetch('content/about.md').then(r=>r.text()).then(t=>{
  const el = byId('about-content'); if(el) el.innerHTML = t;
  dbg.add('Loaded content/about.md');
}).catch(err=>dbg.add('Failed to load content/about.md: '+err, true));

// Calendar
let calendarInit = false;
function ensureCalendar(){
  if (calendarInit) return; calendarInit = true;
  const el = byId('calendar'); if(!el) return;
  try{
    const cal = new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      events: async (info, success, failure) => {
        try{
          const res = await fetch('content/events/events.json?ts=' + Date.now());
          const data = await res.json(); success(data);
          dbg.add('Events loaded: ' + data.length + ' items');
        }catch(err){ failure(err); dbg.add('Failed to load events.json: ' + err, true); }
      },
      eventClick: (info) => {
        const ev = info.event.extendedProps || {};
        dbg.add('Event clicked: ' + (info.event.title || 'Untitled'));
        if (ev.map) window.open(ev.map, '_blank');
      }
    });
    cal.render(); dbg.add('Calendar rendered');
  }catch(err){
    dbg.add('Calendar init error: ' + err, true);
  }
}

// Shop
fetch('content/shop/products.json').then(r=>r.json()).then(items=>{
  const grid = byId('shop-grid'); if(!grid) return;
  grid.innerHTML = items.map(p => `
    <div class="product">
      <div class="p-thumb"></div>
      <div class="p-name">${p.name}</div>
      <div class="p-price">£${p.price}</div>
      <a class="p-buy" href="${p.link||'#'}" target="_blank" rel="noopener">Buy</a>
    </div>
  `).join('');
  dbg.add('Shop products loaded: ' + items.length);
}).catch(err=>dbg.add('Failed to load products.json: ' + err, true));

// Contact form (no PII)
const contactForm = byId('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', ()=>{
    dbg.add('Contact form submitted successfully');
  });
}
})();