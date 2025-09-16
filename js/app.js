(function(){
  // Settings
  let SETTINGS={theme:{},links:{},payments:{}};
  fetch("data/settings.json").then(r=>r.json()).then(j=>SETTINGS=j);

  // Welcome typing
  window.addEventListener("DOMContentLoaded", ()=>{
    const el = document.getElementById("welcomeText");
    if(el){
      const msg = "Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.";
      fetch("data/settings.json").then(r=>r.json()).then(cfg=>{
        const spd = cfg.theme.welcomeSpeedMs||28;
        let i=0; (function type(){ if(i<msg.length){ el.textContent += msg[i++]; setTimeout(type, spd); } })();
        const delay = (cfg.theme.welcomeDelayToHomeSec||30)*1000;
        setTimeout(()=>{ window.location.href="home.html"; }, delay);
      });
    }
  });

  // Music (element-based, mobile unlock)
  window.addEventListener("DOMContentLoaded", ()=>{
    const audio = document.getElementById("bgAudio");
    const btn = document.getElementById("playBtn");
    const vol = document.getElementById("volume");
    if(!audio || !btn || !vol) return;

    audio.loop = true;
    audio.volume = 0.65;
    function toggle(){
      if(audio.paused){ audio.play().then(()=>{ btn.textContent="Pause"; }).catch(()=>{}); }
      else { audio.pause(); btn.textContent="Play"; }
    }
    btn.addEventListener("click", toggle);
    vol.addEventListener("input", ()=>{ audio.volume = +vol.value; });
  });

  // Donate links
  window.addEventListener("DOMContentLoaded", ()=>{
    fetch("data/settings.json").then(r=>r.json()).then(c=>{
      const h = document.getElementById("donateHeader"); if(h) h.href = c.payments.stripeTestLink||"#";
      const f = document.getElementById("donateFooter"); if(f) f.href = c.payments.paypalSandboxLink||"#";
      const fb = document.getElementById("linkFB"); if(fb) fb.href = c.links.facebook||"#";
      const ig = document.getElementById("linkIG"); if(ig) ig.href = c.links.instagram||"#";
    });
  });

  // Search (Home/About text + products)
  function productCard(p){
    return `<div class="card">
      <img src="${p.img}" alt="${p.name}" style="width:100%;height:200px;object-fit:cover;border-radius:10px;border:1px solid rgba(240,208,128,0.2)"/>
      <h3>${p.name}</h3><p>Â£${p.price}</p>
      <a class="btn" href="${p.pay}" target="_blank" rel="noopener">Buy</a>
    </div>`;
  }

  async function runSearch(){
    const box = document.getElementById("siteSearch");
    const out = document.getElementById("homeResults");
    if(!box || !out) return;
    const q = box.value.trim().toLowerCase();
    out.innerHTML = "";
    if(!q) return;

    const hits=[];
    // Home text
    const homeTxt = document.getElementById("homeText")?.textContent.toLowerCase()||"";
    if(homeTxt.includes(q)) hits.push(`<div class="card"><h3>Home</h3><p>Text match found.</p></div>`);
    // About text
    try{
      const t = await fetch("about.html").then(r=>r.text());
      const m = t.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      const a = (m?m[1]:t).replace(/<[^>]+>/g," ").toLowerCase();
      if(a.includes(q)) hits.push(`<div class="card"><h3>About</h3><p>Text match found.</p><a class="btn" href="about.html">Open</a></div>`);
    }catch(_){}
    // Products
    try{
      const ps = await fetch("data/products.json").then(r=>r.json());
      ps.filter(p=>p.name.toLowerCase().includes(q)).forEach(p=>hits.push(productCard(p)));
    }catch(_){}
    out.innerHTML = hits.length? hits.join("") : `<div class="card"><p>No results.</p></div>`;
  }
  window.addEventListener("DOMContentLoaded", ()=>{
    const box = document.getElementById("siteSearch");
    const btn = document.getElementById("searchBtn");
    if(box && btn){ btn.addEventListener("click", runSearch); box.addEventListener("keydown", e=>{ if(e.key==="Enter") runSearch(); }); }
  });

  // Events page wire-up
  window.addEventListener("DOMContentLoaded", ()=>{
    const calEl = document.getElementById("calendar");
    if(!calEl) return;
    fetch("data/events.json").then(r=>r.json()).then(data=>{
      const mapped = data.map(e=>({
        title:e.title, start:e.start, end:e.end,
        extendedProps:{location:e.location,map:e.map,route:e.route,image:e.image,description:e.description}
      }));
      const cal = new FullCalendar.Calendar(calEl, {
        initialView:"dayGridMonth", height:"auto", events:mapped,
        eventClick:(info)=>openEventModal(info.event)
      });
      cal.render();
    });
  });

  window.openEventModal = function(ev){
    const wrap = document.createElement("div");
    wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:9999";
    const card = document.createElement("div");
    card.className="card"; card.style.cssText="max-width:760px;width:92vw";
    card.innerHTML = `
      <h3>${ev.title}</h3>
      <p><span class="badge">When</span> ${new Date(ev.start).toLocaleString()} ${ev.end?(" - "+new Date(ev.end).toLocaleString()):""}</p>
      <p><span class="badge">Where</span> ${ev.extendedProps.location} â€” <a class="btn" href="${ev.extendedProps.map}" target="_blank" rel="noopener">Open map</a></p>
      <p><span class="badge">Route</span> ${ev.extendedProps.route||""}</p>
      ${ev.extendedProps.image? `<img src="${ev.extendedProps.image}" style="width:100%;height:240px;object-fit:cover;border-radius:10px;border:1px solid rgba(240,208,128,0.2)"/>`:``}
      <p>${ev.extendedProps.description||""}</p>
      <div id="cd" class="badge" style="margin-top:8px">Loading countdown...</div>
      <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" onclick="document.body.removeChild(document.getElementById('evModalWrap'))">Close</button>
      </div>`;
    const shell = document.createElement("div"); shell.id="evModalWrap"; shell.appendChild(card);
    wrap.appendChild(shell); document.body.appendChild(wrap);
    function tick(){
      const out=document.getElementById("cd"); if(!out) return;
      const diff = new Date(ev.start)-new Date();
      if(diff<=0){ out.textContent="Event started"; return; }
      const d=Math.floor(diff/86400000), h=Math.floor(diff%86400000/3600000), m=Math.floor(diff%3600000/60000), s=Math.floor(diff%60000/1000);
      out.textContent = `Starts in: ${d}d ${h}h ${m}m ${s}s`;
      requestAnimationFrame(tick);
    } tick();
  };

})();
