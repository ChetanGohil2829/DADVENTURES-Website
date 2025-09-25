
async function loadEvents(){
  const items = await fetch('content/events/events.json').then(r=>r.json());
  const grid = document.getElementById('eventsGrid');
  function render(list){
    grid.innerHTML = ''; list.map(function(ev){
      return '<article class="card" data-title="'+(ev.title.toLowerCase()+' '+ev.description.toLowerCase())+'">'
        + '<img src="'+ev.image+'" alt="" style="width:100%;border-radius:12px;margin-bottom:10px"/>'
        + '<h3>'+ev.title+'</h3>'
        + '<p class="muted">'+new Date(ev.datetime).toLocaleString()+'</p>'
        + '<p>'+ev.description+'</p>'
        + '<button class="btn" data-open="'+ev.id+'">Details</button>'
        + '</article>';
    }).join('');
  }
  function upcomingOnly(list){ var now = new Date(); return list.filter(function(ev){ return new Date(ev.datetime) > now; }); }
  render(items);
  document.getElementById('filter').addEventListener('change', function(e){
    render(e.target.value==='upcoming' ? upcomingOnly(items) : items);
  });
  document.getElementById('todayBtn').addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  grid.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-open]');
    if(!btn) return;
    var id = btn.getAttribute('data-open');
    var ev = items.find(function(x){ return x.id===id; });
    openModal(ev);
  });
}
function openModal(ev){
  document.getElementById('mTitle').textContent = ev.title;
  document.getElementById('mImg').src = ev.image;
  document.getElementById('mDesc').textContent = ev.description;
  document.getElementById('mRoute').textContent = ev.route;
  document.getElementById('mMap').href = ev.map_link;
  var modal = document.getElementById('eventModal');
  modal.classList.add('open');
  var c = document.getElementById('mCountdown');
  var raf;
  function tick(){
    var ms = new Date(ev.datetime) - new Date();
    if(ms<=0){ c.textContent = "Happening now"; return; }
    var s = Math.floor(ms/1000);
    var d = Math.floor(s/86400);
    var h = Math.floor((s%86400)/3600);
    var m = Math.floor((s%3600)/60);
    var sec = s%60;
    c.textContent = "Starts in " + d + "d " + h + "h " + m + "m " + sec + "s";
    raf = requestAnimationFrame(tick);
  }
  tick();
  document.getElementById('mClose').onclick = function(){ modal.classList.remove('open'); if(raf) cancelAnimationFrame(raf); };
  try{ var logs = JSON.parse(localStorage.getItem('dbg')||'[]'); logs.push({t:Date.now(), type:'open_event', id:ev.id}); localStorage.setItem('dbg', JSON.stringify(logs)); }catch(e){}
}
loadEvents();
