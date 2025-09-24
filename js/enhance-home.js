(async function(){
  try {
    const res = await fetch('./content/pages/home.json', {cache:'no-store'});
    if (!res.ok) { console.warn("⚠️ home.json not found"); return; }
    const data = await res.json();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const text = card.textContent;
      let type = '';
      if (/Upcoming:/i.test(text)) type = 'upcoming';
      if (/Shop:/i.test(text)) type = 'shop';
      if (/Get Involved:/i.test(text)) type = 'getinvolved';
      const cfg = data[type];
      if (!cfg) return;

      // add image
      if (cfg.image && !card.querySelector('.home-box-img')) {
        const img = document.createElement('img');
        img.src = cfg.image;
        img.className = 'home-box-img';
        card.insertBefore(img, card.firstChild);
      }

      // add community link
      if (type === 'getinvolved' && cfg.community_url) {
        if (!card.querySelector('.community-link')) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = cfg.community_url;
          a.textContent = cfg.community_label;
          a.target = "_blank";
          a.className = "community-link";
          p.appendChild(a);
          card.appendChild(p);
        }
      }
    });
    console.log("✅ Home cards enhanced from CMS");
  } catch(e) {
    console.error("❌ Failed to enhance Home cards", e);
  }
})();