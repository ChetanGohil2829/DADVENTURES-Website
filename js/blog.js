
(function(){
  const LIKE_KEY='dadventures.blog.likes';
  function getLikes(){ try{return JSON.parse(localStorage.getItem(LIKE_KEY)||'{}')}catch(e){return{}} }
  function setLikes(m){ try{localStorage.setItem(LIKE_KEY,JSON.stringify(m))}catch(e){} }

  function icon(name){
    if(name==='views') return '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>';
    if(name==='heart') return '<svg viewBox="0 0 24 24" fill="none"><path d="M12.1 20s-7.1-4.5-9.1-8.6C1.1 8.2 3 5 6.4 5c1.9 0 3.1 1 3.7 2 .6-1 1.8-2 3.7-2 3.4 0 5.3 3.2 3.4 6.4-2 4.1-9.1 8.6-9.1 8.6Z" stroke="currentColor" stroke-width="1.5"/></svg>';
    if(name==='dots') return '<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>';
    return '';
  }

  function render(posts){
    const wrap=document.querySelector('.blog-grid'); if(!wrap) return;
    const likes=getLikes();
    wrap.innerHTML = posts.map(p=>{
      const id=p.slug||p.title.replace(/\s+/g,'-').toLowerCase();
      const liked=!!likes[id];
      const views=p.views||0, likeCt=p.likes||0;
      return `
      <article class="blog-card">
        <div class="blog-media">
          <img src="${p.image||'images/logo-teepee.png'}" alt="${p.title}">
          <div class="blog-badge">${p.category||'General'}</div>
        </div>
        <div class="blog-body">
          <div class="blog-meta">
            <span>${p.author||'Dadventures'}</span>
            <span class="blog-dot"></span>
            <span>${p.date}</span>
          </div>
          <h3 class="blog-h4">${p.title}</h3>
          <p class="blog-excerpt">${p.excerpt||''}</p>
        </div>
        <div class="blog-actions">
          <span class="blog-iconbtn">${icon('views')} ${views}</span>
          <button class="blog-iconbtn blog-like ${liked?'active':''}" data-id="${id}" aria-label="Like">${icon('heart')} <span>${likeCt + (liked?1:0)}</span></button>
          <span class="blog-iconbtn">${icon('dots')}</span>
        </div>
      </article>`;
    }).join('');

    wrap.querySelectorAll('.blog-like').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id=btn.getAttribute('data-id'); const m=getLikes();
        m[id]=!m[id]; setLikes(m);
        btn.classList.toggle('active', !!m[id]);
        const n=btn.querySelector('span'); const base=parseInt(n.textContent)||0;
        n.textContent = m[id]? base+1 : Math.max(0, base-1);
      });
    });
  }

  function filterUI(posts){
    const bar=document.querySelector('.blog-filters'); if(!bar) return;
    const cats=['All',...Array.from(new Set(posts.map(p=>p.category||'General')))];
    bar.innerHTML = cats.map((c,i)=>`<button class="blog-chip ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('');
    bar.querySelectorAll('.blog-chip').forEach(chip=>chip.addEventListener('click',()=>{
      bar.querySelectorAll('.blog-chip').forEach(x=>x.classList.remove('active'));
      chip.classList.add('active');
      const cat=chip.getAttribute('data-cat');
      if(cat==='All') render(posts); else render(posts.filter(p=>(p.category||'General')===cat));
    }));
  }

  fetch('content/blog.json').then(r=>r.json()).then(posts=>{ filterUI(posts); render(posts); });
})();
