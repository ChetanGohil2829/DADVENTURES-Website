(function(){
  function homeContainer(){
    const h = Array.from(document.querySelectorAll('h1,h2,strong'))
      .find(el => /adventures.*bring.*closer/i.test((el.textContent||'').trim()));
    return h ? (h.closest('section,article,main,div') || h.parentElement) : document;
  }

  function ensureLightbox(){
    if(document.getElementById('lightbox')) return;
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:99999';
    lb.innerHTML = '<img id="lightbox-image" alt="" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 0 24px rgba(0,0,0,.6)"/>';
    document.body.appendChild(lb);
    lb.addEventListener('click', e => { if(e.target===lb) lb.style.display='none'; });
    document.addEventListener('keydown', e => { if(e.key==='Escape') lb.style.display='none'; });
  }
  function openLightbox(src){
    const img = document.getElementById('lightbox-image');
    const lb  = document.getElementById('lightbox');
    if(img && lb){ img.src = src; lb.style.display = 'flex'; }
  }

  function card(box, key){
    const el = document.createElement('div');
    el.className = 'card content-box home-card';
    el.dataset.id = key;
    el.style.textAlign = 'left';

    if(box.image){
      const img = document.createElement('img');
      img.className = 'home-box-img';
      img.loading = 'lazy';
      img.alt = box.title || key;
      img.src = box.image + (box.image.indexOf('?')===-1 ? ('?v='+Date.now()) : '');
      img.addEventListener('click', ()=>openLightbox(img.src));
      el.appendChild(img);
    }

    if(box.title){
      const h = document.createElement('strong');
      h.textContent = /:$/.test(box.title) ? box.title : (box.title + ':');
      el.appendChild(h);
    }

    if(box.text){
      const p = document.createElement('p');
      p.className = 'box-text';
      p.textContent = box.text;
      el.appendChild(p);
    }

    if(box.link){
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.className = 'primary-link';
      a.href = box.link;
      a.textContent = 'Learn more';
      p.appendChild(a);
      el.appendChild(p);
    }

    if(key==='involved' && box.community && box.community.url){
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.className = 'community-link';
      a.href = box.community.url;
      a.target = '_blank'; a.rel='noopener';
      a.textContent = box.community.label || 'Join our Community';
      p.appendChild(a);
      el.appendChild(p);
    }

    return el;
  }

  function rebuild(d){
    ensureLightbox();
    const root = homeContainer();
    if(!root) return;

    // remove legacy/injected boxes and wrappers in HOME only
    root.querySelectorAll('.home-cards-grid, .content-box.card').forEach(el => el.remove());

    // wrapper
    const grid = document.createElement('div');
    grid.className = 'home-cards-grid';
    const heading = root.querySelector('h1,h2,strong');
    if(heading && heading.parentElement===root && heading.nextSibling){
      root.insertBefore(grid, heading.nextSibling);
    }else{
      root.appendChild(grid);
    }

    // normalize data
    const data = d && d.boxes ? d : {
      boxes: [
        d.upcoming || {},
        d.shop || {},
        d.blog || {},
        d.involved || d.getinvolved || {}
      ]
    };
    const byId = {}; (data.boxes||[]).forEach(b=>{ if(b && b.id) byId[b.id] = b; });

    // order requested: Upcoming, Shop, Latest Blog, Get Involved
    const list = [
      byId['upcoming'] || (data.boxes||[]).find(b=>b.id==='upcoming') || {id:'upcoming', title:'Upcoming', link:'/events'},
      byId['shop']     || (data.boxes||[]).find(b=>b.id==='shop')     || {id:'shop', title:'Shop', link:'/shop'},
      byId['blog']     || (data.boxes||[]).find(b=>b.id==='blog')     || {id:'blog', title:'Latest Blog', link:'/blog'},
      byId['involved'] || byId['getinvolved'] ||
        (data.boxes||[]).find(b=>b.id==='involved'||b.id==='getinvolved') ||
        {id:'involved', title:'Get Involved', link:'/contact', community:{url:'https://chat.whatsapp.com/your-community-link'}}
    ];

    list.forEach(b=>{
      const key = (b.id==='getinvolved') ? 'involved' : b.id;
      grid.appendChild(card(b, key));
    });

    console.log('✅ Rebuilt Home cards (v3.5.35, order: Upcoming, Shop, Blog, Involved)');
  }

  fetch('content/pages/home.json', {cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(rebuild)
    .catch(console.warn);
})();