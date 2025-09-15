
(() => {
  const byId = id => document.getElementById(id);
  const qsa = sel => document.querySelectorAll(sel);

  const intro = byId('intro');
  const introMsg = byId('intro-message');
  const audio = byId('bg-music');
  const musicToggle = byId('music-toggle');
  const musicVol = byId('music-volume');
  const skipBtn = byId('skipBtn');

  // Footer year
  const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();

  // Typewriter on INTRO only
  const message = '✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
  let i = 0;
  (function typeEffect(){
    if(i < message.length){ introMsg.textContent += message.charAt(i++); setTimeout(typeEffect, 35); }
  })();

  // Music: autoplay muted + fade-in + gapless loop + global controls
  window.addEventListener('load', () => {
    audio.volume = 0;
    audio.play().then(() => {
      let v = 0;
      const fade = setInterval(() => {
        v += 0.05;
        if (v >= 0.7) { v = 0.7; clearInterval(fade); }
        audio.volume = v;
        musicVol.value = v.toFixed(2);
      }, 200);
    }).catch(()=>{});
  });
  audio.addEventListener('ended', () => { audio.currentTime = 0; audio.play(); });
  musicToggle.addEventListener('click', () => {
    if (audio.paused){ audio.play(); } else { audio.pause(); }
  });
  musicVol.addEventListener('input', e => { audio.volume = e.target.value; });

  // Router
  const routes = ['home','about','events','contact','shop'];
  function showRoute(id){
    routes.forEach(r => byId(r).classList.add('hidden'));
    byId(id).classList.remove('hidden');
    if (id === 'events') ensureCalendar();
  }
  qsa('[data-route]').forEach(el => el.addEventListener('click', e => {
    const t = e.currentTarget.getAttribute('data-route'); if (t) showRoute(t);
  }));

  // Intro -> Home after 10s (fade)
  function goHome(){
    intro.style.animation = 'fadeOut .5s ease forwards';
    setTimeout(() => { intro.classList.add('hidden'); showRoute('home'); }, 500);
  }
  setTimeout(goHome, 10000);
  skipBtn.addEventListener('click', goHome);

  // Load content
  fetch('content/home.md').then(r=>r.text()).then(t=>{ const el=byId('home-hero'); if(el) el.innerHTML=t; }).catch(()=>{});
  fetch('content/about.md').then(r=>r.text()).then(t=>{ const el=byId('about-content'); if(el) el.innerHTML=t; }).catch(()=>{});

  // Lazy init calendar on first visit
  let calendarInit = false;
  function ensureCalendar(){
    if (calendarInit) return; calendarInit = true;
    const el = byId('calendar'); if(!el) return;
    const cal = new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      events: async (info, success, failure) => {
        try{
          const res = await fetch('content/events/events.json?ts=' + Date.now());
          const data = await res.json(); success(data);
        }catch(err){ failure(err); }
      },
      eventClick: (info) => {
        const ev = info.event.extendedProps || {};
        const lines = [
          info.event.title || '',
          ev.location ? ('Location: ' + ev.location) : '',
          ev.details  ? ('Details: '  + ev.details)  : '',
          ev.map      ? ('Map: '      + ev.map)      : ''
        ].filter(Boolean);
        alert(lines.join('\n'));
        if (ev.map) window.open(ev.map, '_blank');
      }
    });
    cal.render();
  }

  // Shop grid (mock products)
  fetch('content/shop/products.json').then(r=>r.json()).then(items => {
    const grid = byId('shop-grid'); if(!grid) return;
    grid.innerHTML = items.map(p => `
      <div class="product">
        <div class="p-thumb"></div>
        <div class="p-name">${p.name}</div>
        <div class="p-price">£${p.price}</div>
        <a class="p-buy" href="${p.link}" target="_blank" rel="noopener">Buy</a>
      </div>
    `).join('');
  }).catch(()=>{});
})();
