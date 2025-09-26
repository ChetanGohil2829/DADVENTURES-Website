
// Hamburger / mobile panel
const menuBtn = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
if (menuBtn && mobilePanel){
  menuBtn.addEventListener('click', ()=>{
    const open = mobilePanel.classList.toggle('open');
    mobilePanel.setAttribute('aria-hidden', !open);
  });
  mobilePanel.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    mobilePanel.classList.remove('open'); mobilePanel.setAttribute('aria-hidden', true);
  }));
}

// Mark active nav
document.querySelectorAll('.nav a').forEach(a=>{
  if (location.pathname.endsWith(a.getAttribute('href'))) a.classList.add('active');
});

// Maintenance banner (public pages)
const maint = localStorage.getItem('dadventures_maintenance') === '1';
if (maint){
  const bar = document.createElement('div');
  bar.textContent = 'Site under maintenance';
  bar.style.cssText = 'position:sticky;top:0;background:#ff4d6d;color:white;text-align:center;padding:6px;z-index:60';
  document.body.prepend(bar);
}

// Calendar with notes (events page)
const calEl = document.getElementById('calendar');
if (calEl){
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth(); // current month
  const start = new Date(year, month, 1);
  const end = new Date(year, month+1, 0);
  const daysInMonth = end.getDate();
  for(let d=1; d<=daysInMonth; d++){
    const cell = document.createElement('div');
    cell.className='day';
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const ev = (window.seededEvents||[]).find(e=>e.date===dateStr);
    cell.innerHTML = `<strong>${d}</strong><div class="muted" style="font-size:12px">${ev?ev.title:''}</div>`;
    cell.addEventListener('click',()=>openModal(dateStr, ev));
    calEl.appendChild(cell);
  }

  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const noteBox = document.getElementById('note');
  document.getElementById('closeModal').onclick = ()=> modal.style.display='none';
  document.getElementById('saveNote').onclick = ()=>{
    localStorage.setItem('note_'+modalDate.dataset.date, noteBox.value);
    alert('Note saved');
    modal.style.display='none';
  };
  document.getElementById('deleteNote').onclick = ()=>{
    localStorage.removeItem('note_'+modalDate.dataset.date);
    noteBox.value='';
    alert('Note deleted');
    modal.style.display='none';
  };
  function openModal(dateStr, ev){
    modalTitle.textContent = ev? ev.title : 'No event';
    modalDate.textContent = dateStr;
    modalDate.dataset.date = dateStr;
    noteBox.value = localStorage.getItem('note_'+dateStr)||'';
    modal.style.display='flex';
  }
}
