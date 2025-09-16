// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const dbgPanel = $('#debugPanel');
const dbg = {
  add(msg, isErr){ const p=document.createElement('div'); p.textContent=(isErr?'✖ ':'✓ ')+msg; p.className=isErr?'err':'ok'; dbgPanel.appendChild(p); dbgPanel.scrollTop=dbgPanel.scrollHeight; },
  warn(msg){ const p=document.createElement('div'); p.textContent='! '+msg; p.className='warn'; dbgPanel.appendChild(p); dbgPanel.scrollTop=dbgPanel.scrollHeight; },
  clear(){ dbgPanel.innerHTML=''; }
};

// Sections & simple router
const sections = ['intro','home','about','events','contact','shop'];
function show(id){
  sections.forEach(s => $('#'+s).classList.remove('show'));
  $('#'+id).classList.add('show');
  $$('nav a').forEach(a=>a.classList.toggle('active', a.getAttribute('data-route')===id));
  if(id!=='intro') window.location.hash = id;
}

function showRoute(id){
  if(!sections.includes(id)){ dbg.add('Invalid route: '+id, true); return; }
  show(id);
  if(id==='home'){ ensureHome(); }
  if(id==='about'){ ensureAbout(); }
  if(id==='events'){ ensureEvents(); }
  if(id==='shop'){ ensureShop(); }
}

// Welcome typing preserving spaces
(function typing(){
  const el = document.querySelector('.intro-message');
  if(!el) return;
  const text = el.textContent; el.textContent='';
  let i=0;
  (function step(){
    if(i<text.length){
      const ch=text[i++];
      if(ch===' ') el.appendChild(document.createTextNode(' '));
      else { const span=document.createElement('span'); span.textContent=ch; el.appendChild(span); }
      setTimeout(step, 45); // elegant but quick
    }else{
      dbg.add('Welcome typing finished');
      setTimeout(()=>showRoute('home'), 30000); // auto redirect 30s
    }
  })();
})();

// Audio controls
const audio = $('#bg-music');
const musicToggle = $('#musicToggle');
const volume = $('#volume');
let userInteracted=false;

function updateToggleLabel(){
  musicToggle.textContent = audio.paused ? 'Play' : 'Pause';
}

musicToggle.addEventListener('click', async ()=>{
  userInteracted=true;
  if(audio.paused){ try{ await audio.play(); }catch{} } else { audio.pause(); }
  updateToggleLabel();
});
volume.addEventListener('input', ()=>{
  // iOS restricts programmatic volume; this will work on most browsers
  try{ audio.volume = Number(volume.value); }catch{}
});
// Attempt muted autoplay to "warm up" the audio
document.addEventListener('DOMContentLoaded', async ()=>{
  try{ audio.volume = 0; await audio.play(); dbg.add('Autoplay started (muted)'); }catch{ dbg.warn('Autoplay blocked'); }
  volume.value = 0.6; try{ audio.volume = 0.6; }catch{}
  updateToggleLabel();
});

// Nav bindings
$$('[data-route]').forEach(el=>el.addEventListener('click', e=>{
  e.preventDefault();
  const t = e.currentTarget.getAttribute('data-route');
  if(t) showRoute(t); else dbg.add('Broken nav item (no data-route)', true);
}));

// Debug toggle
$('#debugToggle').addEventListener('click', ()=>{
  $('#debugPanel').classList.toggle('show');
});

// Content loaders
async function ensureHome(){
  const container = $('#homeContent');
  if(container.dataset.loaded) return;
  const res = await fetch('content/home/home.md').then(r=>r.text()).catch(()=>'');
  const card = document.createElement('div'); card.className='card'; card.innerHTML = '<p>'+res.replace(/\n/g,'<br>')+'</p>';
  container.appendChild(card);
  container.dataset.loaded='1';
}
async function ensureAbout(){
  const el = $('#aboutContent');
  if(el.dataset.loaded) return;
  const res = await fetch('content/about/about.md').then(r=>r.text()).catch(()=>'');
  el.innerHTML = '<div>'+res.replace(/\n/g,'<br>')+'</div>'; el.dataset.loaded='1';
}
async function ensureEvents(){
  const list = $('#eventsList');
  if(list.dataset.loaded) return;
  const events = await fetch('content/events/events.json').then(r=>r.json());
  events.forEach(ev=>{
    const card=document.createElement('div'); card.className='card';
    const date = new Date(ev.start);
    card.innerHTML = `
      <img src="${ev.image}" alt="Event image"/>
      <h3>${ev.title}</h3>
      <p><b>${date.toDateString()}</b> — ${ev.location}</p>
      <p>${ev.route}</p>
      <p><a href="${ev.map}" target="_blank" rel="noopener">Open map</a></p>
    `;
    list.appendChild(card);
  });
  list.dataset.loaded='1';
}
async function ensureShop(){
  const grid = $('#shopGrid');
  if(grid.dataset.loaded) return;
  const prods = await fetch('content/shop/products.json').then(r=>r.json());
  prods.forEach(p=>{
    const card=document.createElement('div'); card.className='card product';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}"/>
      <h3>${p.name}</h3>
      <p>${p.price}</p>
      <a class="btn" href="${p.link}">Buy</a>
    `;
    grid.appendChild(card);
  });
  grid.dataset.loaded='1';
}

// Search (filters home/about text and products by name)
$('#site-search').addEventListener('input', e=>{
  const q=e.target.value.toLowerCase().trim();
  // Filter products cards
  $$('.product').forEach(card=>{
    const txt = card.textContent.toLowerCase();
    card.style.display = txt.includes(q)?'':'none';
  });
  // Simple highlight in home/about
  ['homeContent','aboutContent'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.style.outline = q ? '1px dashed rgba(230,193,74,.45)' : 'none';
  });
  dbg.add("Search query '"+q+"'", false);
});

// Initial section
if(location.hash && sections.includes(location.hash.slice(1))) showRoute(location.hash.slice(1));