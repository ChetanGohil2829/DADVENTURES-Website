(function () {
  function getHomeContainer() {
    // Find the "Adventures that bring us closer" heading and scope to its section
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

  function addImage(card, box, key, lb) {
    if (!card || !box || !box.image || card.querySelector(".home-box-img")) return;
    const img = document.createElement("img");
    img.src = box.image;
    img.alt = box.title || key;
    img.className = "home-box-img";
    img.loading = "lazy";
    card.insertBefore(img, card.firstChild);
    if (lb) {
      img.addEventListener("click", () => {
        document.getElementById("lightbox-image").src = img.src;
        lb.style.display = "flex";
      });
    }
  }

  function enhance(data) {
    const container = getHomeContainer();

    // Clean up any previously injected extra text/links (won't touch original content)
    container.querySelectorAll(".box-desc, .primary-link").forEach(el => el.remove());

    // Normalize data format
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

    // Target only the four Home cards
    const upcomingCard = findCardByTitle(container, "Upcoming");
    const shopCard     = findCardByTitle(container, "Shop");
    let   blogCard     = findCardByTitle(container, "Latest Blog");
    const involvedCard = findCardByTitle(container, "Get Involved");

    // If Blog card is missing, create it after Shop (with its own text + Learn more)
    const blogBox = byId["blog"] || (d.boxes || []).find(b => b.id === "blog");
    if (!blogCard && shopCard && blogBox) {
      blogCard = document.createElement("div");
      blogCard.className = "card content-box";
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

    // Add decorative images only (no extra text/links) to existing cards
    addImage(upcomingCard, byId["upcoming"] || (d.boxes || []).find(b => b.id === "upcoming"), "upcoming", lb);
    addImage(shopCard,     byId["shop"]     || (d.boxes || []).find(b => b.id === "shop"),     "shop", lb);
    addImage(blogCard,     blogBox, "blog", lb);
    addImage(involvedCard, byId["involved"] || byId["getinvolved"] ||
                           (d.boxes || []).find(b => b.id === "involved" || b.id === "getinvolved"),
             "involved", lb);

    // Add community link only inside Get Involved (if not present)
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

    console.log("✅ Home enhanced (images only; no duplicate text)");
  }

  fetch("content/pages/home.json", { cache: "no-store" })
    .then(r => r.ok ? r.json() : null)
    .then(d => { if (d) enhance(d); else console.warn("⚠️ home.json missing"); })
    .catch(e => console.warn("⚠️ home.json error", e));
})();