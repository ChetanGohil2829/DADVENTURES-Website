(()=>{
const byId=id=>document.getElementById(id);
const intro=byId('intro'),introMsg=byId('intro-message');
const audio=byId('bg-music'),musicToggle=byId('music-toggle'),musicVol=byId('music-volume');
const skipBtn=byId('skipBtn'),enableSound=byId('enableSound');
const message='✨ Welcome to DADVENTURES — Step into a world where time slows, hearts connect, and every adventure lights the path.';
let i=0;(function typeEffect(){if(i<message.length){introMsg.textContent+=message.charAt(i++);setTimeout(typeEffect,40);}})();
function startMusic(){audio.muted=false;audio.play().catch(()=>{enableSound.classList.remove('hidden');});}
window.addEventListener('load',()=>{audio.volume=0;audio.play().then(()=>{let v=0;const fade=setInterval(()=>{v+=.05;if(v>=.7){v=.7;clearInterval(fade);}audio.volume=v;musicVol.value=v;},200);}).catch(()=>{enableSound.classList.remove('hidden');});});
enableSound.addEventListener('click',()=>{enableSound.classList.add('hidden');startMusic();});
musicToggle.addEventListener('click',()=>{if(audio.paused){audio.play();musicToggle.textContent='Pause';}else{audio.pause();musicToggle.textContent='Play';}});
musicVol.addEventListener('input',e=>{audio.volume=e.target.value;});
function goHome(){intro.classList.add('hidden');showRoute('home');}
setTimeout(goHome,10000);skipBtn.addEventListener('click',goHome);
const routes=['home','about','events','contact','shop'];
function showRoute(id){routes.forEach(r=>byId(r).classList.add('hidden'));byId(id).classList.remove('hidden');if(id==='events')ensureCalendar();}
document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',e=>{showRoute(e.target.getAttribute('data-route'));}));
let calendarInit=false;function ensureCalendar(){if(calendarInit)return;calendarInit=true;const el=byId('calendar');if(!el)return;const cal=new FullCalendar.Calendar(el,{initialView:'dayGridMonth',events:'content/events/events.json'});cal.render();}
fetch('content/shop/products.json').then(r=>r.json()).then(items=>{const grid=byId('shop-grid');grid.innerHTML=items.map(p=>`<div class="product"><div class="p-name">${p.name}</div><div class="p-price">£${p.price}</div><a href="#">Buy</a></div>`).join('');});
})();