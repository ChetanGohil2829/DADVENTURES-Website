
// Render Home Boxes from CMS JSON + Lightbox
(function(){
  function setupLightbox(){
    if(document.getElementById('lightbox')) return;
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.position='fixed';
    lb.style.inset='0';
    lb.style.background='rgba(0,0,0,0.75)';
    lb.style.display='none';
    lb.style.alignItems='center';
    lb.style.justifyContent='center';
    lb.style.zIndex='99999';
    lb.innerHTML = '<img id="lightbox-image" alt="" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 0 24px rgba(0,0,0,.6)"/>';
    document.body.appendChild(lb);
    function close(){ lb.style.display='none'; }
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
    return lb;
  }

  // // function renderBoxes(data){ // Disabled to prevent bottom boxes rendering
    var container = document.querySelector('.home-boxes');
    if(!container || !data || !Array.isArray(data.boxes)) return;
    container.innerHTML = '';
    data.boxes.forEach(function(box){
      var div = document.createElement('article');
      div.className = 'card content-box';
      var imgHtml = box.image ? '<img src="'+box.image+'" alt="'+(box.title||'')+'" class="home-box-img"/>' : '';
      var linkHtml = (box.community && box.community.url && box.community.label)
        ? '<p><a href="'+box.community.url+'" target="_blank" rel="noopener">'
          + box.community.label + '</a></p>'
        : (box.link ? '<p><a href="'+box.link+'">Learn more</a></p>' : '');
      div.innerHTML = imgHtml
        + '<h3>'+ (box.title||'') +'</h3>'
        + '<p>'+ (box.text||'') +'</p>'
        + linkHtml;
      container.appendChild(div);
    });

    // Lightbox clicks
    var lb = setupLightbox();
    if(lb){
      container.querySelectorAll('.home-box-img').forEach(function(img){
        img.addEventListener('click', function(){
          document.getElementById('lightbox-image').src = img.src;
          lb.style.display = 'flex';
        });
      });
    }
  }

  async function loadHomeBoxes(){
    try{
      var res = await fetch('/content/pages/home.json', {cache:'no-store'});
      if(!res.ok) return;
      var data = await res.json();
      renderBoxes(data);
    }catch(e){ /* ignore */ }
  }

  // Expose globally so router template can call it after render
  window.renderHomeBoxes = loadHomeBoxes;
})();
