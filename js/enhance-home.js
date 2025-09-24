
(function () {
  function getHomeContainer() {
    const h = Array.from(document.querySelectorAll("h1,h2,strong"))
      .find(el => /adventures.*bring.*closer/i.test((el.textContent || "").trim()));
    return h ? (h.closest("section,article,main,div") || h.parentElement) : document;
  }

  function lightbox() {
    if (document.getElementById("lightbox")) return;
    const lb = document.createElement("div");
    lb.id = "lightbox";
    lb.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:99999";
    lb.innerHTML =
      '<img id="lightbox-image" alt="" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 0 24px rgba(0,0,0,.6)"/>';
    document.body.appendChild(lb);
    function close() { lb.style.display = "none"; }
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    return lb;
  }

  function findCardByTitle(container, prefix) {
    const cards = Array.from(container.querySelectorAll(".card"));
    for (const card of cards) {
      const h = card.querySelector("strong,h3");
      if (!h) continue;
      const t = (h.textContent || "").trim();
      if (t.toLowerCase().startsWith(prefix.toLowerCase())) return card;
    }
    return null;
  }

  function insertAfter(node, newNode) {
    if (!node || !node.parentNode) return;
    if (node.nextSibling) node.parentNode.insertBefore(newNode, node.nextSibling);
    else node.parentNode.appendChild(newNode);
  }

  function setOrCreateImage(card, box, key, lb){
    if(!card || !box || !box.image) return;
    var img = card.querySelector('.home-box-img');
    var src = box.image + (box.image.indexOf('?')===-1 ? ('?v='+Date.now()) : '');
    if(img){
      img.src = src;
      img.alt = box.title || key;
    }else{
      img = document.createElement('img');
      img.className = 'home-box-img';
      img.loading = 'lazy';
      img.src = src;
      img.alt = box.title || key;
      card.insertBefore(img, card.firstChild);
      if (lb) {
        img.addEventListener("click", () => {
          document.getElementById("lightbox-image").src = img.src;
          lb.style.display = "flex";
        });
      }
    }
  }

  function commonAncestor(nodes){
    nodes = nodes.filter(Boolean);
    if(nodes.length===0) return null;
    function pathToRoot(n){
      var p=[]; while(n){ p.push(n); n=n.parentElement; } return p;
    }
    var p0 = pathToRoot(nodes[0]);
    for(var i=1;i<nodes.length;i++){
      var p = pathToRoot(nodes[i]);
      var found = null;
      for(var a of p0){
        if(p.includes(a)){ found = a; break; }
      }
      if(found){ p0 = pathToRoot(found); }
    }
    return p0[0] || null;
  }

  function enhance(data) {
    const container = getHomeContainer();

    // Remove previously injected extras (keep originals intact)
    container.querySelectorAll(".box-desc, .primary-link").forEach(el => el.remove());

    const d = data.boxes ? data : {
      boxes: [
        data.upcoming || {},
        data.shop || {},
        data.blog || {},
        data.involved || data.getinvolved || {}
      ]
    };
    const byId = {};
    (d.boxes || []).forEach(b => { if (b && b.id) byId[b.id] = b; });

    const lb = lightbox();

    // Find/ensure cards
    const upcomingCard = findCardByTitle(container, "Upcoming");
    const shopCard     = findCardByTitle(container, "Shop");
    let   blogCard     = findCardByTitle(container, "Latest Blog");
    const involvedCard = findCardByTitle(container, "Get Involved");

    // If Blog missing, create after Shop with its own text/link
    const blogBox = byId["blog"] || (d.boxes || []).find(b => b.id === "blog");
    if (!blogCard && shopCard && blogBox) {
      blogCard = document.createElement("div");
      blogCard.className = shopCard.className; // match style
      blogCard.innerHTML = "<strong>Latest Blog:</strong>";
      if (blogBox.text) {
        const p = document.createElement("p");
        p.className = "box-desc";
        p.textContent = blogBox.text;
        blogCard.appendChild(p);
      }
      if (blogBox.link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = blogBox.link;
        a.textContent = "Learn more";
        a.className = "primary-link";
        p.appendChild(a);
        blogCard.appendChild(p);
      }
      insertAfter(shopCard, blogCard);
    }

    // Always (re)set images for existing cards (prevents stale/broken src)
    setOrCreateImage(upcomingCard, byId["upcoming"] || (d.boxes || []).find(b => b.id === "upcoming"), "upcoming", lb);
    setOrCreateImage(shopCard,     byId["shop"]     || (d.boxes || []).find(b => b.id === "shop"),     "shop", lb);
    setOrCreateImage(blogCard,     blogBox, "blog", lb);
    setOrCreateImage(involvedCard, byId["involved"] || byId["getinvolved"] ||
                                  (d.boxes || []).find(b => b.id === "involved" || b.id === "getinvolved"),
                      "involved", lb);

    // Community link only in involved
    const involvedBox = byId["involved"] || byId["getinvolved"] ||
                        (d.boxes || []).find(b => b.id === "involved" || b.id === "getinvolved");
    if (involvedCard && involvedBox && involvedBox.community && involvedBox.community.url) {
      if (!involvedCard.querySelector(".community-link")) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = involvedBox.community.url;
        a.textContent = involvedBox.community.label || "Join our Community";
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "community-link";
        p.appendChild(a);
        involvedCard.appendChild(p);
      }
    }

    // Layout/order: use nearest common ancestor so all 4 share one parent
    var parent = commonAncestor([upcomingCard, blogCard, shopCard, involvedCard]) || container;
    if (parent){
      parent.classList.add('home-cards-grid');
      [upcomingCard, blogCard, shopCard, involvedCard].forEach(function(n){
        if(n && n.parentElement !== parent){ parent.appendChild(n); }
      });
    }

    // Left align safeguard
    [upcomingCard, blogCard, shopCard, involvedCard].forEach(function(n){
      if(n){ n.style.textAlign = 'left'; }
    });

    console.log("✅ Home enhanced (images & grid; common parent & cache-busted)");
  }

  fetch("content/pages/home.json", { cache: "no-store" })
    .then(r => r.ok ? r.json() : null)
    .then(d => { if (d) enhance(d); else console.warn("⚠️ home.json missing"); })
    .catch(e => console.warn("⚠️ home.json error", e));
})();
