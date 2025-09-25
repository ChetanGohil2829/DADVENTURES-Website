(function(){
  function getHomeRoot(){
    const h = Array.from(document.querySelectorAll("h1,h2,strong"))
      .find(el => /adventures.*bring.*closer/i.test((el.textContent||"").trim()));
    return h ? (h.closest("section,article,main,div") || h.parentElement) : document;
  }
  function ensureLightbox(){
    if(document.getElementById("lightbox")) return;
    const lb = document.createElement("div");
    lb.id = "lightbox";
    lb.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:99999";
    lb.innerHTML = '<img id="lightbox-image" alt="" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 0 24px rgba(0,0,0,.6)"/>';
    document.body.appendChild(lb);
    lb.addEventListener("click", e => { if(e.target===lb) lb.style.display="none"; });
    document.addEventListener("keydown", e => { if(e.key==="Escape") lb.style.display="none"; });
  }
  function openLightbox(src){
    const img = document.getElementById("lightbox-image");
    const lb  = document.getElementById("lightbox");
    if(img && lb){ img.src = src; lb.style.display = "flex"; }
  }
  // function buildCard(box, id){
    const el = document.createElement("div");
    el.className = "card content-box home-card";
    el.dataset.id = id;
    el.style.textAlign = "left";
    if(box.image){
      const img = document.createElement("img");
      img.className = "home-box-img";
      img.loading = "lazy";
      img.alt = box.title || id;
      img.src = box.image + (box.image.indexOf("?")===-1 ? ("?v="+Date.now()) : "");
      img.addEventListener("click", ()=>openLightbox(img.src));
      el.appendChild(img);
    }
    if(box.title){
      const h = document.createElement("strong");
      h.textContent = /:$/.test(box.title) ? box.title : (box.title + ":");
      el.appendChild(h);
    }
    if(box.html || box.text){
      const p = document.createElement("p");
      p.className = "box-text";
      if(box.html){ p.innerHTML = box.html; } else { p.textContent = box.text; }
      el.appendChild(p);
    }
    if(!box.html && box.link){
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.className = "primary-link";
      a.href = box.link;
      a.textContent = "Learn more";
      p.appendChild(a);
      el.appendChild(p);
    }
    if(id==="involved" && !box.html && box.community && box.community.url){
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.className = "community-link";
      a.href = box.community.url;
      a.target = "_blank"; a.rel = "noopener";
      a.textContent = box.community.label || "Join our Community";
      p.appendChild(a);
      el.appendChild(p);
    }
    return el;
  }
  function rebuild(data){
    ensureLightbox();
    const root = getHomeRoot();
    if(!root) return;

    // Tagline directly under heading with extra spacing
    const heading = root.querySelector("h1,h2,strong");
    const tagline = Array.from(root.querySelectorAll("p,div"))
      .find(el => /From nature trails to camping trips and weekend explorations/i.test((el.textContent||"")));
    if(heading && tagline){
      heading.after(tagline);
      tagline.style.margin = "12px 0 28px";
    }

    // Remove any legacy/duplicate cards and wrappers
    root.querySelectorAll(".content-box.card, .home-cards-grid").forEach(el => el.remove());

    // Create wrapper after tagline
    const grid = document.createElement("div");
    grid.className = "home-cards-grid";
    grid.style.marginTop = "6px";
    if(heading && heading.parentElement===root){
      const after = heading.nextElementSibling && /From nature trails/.test((heading.nextElementSibling.textContent||"")) ? heading.nextElementSibling : heading;
      after.after(grid);
    }else{
      root.appendChild(grid);
    }

    const d = data && data.boxes ? data : { boxes: [] };
    const byId = {}; (d.boxes||[]).forEach(b => { if(b && b.id) byId[b.id] = b; });

    // Desired order stays: Upcoming, Blog, Shop, Involved
    ["upcoming","blog","shop","involved"].forEach(id => {
      const box = byId[id] || { id, title: id, link:"#"};
      grid.appendChild(buildCard(box, id));
    });

    // Safety: remove any remaining legacy cards not inside our grid
    root.querySelectorAll(".content-box.card").forEach(el => {
      if(!el.closest(".home-cards-grid")) el.remove();
    });

    
    // Final cleanup: remove any leftover boxes that aren't in our grid
    var patterns = /(Upcoming:|Latest Blog:|Shop:|Get Involved:)/i;
    Array.from(root.querySelectorAll('.content-box')).forEach(function(el){
      if(!el.closest('.home-cards-grid') && patterns.test((el.textContent||''))){
        el.remove();
      }
    });

    console.log("✅ Home rebuilt v3.5.40 — spacing set; duplicates removed; order enforced");
  }
  fetch("content/pages/home.json", {cache:"no-store"})
    .then(r => r.ok ? r.json() : null)
    .then(d => { if(d) rebuild(d); })
    .catch(console.warn);
})();