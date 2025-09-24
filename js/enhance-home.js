
(function(){
  function lightbox(){
    if(document.getElementById('lightbox')) return;
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:99999';
    lb.innerHTML = '<img id="lightbox-image" alt="" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 0 24px rgba(0,0,0,.6)"/>';
    document.body.appendChild(lb);
    function close(){ lb.style.display='none'; }
    lb.addEventListener('click', e=>{ if(e.target===lb) close(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
    return lb;
  }

  function enhance(data){
    var cards = Array.from(document.querySelectorAll('.card'));
    if(!cards.length) return;
    var lb = lightbox();

    // Map IDs to cards by keyword in content
    var map = {'upcoming':/Upcoming:/i,'shop':/Shop:/i,'blog':/Latest Blog/i,'involved':/Get Involved:/i};
    cards.forEach(function(card){
      var txt = card.textContent || '';
      var key = Object.keys(map).find(k => map[k].test(txt));
      if(!key) return;
      var box = (data.boxes || []).find(b => b.id===key) || data[key] || null;
      if(!box) return;

      // Image insert (top) if not present
      if(box.image && !card.querySelector('.home-box-img')){
        var img = document.createElement('img');
        img.src = box.image;
        img.alt = box.title || key;
        img.className = 'home-box-img';
        img.loading = 'lazy';
        card.insertBefore(img, card.firstChild);
        if(lb){
          img.addEventListener('click', function(){
            document.getElementById('lightbox-image').src = img.src;
            lb.style.display = 'flex';
          });
        }
      }

      // Title / text override if provided
      if(box.title){
        var strong = card.querySelector('strong,h3');
        if(strong) strong.textContent = box.title + (/:$/.test(strong.textContent)?':':'');
      }
      if(box.text){
        // Append a paragraph with text if not already present
        if(!card.querySelector('.box-desc')){
          var p = document.createElement('p');
          p.className = 'box-desc';
          p.textContent = box.text;
          card.appendChild(p);
        }
      }

      // Link handling
      if(key==='involved' && box.community && box.community.url && !card.querySelector('.community-link')){
        var p2 = document.createElement('p');
        var a = document.createElement('a');
        a.href = box.community.url;
        a.textContent = box.community.label || 'Join our Community';
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'community-link';
        p2.appendChild(a);
        card.appendChild(p2);
      } else if(box.link && !card.querySelector('.primary-link')){
        var p3 = document.createElement('p');
        var a2 = document.createElement('a');
        a2.href = box.link;
        a2.textContent = 'Learn more';
        a2.className = 'primary-link';
        p3.appendChild(a2);
        card.appendChild(p3);
      }
    });

    console.log('✅ Home enhanced from CMS');
  }

  fetch('content/pages/home.json', {cache:'no-store'})
    .then(r => r.ok ? r.json() : null)
    .then(d => { if(d) enhance(d); else console.warn('⚠️ home.json missing'); })
    .catch(e => console.warn('⚠️ home.json error', e));
})();
