
const State = {
  settings: null,
  events: [],
  blog: [],
  shop: [],
  timeline: [],
  audio: null,
  maint: false
};

function $(q, el){ return (el||document).querySelector(q); }
function $all(q, el){ return [...(el||document).querySelectorAll(q)]; }
async function loadJSON(path){ const r = await fetch(path); return r.json(); }

async function loadAll(){
  const sLS = localStorage.getItem('dv_settings_override');
  const maintLS = localStorage.getItem('dv_maint') === '1';
  State.maint = maintLS;
  State.settings = sLS ? JSON.parse(sLS) : await loadJSON('data/settings.json');
  document.documentElement.setAttribute('data-theme', State.settings.primaryTheme);
  document.documentElement.style.setProperty('--font', State.settings.font);

  [State.events, State.blog, State.shop, State.timeline] = await Promise.all([
    loadJSON('data/events.json'),
    loadJSON('data/blog.json'),
    loadJSON('data/shop.json'),
    loadJSON('data/timeline.json')
  ]);

  initClock();
  initAudio();
  render();
  updateFooterTime();
  if(State.maint) showMaintenance(true);
}

function initClock(){
  const tick = ()=>{
    const d = new Date();
    const date = d.toLocaleDateString([], {weekday:'short', day:'2-digit', month:'short', year:'numeric'});
    const time = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const el = $('.clock');
    if(el) el.textContent = `${date} • ${time}`;
    const ft = $('#foot-time');
    if(ft) ft.textContent = d.toLocaleString();
    requestAnimationFrame(()=>{});
  };
  setInterval(tick, 1000);
  tick();
}

function initAudio(){
  State.audio = $('#ambient');
  // Restore volume
  const vol = parseFloat(localStorage.getItem('dv_vol')||'0.3');
  State.audio.volume = vol;
  $('#vol').value = vol;
  $('#vol').addEventListener('input', e=>{
    const v = parseFloat(e.target.value);
    State.audio.volume = v; localStorage.setItem('dv_vol', v);
  });
  $('#play').addEventListener('click', ()=>{
    if(State.audio.paused){ State.audio.play(); $('#play').textContent='Pause'; }
    else { State.audio.pause(); $('#play').textContent='Play'; }
  });
}

function navTo(hash){ window.location.hash = hash; render(); }
function active(h){ return (location.hash || '#home') === h ? 'active' : ''; }
function fmtDate(iso){ try{ const d = new Date(iso+'T00:00:00'); return d.toLocaleDateString([], {year:'numeric', month:'short', day:'numeric'});}catch(e){return iso} }
function countdown(dateStr, timeStr){
  const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
  const diff = target - new Date();
  if (diff <= 0) return 'Started';
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  return `${d}d ${h}h ${m}m`;
}

function renderHero(){
  const e = State.events[0] || {};
  return `
  <section class="container">
    <div class="grid grid-2">
      <div class="card">
        <img src="assets/images/hero.jpg" alt="Hero" style="width:100%; aspect-ratio:16/9; object-fit:cover">
        <div class="p">
          <h1>${State.settings.siteName}</h1>
          <p class="small">${State.settings.tagline}</p>
          <div class="grid grid-2">
            <div class="card"><div class="p">Next Event:<br><strong>${e.title||'TBA'}</strong></div></div>
            <div class="card"><div class="p">When:<br><strong>${e.date?fmtDate(e.date):'—'} ${e.time||''}</strong></div></div>
            <div class="card"><div class="p">Countdown:<br><strong>${e.date?countdown(e.date, e.time):'—'}</strong></div></div>
            <div class="card"><div class="p">Location:<br><strong>${e.location||'—'}</strong></div></div>
          </div>
          <div style="margin-top:12px">
            <button class="btn glow" onclick="navTo('#events')">View Events</button>
            <button class="btn" onclick="navTo('#donate')">Donate</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="p">
          <h2>Quick Links</h2>
          <div class="grid grid-2">
            <a class="btn" href="#about">About Us</a>
            <a class="btn" href="#blog">Blog</a>
            <a class="btn" href="#shop">Shop</a>
            <a class="btn" href="#contact">Contact</a>
          </div>
          <div style="margin-top:12px">
            <span class="badge">PWA Ready</span>
            <span class="badge">SEO Enabled</span>
            <span class="badge">Admin Panel</span>
          </div>
        </div>
        <img src="assets/images/gallery.jpg" alt="Gallery" style="width:100%; aspect-ratio:16/9; object-fit:cover">
      </div>
    </div>
  </section>`;
}

function renderEvents(){
  const today = new Date().toLocaleDateString([], {weekday:'short', day:'2-digit', month:'short', year:'numeric'});
  const cards = State.events.map(ev => `
  <div class="card">
    <img src="${ev.image}" alt="${ev.title}" style="width:100%; aspect-ratio:16/9; object-fit:cover">
    <div class="p">
      <h3>${ev.title}</h3>
      <div class="small">${fmtDate(ev.date)} • ${ev.time} • ${ev.location}</div>
      <div class="small">Countdown: ${countdown(ev.date, ev.time)}</div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
        <a class="btn glow" href="${ev.mapLink}" target="_blank" rel="noopener">Open Map</a>
        <a class="btn" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.date.replace(/-/g,'')}T${(ev.time||'10:00').replace(':','')}00Z/${ev.date.replace(/-/g,'')}T${(ev.time||'12:00').replace(':','')}00Z&details=${encodeURIComponent(ev.description)}&location=${encodeURIComponent(ev.location)}" target="_blank" rel="noopener">Add to Google Calendar</a>
      </div>
      <p style="margin-top:12px">${ev.description}</p>
    </div>
  </div>`).join('');
  return `<section class="section container"><h2>Events</h2><div class="small">Today: ${today}</div><div class="grid grid-3" style="margin-top:10px">${cards}</div></section>`;
}

function renderBlog(){
  const cards = State.blog.map(b => `
  <div class="card">
    <img src="${b.image}" alt="${b.title}" style="width:100%; aspect-ratio:16/9; object-fit:cover">
    <div class="p">
      <h3>${b.title}</h3>
      <div class="small">${fmtDate(b.date)} • ${b.author}</div>
      <p>${b.excerpt}</p>
      <details><summary>Read more</summary><p>${b.content}</p></details>
    </div>
  </div>`).join('');
  return `<section class="section container"><h2>Blog</h2><div class="grid grid-3">${cards}</div></section>`;
}

function renderAbout(){
  const items = State.timeline.map(t => `
    <div class="milestone">
      <div class="card"><div class="p">
        <div class="year mono">${t.year}</div>
        <h3>${t.title}</h3>
        <p class="small">${t.text}</p>
      </div></div>
    </div>`).join('');
  // Horizontal drag & auto-scroll
  return `
  <section class="section container">
    <div class="card">
      <img src="assets/images/about.jpg" alt="About" style="width:100%; aspect-ratio:16/9; object-fit:cover">
      <div class="p">
        <h2>About Us</h2>
        <p>DADVENTURES is a community for dads and kids to explore, bond, and grow. Travel our journey below.</p>
        <div class="timeline-wrap">
          <div class="timeline-line"></div>
          <div class="timeline" id="timeline">${items}</div>
        </div>
      </div>
    </div>
  </section>
  <script>
    const tl = document.getElementById('timeline');
    let isDown=false, startX, scrollLeft;
    tl.addEventListener('mousedown', (e)=>{isDown=true; tl.classList.add('grab'); startX=e.pageX - tl.offsetLeft; scrollLeft=tl.scrollLeft;});
    tl.addEventListener('mouseleave', ()=> isDown=false);
    tl.addEventListener('mouseup', ()=> isDown=false);
    tl.addEventListener('mousemove', (e)=>{ if(!isDown) return; e.preventDefault(); const x = e.pageX - tl.offsetLeft; const walk = (x - startX)*1.2; tl.scrollLeft = scrollLeft - walk; });
    // touch
    let tsX=0, tsL=0;
    tl.addEventListener('touchstart', (e)=>{tsX = e.touches[0].pageX; tsL = tl.scrollLeft;}, {passive:true});
    tl.addEventListener('touchmove', (e)=>{ const dx = e.touches[0].pageX - tsX; tl.scrollLeft = tsL - dx; }, {passive:true});
    // auto scroll (pause on hover)
    let dir=1;
    setInterval(()=>{ if(!tl.matches(':hover')) tl.scrollLeft += 0.6*dir; if(tl.scrollLeft <= 0 || tl.scrollLeft >= (tl.scrollWidth - tl.clientWidth-2)) dir *= -1; }, 30);
  </script>`;
}

function renderShop(){
  const cards = State.shop.map(s => `
    <div class="card">
      <img src="${s.image}" alt="${s.name}" style="width:100%; aspect-ratio:16/9; object-fit:cover">
      <div class="p">
        <h3>${s.name}</h3>
        <div class="small">£${s.price.toFixed(2)}</div>
        <p>${s.description}</p>
        <a class="btn glow" href="${s.url}">Buy (demo)</a>
      </div>
    </div>`).join('');
  return `<section class="section container"><h2>Shop</h2><div class="grid grid-3">${cards}</div></section>`;
}

function renderDonate(){
  return `
  <section class="section container">
    <div class="card">
      <img src="assets/images/donate.jpg" alt="Donate" style="width:100%; aspect-ratio:16/9; object-fit:cover">
      <div class="p">
        <h2>Donate</h2>
        <p>Your support helps us run inclusive, safe adventures. Try test links below (sandbox).</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
          <a class="btn glow" href="#" onclick="alert('Stripe test link placeholder')">Stripe (test)</a>
          <a class="btn" href="#" onclick="alert('PayPal test link placeholder')">PayPal (test)</a>
        </div>
      </div>
    </div>
  </section>`;
}

function renderContact(){
  return `
  <section class="section container">
    <div class="card">
      <img src="assets/images/contact.jpg" alt="Contact" style="width:100%; aspect-ratio:16/9; object-fit:cover">
      <div class="p">
        <h2>Contact Us</h2>
        <form name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact">
          <label>Name<input name="name" required></label>
          <label>Email<input type="email" name="email" required></label>
          <label>Message<textarea name="message" rows="4" required></textarea></label>
          <button class="btn glow" type="submit">Send</button>
        </form>
      </div>
    </div>
  </section>`;
}

function renderAdminBadge(){
  return `<a href="admin-panel.html" class="btn" style="position:fixed; right:14px; bottom:14px; z-index:99">Admin</a>`;
}

function render(){
  const hash = location.hash || '#home';
  $all('.navlinks a').forEach(a=>a.classList.remove('active'));
  $(`.navlinks a[href="${hash}"]`)?.classList.add('active');

  let html = '';
  if(hash==='#home'){ html += renderHero(); html += renderEvents(); html += renderBlog(); }
  if(hash==='#events'){ html += renderEvents(); }
  if(hash==='#blog'){ html += renderBlog(); }
  if(hash==='#about'){ html += renderAbout(); }
  if(hash==='#shop'){ html += renderShop(); }
  if(hash==='#donate'){ html += renderDonate(); }
  if(hash==='#contact'){ html += renderContact(); }

  $('#app').innerHTML = html + renderAdminBadge();
}

function updateFooterTime(){
  const ft = $('#foot-time'); if(ft) ft.textContent = new Date().toLocaleString();
}

function showMaintenance(on){
  const m = $('#maint');
  if(on){ m.classList.add('show'); }
  else { m.classList.remove('show'); }
}

window.addEventListener('hashchange', render);
window.addEventListener('load', loadAll);
