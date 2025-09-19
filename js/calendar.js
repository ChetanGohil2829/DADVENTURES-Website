
(function(){
  function el(tag, cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }
  function render(root, data){
    const head=el('div','cal-head');
    const title=el('h3'); title.textContent='Events Calendar';
    const filters=el('div','cal-filters');
    const cats=['All',...Array.from(new Set(data.map(x=>x.route||'Trail')))];
    cats.forEach((c,i)=>{ const b=el('button','cal-chip'); b.textContent=c; if(i===0) b.classList.add('active'); b.addEventListener('click',()=>{
      filters.querySelectorAll('.cal-chip').forEach(x=>x.classList.remove('active')); b.classList.add('active');
      const arr = c==='All'? data : data.filter(x=>(x.route||'Trail')===c);
      grid.innerHTML=''; arr.forEach(add);
    }); filters.appendChild(b); });
    head.appendChild(title); head.appendChild(filters);
    const grid=el('div','cal-grid');
    function add(ev){
      const card=el('div','cal-card');
      const h=el('h4'); h.textContent=ev.title; card.appendChild(h);
      const meta=el('div'); meta.innerHTML = `<span class="badge">${ev.date}</span> <span class="badge">${ev.time}</span> <span class="badge">${ev.route}</span>`; card.appendChild(meta);
      const p=el('p'); p.textContent=ev.description||''; card.appendChild(p);
      const a=el('a'); a.href='events.html'; a.textContent='Details'; a.className='badge'; card.appendChild(a);
      grid.appendChild(card);
    }
    data.forEach(add);
    root.appendChild(head); root.appendChild(grid);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const root=document.getElementById('eventsCalendar'); if(!root) return;
    fetch('content/events.json').then(r=>r.json()).then(data=>render(root, data));
  });
})();
