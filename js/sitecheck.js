(function(){
  const log=[]; const add = m=>{log.push(m);};
  function render(){ const el=document.getElementById("debugLog"); if(el){ el.textContent=log.join("\n"); } }
  async function urlOk(u){ try{ const r=await fetch(u,{method:"HEAD"}); return r.ok; }catch(e){ return false; } }
  async function check(){
    add(`[${new Date().toLocaleTimeString()}] Site Check Started`);

    // Music
    try{
      const a = document.getElementById("bgAudio");
      const playBtn = document.getElementById("playBtn");
      const vol = document.getElementById("volume");
      if(a && playBtn && vol){ add("Audio: âœ… controls present"); } else { add("Audio: âŒ controls missing"); }
    }catch(e){ add("Audio: âŒ error "+e.message); }

    // Nav + socials
    try{
      const need = ["linkHome","linkAbout","linkEvents","linkContact","linkShop"];
      const ok = need.every(id=>document.getElementById(id));
      add(ok? "Nav: âœ… all tabs present":"Nav: âŒ missing tabs");
      const fb = document.getElementById("linkFB")?.href||"";
      const ig = document.getElementById("linkIG")?.href||"";
      add((fb.includes("http")&&ig.includes("http"))?"Socials: âœ… ok":"Socials: âŒ missing/placeholder");
    }catch(e){ add("Nav: âŒ error "+e.message); }

    // Search
    try{
      const s = document.getElementById("siteSearch");
      add(s? "Search: âœ… present":"Search: âŒ not found");
    }catch(e){ add("Search: âŒ error "+e.message); }

    // Data files
    try{
      const ev = await fetch("data/events.json").then(r=>r.json()); add(`Events: âœ… loaded ${ev.length}`);
    }catch(_){ add("Events: âŒ cannot load data/events.json"); }
    try{
      const pr = await fetch("data/products.json").then(r=>r.json()); add(`Shop: âœ… loaded ${pr.length} products`);
    }catch(_){ add("Shop: âŒ cannot load data/products.json"); }

    // Images required
    const images = ["images/logo.svg","images/bg-bronze-net.svg","images/welcome-bonsai.svg"];
    for(const p of images){ add(await urlOk(p)? `Image: âœ… ${p}`:`Image: âŒ ${p} missing`); }

    // Payments
    try{
      const stripe = document.getElementById("donateHeader")?.href||"";
      const paypal = document.getElementById("donateFooter")?.href||"";
      add((stripe && paypal)? "Donations: âœ… links set" : "Donations: âŒ links missing");
    }catch(e){ add("Donations: âŒ error"); }

    // Contact form presence
    add(document.querySelector("form[name='contact']")? "Contact: âœ… form present":"Contact: âŒ form missing");

    // Admin link check (file exists)
    add(await urlOk("admin/index.html")? "CMS: âœ… admin placeholder reachable":"CMS: âŒ admin missing");

    add("Site Check Complete");
    render();
  }
  window.DADDBG = {add,render,check};
  window.addEventListener("load", ()=>{ setTimeout(()=>check(), 250); });
})();
