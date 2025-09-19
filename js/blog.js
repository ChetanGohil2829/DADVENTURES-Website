
(function(){
  const LIKE_KEY='dadventures.blog.likes'; const VIEW_KEY='dadventures.blog.views';
  function get(k){ try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return{}} }
  function set(k,m){ try{localStorage.setItem(k,JSON.stringify(m))}catch(e){} }
  function icon(name){
    if(name==='views') return '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>';
    if(name==='heart') return '<svg viewBox="0 0 24 24" fill="none"><path d="M12.1 20s-7.1-4.5-9.1-8.6C1.1 8.2 3 5 6.4 5c1.9 0 3.1 1 3.7 2 .6-1 1.8-2 3.7-2 3.4 0 5.3 3.2 3.4 6.4-2 4.1-9.1 8.6-9.1 8.6Z" stroke="currentColor" stroke-width="1.5"/></svg>';
    if(name==='dots') return '<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>';
    return '';
  }
  function openPost(slug){ const v=get(VIEW_KEY); v[slug]=(v[slug]||0)+1; set(VIEW_KEY,v); location.href='blog-post.html?p='+encodeURIComponent(slug); }
  function render(posts){
    const wrap=document.querySelector('.blog-grid'); if(!wrap) return;
    const likes=get(LIKE_KEY), views=get(VIEW_KEY);
    wrap.innerHTML = posts.map(p=>{
      const id=p.slug||p.title.replace(/\s+/g,'-').toLowerCase();
      const liked=!!likes[id]; const vc=(p.views||0)+(views[id]||0);
      return `
      <article class="blog-card" data-slug="${id}">
        <div class="blog-media"><img src="${p.image||'images/logo-teepee.png'}" alt="${p.title}"><div class="blog-badge">${p.category||'General'}</div></div>
        <div class="blog-body">
          <div class="blog-meta"><span>${p.author||'Dadventures'}</span><span class="blog-dot"></span><span>${p.date}</span></div>
          <h3 class="blog-h4">${p.title}</h3><p class="blog-excerpt">${p.excerpt||''}</p>
        </div>
        <div class="blog-actions">
          <span class="blog-iconbtn">${icon('views')} <span class="v">${vc}</span></span>
          <button class="blog-iconbtn blog-like ${liked?'active':''}" data-id="${id}" aria-label="Like">${icon('heart')} <span class="c">${p.likes||0 + (liked?1:0)}</span></button>
          <button class="blog-iconbtn blog-dots" aria-label="More">${icon('dots')}</button>
        </div>
      </article>`; }).join('');

    wrap.querySelectorAll('.blog-card').forEach(card=>{
      card.addEventListener('click',(e)=>{ if(e.target.closest('.blog-actions')) return; openPost(card.dataset.slug); });
    });
    wrap.querySelectorAll('.blog-like').forEach(btn=>btn.addEventListener('click',(e)=>{
      e.stopPropagation(); const id=btn.getAttribute('data-id'); const m=get(LIKE_KEY); m[id]=!m[id]; set(LIKE_KEY,m);
      btn.classList.toggle('active',!!m[id]); const n=btn.querySelector('.c'); const base=parseInt(n.textContent)||0; n.textContent = m[id]? base+1 : Math.max(0, base-1);
    }));
    wrap.querySelectorAll('.blog-dots').forEach(btn=>btn.addEventListener('click',(e)=>{
      e.stopPropagation(); const slug=btn.closest('.blog-card').dataset.slug;
      const url=location.origin+location.pathname.replace(/[^/]*$/,'')+'blog-post.html?p='+encodeURIComponent(slug);
      navigator.clipboard.writeText(url);
      btn.textContent='Copied'; setTimeout(()=>btn.innerHTML=icon('dots'),1200);
    }));
  }
  fetch('content/blog.json').then(r=>r.json()).then(posts=>render(posts));
})();
