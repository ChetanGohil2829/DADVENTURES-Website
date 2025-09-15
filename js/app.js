(()=>{
const byId=id=>document.getElementById(id);
const qsa=sel=>document.querySelectorAll(sel);
const intro=byId('intro'), introMsg=byId('intro-message');
const audio=byId('bg-music'), toggle=byId('music-toggle'), vol=byId('music-volume');
const skip=byId('skipBtn'), enable=byId('enableSound');
byId('y').textContent=new Date().getFullYear();

// Slower typing (2x)
const message="✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path toward a brighter future.";
let i=0;
(function type(){if(i<message.length){introMsg.textContent+=message.charAt(i++);setTimeout(type,240);} })();

// Music controls
function fadeIn(){let v=0;audio.muted=false;const t=setInterval(()=>{v+=.05;if(v>=parseFloat(vol.value)){v=parseFloat(vol.value);clearInterval(t);}audio.volume=v;},180);}
function startMusic(){audio.play().then(()=>{document.addEventListener('click',()=>fadeIn(),{once:true});}).catch(()=>{enable.classList.remove('hidden');});}
window.addEventListener('load',startMusic);
enable.addEventListener('click',()=>{enable.classList.add('hidden');audio.play().then(()=>fadeIn());});
toggle.addEventListener('click',()=>{if(audio.paused){audio.play();toggle.textContent="Pause";}else{audio.pause();toggle.textContent="Play";}});
vol.addEventListener('input',e=>{audio.volume=parseFloat(e.target.value);});

// Router
const routes=['home','about','events','contact','shop'];
function showRoute(id){routes.forEach(r=>byId(r).classList.add('hidden'));byId(id).classList.remove('hidden');}
qsa('[data-route]').forEach(el=>el.addEventListener('click',e=>showRoute(e.target.getAttribute('data-route'))));

// Redirect after 10s
setTimeout(()=>{intro.classList.add('hidden');showRoute('home');},10000);
skip.addEventListener('click',()=>{intro.classList.add('hidden');showRoute('home');});

// Content
fetch('content/home.md').then(r=>r.text()).then(t=>byId('home-hero').innerHTML=t);
fetch('content/about.md').then(r=>r.text()).then(t=>byId('about-content').innerHTML=t);
fetch('content/shop/products.json').then(r=>r.json()).then(items=>{byId('shop-grid').innerHTML=items.map(p=>`<div class='card'>${p.name} - £${p.price}</div>`).join('');});
})();