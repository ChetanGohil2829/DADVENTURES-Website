
(() => {
  const byId = id => document.getElementById(id);
  const $all = sel => document.querySelectorAll(sel);

  const intro = byId('intro');
  const bgm = byId('bgm');
  const playPause = byId('playPause');
  const volume = byId('volume');
  const skipBtn = byId('skipBtn');

  // Year in footer
  const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();

  // Typewriter message
  const typeWrap = document.querySelector('.intro-message');
  const message = '✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.';
  let i = 0;
  (function typeEffect(){
    if(i < message.length){ typeWrap.textContent += message.charAt(i++); setTimeout(typeEffect, 40); }
  })();

  // Autoplay policy: start on first interaction
  const kick = () => { if(bgm && bgm.paused){ bgm.play().catch(()=>{});} };
  document.body.addEventListener('click', kick, { once:true });
  document.body.addEventListener('touchstart', kick, { once:true });

  // Controls
  playPause.addEventListener('click', () => { if (bgm.paused){ bgm.play(); } else { bgm.pause(); } });
  volume.addEventListener('input', e => { bgm.volume = e.target.value; });

  // Simple router
  const routes = ['home','about','events','contact','shop'];
  function showRoute(id){
    routes.forEach(r => byId(r).classList.add('hidden'));
    byId(id).classList.remove('hidden');
  }

  // Auto transition to Home after 10s (fade)
  function goHome(){
    intro.style.animation = 'fadeOut .5s ease forwards';
    setTimeout(() => { intro.classList.add('hidden'); showRoute('home'); }, 500);
  }
  setTimeout(goHome, 10000);
  skipBtn.addEventListener('click', goHome);

  // Router clicks
  $all('[data-route]').forEach(el => el.addEventListener('click', e => {
    const t = e.currentTarget.getAttribute('data-route'); if(t) showRoute(t);
  }));

  // Load content
  fetch('content/home.md').then(r=>r.text()).then(t=>{ const el = document.getElementById('home-hero'); if(el) el.innerHTML = t; }).catch(()=>{});
  fetch('content/about.md').then(r=>r.text()).then(t=>{ const el = document.getElementById('about-content'); if(el) el.innerHTML = t; }).catch(()=>{});

  // Calendar
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('calendar'); if(!el) return;
    const calendar = new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      events: async (info, success, failure) => {
        try {
          const res = await fetch('content/events/events.json?ts=' + Date.now());
          const data = await res.json(); success(data);
        } catch(err) { failure(err); }
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
    calendar.render();
  });

  // Shop
  fetch('content/shop/products.json').then(r=>r.json()).then(items=>{
    const list = document.getElementById('shop-items'); if(!list) return;
    items.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `${p.name} — £${p.price} <a href="${p.link}" target="_blank" rel="noopener">Buy</a>`;
      list.appendChild(li);
    });
  }).catch(()=>{});
})();
