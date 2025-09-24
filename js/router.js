// SPA Router v3.5.11 (embedded templates)
const PAGES = {
  'home': `
</div>
<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>
<main class="container">
<div class="searchbar with-icon">
<img alt="search icon" src="images/logo-icon.svg" style="height:20px"/>
<input aria-label="Search" id="search" placeholder="Search" type="search"/>
<button aria-label="Run search" class="btn" id="searchBtn">Search</button>
</div>
<section class="hero card">
<h1>Adventures that bring us closer</h1>
<p>From nature trails to camping trips and weekend explorations - we create wholesome memories for dads and kids.</p>
<div class="grid">
<div class="card"><strong>Upcoming:</strong><p class="muted">See the <a href="events.html">Events</a> - filter for upcoming only.</p></div>
<div class="card"><strong>Shop:</strong><p class="muted">Caps, tees, mugs - check the <a href="shop.html">Shop</a>.</p></div>
<div class="card"><strong>Get Involved:</strong><p class="muted">Questions or ideas? <a href="contact.html">Contact us</a>.</p></div>
</div>
</section>
<section aria-live="polite" class="grid" id="searchResults"></section>
</main>

<script src="js/search.js"></script>
<script>document.querySelector('a[data-nav=Home]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'splash': `
<div class="splash">
    <div class="box">
      <img src="images/logo-icon.svg" alt="logo" style="height:90px;margin-bottom:10px"/>
      <h1><span class="letters" id="letters"></span></h1>
      <p class="muted">Big and Little Adventures Together</p>
      <div class="volume-controls"><button id="playPause" class="btn">Play</button>
        <label class="muted" style="display:inline-flex;gap:6px;align-items:center">Volume <input id="vol" type="range" min="0" max="1" step="0.01" value="0.4"/></label>
      </div>
      <div class="skip" style="margin-top:16px"><button id="skip" class="btn">Enter Site</button> <small class="muted" id="timer">Auto-redirect in 30s</small></div>
      <audio id="music" src="audio/relaxing-piano-ambient.wav" preload="auto" muted loop></audio>
    </div>
  </div>
<script>
var nameText = "Welcome to DADVENTURES";
var lettersEl = document.getElementById('letters');
nameText.split('').forEach(function(ch,i){ var s=document.createElement('span'); s.style.setProperty('--i',i); s.textContent=(ch===' ')? '\u00A0' : ch; lettersEl.appendChild(s); });
var music = document.getElementById('music'), playPause = document.getElementById('playPause'), vol = document.getElementById('vol');
var timerEl = document.getElementById('timer'), skip = document.getElementById('skip');
var seconds = 30; var t = setInterval(function(){ seconds--; timerEl.textContent = "Auto-redirect in " + seconds + "s"; if(seconds<=0){ clearInterval(t); location.href="index.html";}},1000);
skip.addEventListener('click',function(){ location.href="index.html"; });
vol.addEventListener('input',function(){ music.volume = +vol.value; });
playPause.addEventListener('click', async function(){ if(music.paused){ try{ await music.play(); music.muted=false; }catch(e){} playPause.textContent="Pause"; } else { music.pause(); playPause.textContent="Play"; } });
(async function(){ try{ await music.play(); }catch(e){} })();
</script>
  <script src="js/v3.4.8-header-fixes.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'about': `
</div>
<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>
<main class="container">
<div class="searchbar with-icon">
<img alt="search icon" src="images/logo-icon.svg" style="height:20px"/>
<input aria-label="Search" id="search" placeholder="Search" type="search"/>
<button aria-label="Run search" class="btn" id="searchBtn">Search</button>
</div>
<section class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center">
<div>
<h2>Our Mission</h2>
<p class="muted">To build stronger bonds between dads and their children through simple, memorable adventures.</p>
<textarea readonly="" style="min-height:120px">Write your mission statement here... (editable via CMS)</textarea>
</div>
<div style="text-align:center">
<img alt="Founder" src="images/logo-icon.svg" style="max-width:100%;height:auto"/>
<small class="muted">Founder photo placeholder - replace with your image.</small>
</div>
</section>
<section class="card">
<h2>Timeline</h2>
<div style="overflow-x:auto">
<div style="display:flex;gap:24px;align-items:stretch;min-width:720px">
<div class="card" style="min-width:220px"><strong>2009</strong><br/><em>Name (CAO)</em><br/>BECAME COMPANY OWNER</div>
<div class="card" style="min-width:220px"><strong>2010</strong><br/>Technology launched - Product X<br/><span class="muted">Short description</span></div>
<div class="card" style="min-width:220px"><strong>2011</strong><br/>Moved premises</div>
</div>
</div>
</section>
<section aria-live="polite" class="grid" id="searchResults"></section>
</main>

<script src="js/search.js"></script>
<script>document.querySelector('a[data-nav=About]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'events': `
</div>
<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>
<main class="container">
<div class="searchbar with-icon">
<img alt="search icon" src="images/logo-icon.svg" style="height:20px"/>
<input aria-label="Search" id="search" placeholder="Search" type="search"/>
<button aria-label="Run search" class="btn" id="searchBtn">Search</button>
</div>
<div class="card" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
<button class="btn" id="todayBtn">Today</button>
<select id="filter"><option value="all">All</option><option value="upcoming">Upcoming only</option></select>
</div>
<div class="grid" id="eventsGrid"></div>
</main>
<div aria-labelledby="mTitle" aria-modal="true" class="modal" id="eventModal" role="dialog">
<div class="panel">
<h3 id="mTitle"></h3>
<img alt="" id="mImg" style="width:100%;border-radius:12px;display:block;margin-bottom:10px"/>
<p class="muted" id="mDesc"></p>
<p><strong>Route:</strong> <span id="mRoute"></span></p>
<p><a href="#" id="mMap" rel="noopener" target="_blank">Open in Google Maps</a></p>
<div class="countdown" id="mCountdown"></div>
<div style="margin-top:12px;display:flex;gap:10px;justify-content:flex-end"><button class="btn" id="mClose">Close</button></div>
</div>
</div>

<script src="js/search.js"></script>
<script src="js/events.js"></script>
<script>document.querySelector('a[data-nav=Events]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'shop': `
</div>
<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>
<main class="container">
<div class="searchbar with-icon">
<img alt="search icon" src="images/logo-icon.svg" style="height:20px"/>
<input aria-label="Search" id="search" placeholder="Search" type="search"/>
<button aria-label="Run search" class="btn" id="searchBtn">Search</button>
</div>
<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
<select id="sort"><option value="title">Sort: Title</option><option value="price">Sort: Price</option></select>
</div>
<div class="grid" id="shopGrid"></div>
</main>

<script src="js/search.js"></script>
<script src="js/shop.js"></script>
<script>document.querySelector('a[data-nav=Shop]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'product': `
</div>
</div>

<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>

  <main class="container">
    <div class="card" id="pCard"></div>
  </main>
  


  <script>
async function init(){
  var p = new URLSearchParams(location.search).get('id');
  var items = await fetch('content/products/products.json').then(function(r){return r.json()});
  var item = items.find(function(x){return x.id===p}) || items[0];
  var el = document.getElementById('pCard');
  el.innerHTML = '<h2>'+item.title+'</h2>'
    + '<img src="'+item.image+'" alt="" style="width:100%;border-radius:12px;margin:10px 0;aspect-ratio:16/9;object-fit:contain;background:#0b0b0e"/>'
    + '<p class="muted">Price: £'+item.price.toFixed(2)+'</p>'
    + '<form action="purchase-success.html" method="GET">'
    + '<input type="hidden" name="product" value="'+item.id+'"/>'
    + '<button class="btn" type="submit">Buy (test)</button>'
    + '</form>';
  try{ var logs = JSON.parse(localStorage.getItem('dbg')||'[]'); logs.push({t:Date.now(), type:'view_product', id:item.id}); localStorage.setItem('dbg', JSON.stringify(logs)); }catch(e){}
}
init();
  </script><script src="js/v3.4.10-strict.js"></script>
  <script src="js/v3.4.11-strict.js"></script>
  <script src="js/v3.4.12-strict.js"></script>
  <script src="js/v3.4.13-strict.js"></script>
  <script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'purchase-success': `
</div>
<main class="container">
<div class="card">
<h2>Purchase recorded (test)</h2>
<p>This is a placeholder success page. For live payments integrate Stripe or PayPal.</p>
<p><a class="btn" href="shop.html">Back to Shop</a></p>
</div>
</main><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'donations': `
</div>
<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>
<main class="container">
<div class="card">
<h2>Support DADVENTURES</h2>
<p class="muted">These are test flows for now.</p>
<div class="grid">
<a class="btn" href="donation-success.html?via=stripe">Donate via Stripe (test)</a>
<a class="btn" href="donation-success.html?via=paypal">Donate via PayPal (test)</a>
</div>
<p>Emails for donations and purchases are editable templates:</p>
<ul>
<li><code></code></li>
<li><code></code></li>
</ul>
</div>
</main>

<script>document.querySelector('a[data-nav=Donations]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'donation-success': `
</div>
<main class="container">
<div class="card">
<h2>Thank you for your support</h2>
<p>Your test donation via <strong><script>document.write(new URLSearchParams(location.search).get('via')||'test')</script></strong> has been recorded locally.</p>
<p><a class="btn" href="index.html">Back to Home</a></p>
</div>
</main><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'contact': `
</div>
<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>
<main class="container">
<div class="searchbar with-icon">
<img alt="search icon" src="images/logo-icon.svg" style="height:20px"/>
<input aria-label="Search" id="search" placeholder="Search" type="search"/>
<button aria-label="Run search" class="btn" id="searchBtn">Search</button>
</div>
<div class="card">
<h2>Contact Us</h2>
<form action="/success.html" data-netlify="true" id="contactForm" method="POST" name="contact" netlify-honeypot="bot-field">
<p class="hidden"><label>Do not fill: <input name="bot-field"/></label></p>
<div class="form-row">
<label>Name<input name="name" required="" type="text"/></label>
<label>Email<input name="email" required="" type="email"/></label>
</div>
<label>Message<textarea name="message" required="" rows="5"></textarea></label>
<label style="display:flex;gap:8px;align-items:center">
<input id="waOpt" name="whatsapp_optin" type="checkbox"/> I would like to join Local DADVENTURE WhatsApp community
        </label>
<div class="hidden form-row" id="waFields">
<label>Town<input id="town" name="town" type="text"/></label>
<label>Mobile (WhatsApp)<input id="mobile" name="mobile" pattern="\+?[0-9 ]{7,15}" type="tel"/></label>
</div>
<button class="btn" type="submit">Send</button>
</form>
</div>
<section aria-live="polite" class="grid" id="searchResults"></section>
</main>

<script src="js/search.js"></script>
<script>
var waOpt = document.getElementById('waOpt');
var waFields = document.getElementById('waFields');
waOpt.addEventListener('change',function(){ waFields.classList.toggle('hidden', !waOpt.checked); });
document.getElementById('contactForm').addEventListener('submit', function(e){
  if(waOpt.checked){
    var town = document.getElementById('town').value.trim();
    var mobile = document.getElementById('mobile').value.trim();
    if(!town || !mobile){ alert('Please enter town and a valid mobile number.'); e.preventDefault(); return; }
  }
  try{ var logs = JSON.parse(localStorage.getItem('dbg')||'[]'); logs.push({t:Date.now(), type:'contact_submit'}); localStorage.setItem('dbg', JSON.stringify(logs)); }catch(err){}
});
  </script>
<script>document.querySelector('a[data-nav=Contact]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'success': `
</div>
</div>

  <main class="container">
    <div class="card"><h2>Thanks</h2><p>We received your message and will get back shortly.</p>
      <p><a class="btn" href="index.html">Back to Home</a></p>
    </div>
  </main><script src="js/v3.4.10-strict.js"></script>
  <script src="js/v3.4.11-strict.js"></script>
  <script src="js/v3.4.12-strict.js"></script>
  <script src="js/v3.4.13-strict.js"></script>
  <script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'debug': `
</div>
</div>

<script>
function updClock(){ var z=new Date(); document.getElementById('timeNow').textContent=z.toLocaleString(); }
setInterval(updClock,1000); updClock();
var gm=document.getElementById('globalMusic'), gp=document.getElementById('globalPlayPause'), gv=document.getElementById('globalVol');
gv.addEventListener('input', function(){ gm.volume = +gv.value; });
gp.addEventListener('click', async function(){ if(gm.paused){ try{ await gm.play(); gm.muted=false; }catch(e){} gp.textContent='Pause'; } else { gm.pause(); gp.textContent='Play'; } });
(async function(){ try{ await gm.play(); }catch(e){} })();
</script>

  <main class="container">
    <div class="card">
      <h2>Debug Log</h2>
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <button class="btn" id="refresh">Refresh</button>
        <button class="btn" id="download">Download CSV</button>
        <button class="btn" id="clear">Clear</button>
        <button class="btn" id="close">Close</button>
      </div>
      <div class="card">
        <table id="tbl"><thead><tr><th>Time</th><th>Type</th><th>Data</th></tr></thead><tbody></tbody></table>
      </div>
      <small class="muted">Logs populate from: search, contact submit, open shop, view product, event modal open.</small>
    </div>
  </main>
  


  <script src="js/debug.js"></script>
  <script>document.querySelector('a[data-nav=Debug]').classList.add('active');</script><script src="js/v3.4.10-strict.js"></script>
  <script src="js/v3.4.11-strict.js"></script>
  <script src="js/v3.4.12-strict.js"></script>
  <script src="js/v3.4.13-strict.js"></script>
  <script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'join': `
</div>
<main class="container">
<div class="searchbar with-icon">
<input placeholder="Search" type="search"/>
<button class="btn">Search</button>
</div>
<section class="card" style="max-width:820px;margin:1rem auto">
<h2>Join Us</h2>
<form onsubmit="event.preventDefault(); alert('Thanks — DADVENTURES will reply within 48 hours.'); this.reset();">
<div class="form-row"><label>Name<br/><input required="" type="text"/></label></div>
<div class="form-row"><label>Contact (email or phone)<br/><input required="" type="text"/></label></div>
<div class="form-row"><label>Message<br/><textarea required="" rows="5"></textarea></label></div>
<div class="form-row checkbox"><input id="optin" type="checkbox"/><label for="optin">I agree to be contacted about Dadventures activities.</label></div>
<div class="form-row"><button class="btn" type="submit">Submit</button></div>
</form>
</section>
</main>
<script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'blog': `
</div>
<main class="container">
<h2>Latest from the Blog</h2>
<section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:18px">
<article class="card" style="display:block">
<img alt="" src="images/logo-icon.svg" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:12px"/>
<div style="padding:.8rem 1rem">
<div class="muted">Dadventures · 2025-09-19</div>
<h3 style="margin:.35rem 0">Sample Post #1</h3>
<p class="muted">This is mock content for layout testing. Click to read more…</p>
<a class="btn" href="blog-post.html">Read</a>
</div>
</article>
<article class="card" style="display:block">
<img alt="" src="images/logo-icon.svg" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:12px"/>
<div style="padding:.8rem 1rem">
<div class="muted">Dadventures · 2025-09-19</div>
<h3 style="margin:.35rem 0">Sample Post #2</h3>
<p class="muted">This is mock content for layout testing. Click to read more…</p>
<a class="btn" href="blog-post.html">Read</a>
</div>
</article>
<article class="card" style="display:block">
<img alt="" src="images/logo-icon.svg" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:12px"/>
<div style="padding:.8rem 1rem">
<div class="muted">Dadventures · 2025-09-19</div>
<h3 style="margin:.35rem 0">Sample Post #3</h3>
<p class="muted">This is mock content for layout testing. Click to read more…</p>
<a class="btn" href="blog-post.html">Read</a>
</div>
</article>
</section>
</main>
<script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'blog-post': `
</div>
</div>

<main class="container">
  <article class="card">
    <h1>Sample Blog Article</h1>
    <p class="muted">Dadventures · 2025-09-19</p>
    <p>Welcome to the new Dadventures blog! This is mock text so you can verify the style and layout quickly.</p>
  </article>
</main>
<script src="js/v3.4.10-strict.js"></script>
  <script src="js/v3.4.11-strict.js"></script>
  <script src="js/v3.4.12-strict.js"></script>
  <script src="js/v3.4.13-strict.js"></script>
  <script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'signin': `
</div>
<main class="container">
<section class="card" style="max-width:600px;margin:1rem auto">
<h2>Sign In</h2>
<form onsubmit="event.preventDefault(); alert('Demo login only.');">
<label>Username<br/><input required="" type="text"/></label><br/><br/>
<label>Password<br/><input required="" type="password"/></label><br/><br/>
<a class="muted" href="#">Forgot password?</a><br/><br/>
<button class="btn" type="submit">Sign In</button>
</form>
</section>
</main>
<script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'admin': `
</div>
<main class="container">
<section class="card">
<h2>Control Panel</h2>
<p class="muted">Demo controls (front‑end only).</p>
<div class="cp-theme">
<button class="pill" data-active="true" data-theme="blue">Blue</button>
<button class="pill" data-theme="purple">Purple</button>
<button class="pill" data-theme="pink">Pink</button>
<button class="pill" data-theme="gold">Gold</button>
<button class="pill" data-theme="bronze">Bronze</button>
<button class="pill" data-theme="green">Green</button>
<button class="pill" data-theme="orange">Orange</button>
</div>
<br/>
<label>Base font size <input max="20" min="14" oninput="document.documentElement.style.fontSize=this.value+'px'" type="range" value="16"/></label>
<script>
      document.querySelectorAll('.cp-theme .pill').forEach(btn=>{
        btn.addEventListener('click',()=>{
          document.querySelectorAll('.cp-theme .pill').forEach(b=>b.dataset.active="false");
          btn.dataset.active="true";
        });
      });
    </script>
</section>
</main>
<script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'calendar': `
</div>
<main class="container">
<h2>Calendar</h2>
<p>12‑month calendar view (mock). Hook to your events when ready.</p>
</main>
<script src="js/v3.4.10-strict.js"></script>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
<script defer src="js/v3.4.17-fallback.js"></script>
`,
  'test-header': `
</div>
<div style="height:2000px; background:#111; color:#fff; padding:20px;">Scroll test<br/>Only one soundbar should appear below.</div>
<div id="globalSoundbar">This is the global bottom soundbar placeholder.</div>
<script src="js/v3.4.11-strict.js"></script>
<script src="js/v3.4.12-strict.js"></script>
<script src="js/v3.4.13-strict.js"></script>
<script src="js/v3.4.14-strict.js"></script>
`
};

(function(){

  function sanitize(html){
    return html.replace(/<footer[\s\S]*?<\/footer>/ig,'')
               .replace(/<div[^>]+class=["']mobile-nav["'][\s\S]*?<\/div>/ig,'');
  }

  function render(path, push){
    var app=document.getElementById('app'); if(!app) return;
    var file=(path==='index'||!path)?'home':path;
    var tpl = PAGES[file] || '';
    app.innerHTML = sanitize(tpl);

    // Activate nav links
    document.querySelectorAll('header nav a').forEach(function(a){
      a.classList.remove('active');
      if(a.getAttribute('href') && a.getAttribute('href').indexOf(file+'.html')>-1) a.classList.add('active');
      if(file==='home' && a.getAttribute('href').includes('index.html')) a.classList.add('active');
    });

    // Execute inline scripts in the injected HTML
    app.querySelectorAll('script').forEach(function(s){
      var n=document.createElement('script');
      if(s.src){ n.src=s.src; } else { n.textContent=s.textContent; }
      document.body.appendChild(n);
      setTimeout(function(){n.remove();},0);
    });

    if(push) history.pushState({path:file}, '', (file==='home'?'index':file)+'.html');

    // Auto-close mobile nav after navigation
    var mn=document.querySelector('.mobile-nav'); if(mn) mn.classList.remove('active');
  }

  // Intercept navigation links
  document.addEventListener('click',function(e){
    var a=e.target.closest('a'); if(!a) return;
    var href=a.getAttribute('href')||'';
    if(a.target==='_blank' || /^https?:/i.test(href) || href.startsWith('#')) return;
    if(/\.html$/i.test(href)){
      e.preventDefault();
      var page=href.replace(/^\//,'').replace(/\.html$/i,'');
      render(page,true);
    }
  });

  // Back/forward handling
  window.addEventListener('popstate',function(e){ var st=e.state; render(st&&st.path?st.path:'home',false); });

  // Initial page load (Home by default)
  var initial=(location.pathname.split('/').pop().replace(/\.html$/i,''))||'home';
  if(initial==='index') initial='home';
  render(initial,false);

})();


// Load home boxes from JSON
async function loadHomeBoxes(){
  try {
    const res = await fetch('/content/pages/home.json', {cache:'no-store'});
    if(!res.ok) return;
    const data = await res.json();
    const container = document.querySelector('.home-boxes');
    if(container){
      container.innerHTML = '';
      data.boxes.forEach(box => {
        const div = document.createElement('div');
        div.className = 'card home-box';
        div.innerHTML = `
          <img src="${box.image}" alt="${box.title}" class="home-box-img" style="max-width:100%;border-radius:10px;margin-bottom:10px;">
          <h3>${box.title}</h3>
          <p>${box.text}</p>
          ${box.community ? `<a href="${box.community.url}" target="_blank">${box.community.label}</a>` : `<a href="${box.link}">Learn more</a>`}
        `;
        container.appendChild(div);
      });
    }
  } catch(e){ console.error(e); }
}
document.addEventListener('DOMContentLoaded', loadHomeBoxes);
