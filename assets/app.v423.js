
/* v4.2.3 enhancements */
(function(){
  const btn=document.getElementById('menuToggle');let panel=document.getElementById('mobilePanel');
  if(btn){if(!panel){panel=document.createElement('nav');panel.id='mobilePanel';const main=document.querySelector('.nav,.tabs,.menu');if(main){main.querySelectorAll('a').forEach(a=>{const l=a.cloneNode(true);l.removeAttribute('class');panel.appendChild(l);});}document.body.appendChild(panel);}
    btn.addEventListener('click',()=>panel.classList.toggle('open'));
    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>panel.classList.remove('open')));}
  const footer=document.querySelector('footer,.footer,.trailer');if(footer){const headerLinks=document.querySelectorAll('header a,.header a,.topbar a');headerLinks.forEach(a=>{const txt=(a.textContent||'').toLowerCase();if(/ig|fb|tt|instagram|facebook|tiktok/.test(txt)){const clone=a.cloneNode(true);footer.appendChild(clone);a.style.display='none';}});}
  function ensureModal(){let b=document.querySelector('.dv-modal-backdrop');if(b) return b;b=document.createElement('div');b.className='dv-modal-backdrop';b.innerHTML='<div class="dv-modal"><h3 id="dvTitle">Event</h3><p id="dvDate" style="color:#9aa3c7"></p><textarea id="dvNote" class="dv-input" rows="6"></textarea><div class="dv-actions"><button id="dvDel">Delete</button><button id="dvSave">Save</button><button id="dvClose">Close</button></div></div>';document.body.appendChild(b);b.querySelector('#dvCl...
  function bindCalendar(){const cells=document.querySelectorAll('.calendar .day,.calendar-day,[role="gridcell"],.calendar .cell');if(!cells.length)return;const back=ensureModal();cells.forEach(c=>{if(c.__wired)return;c.__wired=true;c.style.cursor='pointer';c.addEventListener('click',()=>{const d=c.getAttribute('data-date')||c.dataset.date||(c.textContent||'').trim();back.querySelector('#dvTitle').textContent='Event';back.querySelector('#dvDate').textContent=d;back.querySelector('#dvDate').datase...
  bindCalendar();setTimeout(bindCalendar,1000);
})();
