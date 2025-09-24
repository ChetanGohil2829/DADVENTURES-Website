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

  function buildCard(box, id){
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

    // Move tagline under heading with spacing
    const heading = root.querySelector("h1,h2,strong");
    const tagline = Array.from(root.querySelectorAll("p,div"))
      .find(el => /From nature trails to camping trips and weekend explorations/i.test((el.textContent||"")));
    if(heading && tagline){
      heading.after(tagline);
      tagline.style.margin = "10px 0 18px";
    }

    // Remove ANY legacy cards in the home section
    root.querySelectorAll(".content-box.card").forEach(el => el.remove());
    root.querySelectorAll(".home-cards-grid").forEach(el => el.remove());

    // Create wrapper
    const grid = document.createElement("div");
    grid.className = "home-cards-grid";
    if(heading && heading.parentElement===root){
      const after = heading.nextElementSibling && /From nature trails/.test((heading.nextElementSibling.textContent||"")) ? heading.nextElementSibling : heading;
      after.after(grid);
    }else{
      root.appendChild(grid);
    }

    // Normalize data and ID map
    const d = data && data.boxes ? data : { boxes: [] };
    const byId = {}; (d.boxes||[]).forEach(b => { if(b && b.id) byId[b.id] = b; });

    // Order REQUIRED: Upcoming, Blog, Shop, Involved
    const orderIds = ["upcoming","blog","shop","involved"];
    orderIds.forEach(id => {
      let box = byId[id];
      if(!box){
        // basic fallback
        const title = id==="blog" ? "Latest Blog" :
                      id==="involved" ? "Get Involved" :
                      id[0].toUpperCase()+id.slice(1);
        box = { id, title, link: id==="blog"?"/blog" : id==="shop"?"/shop" : id==="upcoming"?"/events" : "/contact" };
      }
      grid.appendChild(buildCard(box, id));
    });

    console.log("✅ Home rebuilt (v3.5.39) — order: Upcoming, Blog, Shop, Involved; duplicates removed");
  }

  fetch("content/pages/home.json", {cache: "no-store"})
    .then(r => r.ok ? r.json() : null)
    .then(d => { if(d) rebuild(d); })
    .catch(console.warn);
})();