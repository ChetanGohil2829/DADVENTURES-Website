
// Sidebar switching
document.querySelectorAll('.sidebar a').forEach(link=>{
  link.addEventListener('click', (e)=>{
    e.preventDefault();
    document.querySelectorAll('.sidebar a').forEach(l=>l.classList.remove('active'));
    link.classList.add('active');
    const target = link.dataset.section;
    document.querySelectorAll('main .section').forEach(s=>s.classList.add('hidden'));
    document.getElementById('section-'+target).classList.remove('hidden');
  });
});

// Mission statement save
const missionInput = document.getElementById('missionInput');
const saveMission = document.getElementById('saveMission');
if (missionInput && saveMission){
  // load
  const saved = localStorage.getItem('dadventures_mission');
  if (saved) missionInput.value = saved;
  saveMission.onclick = ()=>{
    localStorage.setItem('dadventures_mission', missionInput.value);
    alert('Mission saved');
    const aboutText = document.getElementById('missionText');
    if (aboutText) aboutText.textContent = missionInput.value;
  };
}

// Maintenance toggle
const maintToggle = document.getElementById('maintToggle');
if (maintToggle){
  maintToggle.checked = localStorage.getItem('dadventures_maintenance')==='1';
  maintToggle.addEventListener('change',()=>{
    localStorage.setItem('dadventures_maintenance', maintToggle.checked? '1':'0');
    alert('Maintenance toggled');
  });
}

// Theme buttons
document.querySelectorAll('[data-theme]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const t = btn.dataset.theme;
    let vars = {};
    if (t==='bluepink'){ vars = {'--accent':'#7aa8ff','--accent2':'#ff66cc'}; }
    if (t==='gold'){ vars = {'--accent':'#ffd166','--accent2':'#e59819'}; }
    if (t==='greenorange'){ vars = {'--accent':'#7ae582','----accent2':'#ff924c'}; vars['--accent2']='#ff924c'; }
    Object.entries(vars).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));
    alert('Theme applied');
  });
});

// Dummy analytics data
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const data = {
  visitors: months.map((m,i)=>({ label:m, value: Math.round(400+Math.random()*600) })),
  donations: months.map((m,i)=>({ label:m, value: Math.round(Math.random()*1500) })),
  sales: months.map((m,i)=>({ label:m, value: Math.round(20+Math.random()*100) })),
  events: months.map((m,i)=>({ label:m, value: Math.round(5+Math.random()*30) }))
};

function drawBarChart(canvasId, series, title=''){
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  // bg grid
  ctx.strokeStyle='rgba(122,168,255,0.15)';
  ctx.lineWidth=1;
  for(let y=0;y<=5;y++){ ctx.beginPath(); ctx.moveTo(40, 20 + y*(h-40)/5); ctx.lineTo(w-10, 20 + y*(h-40)/5); ctx.stroke(); }
  // axes
  ctx.strokeStyle='rgba(230,233,255,0.6)'; ctx.beginPath(); ctx.moveTo(40,20); ctx.lineTo(40,h-20); ctx.lineTo(w-10,h-20); ctx.stroke();
  // bars
  const max = Math.max(...series.map(s=>s.value)) || 1;
  const bw = (w-70)/series.length;
  series.forEach((s, i)=>{
    const x = 45 + i*bw + 6;
    const bh = (s.value/max)*(h-60);
    const y = (h-20) - bh;
    // gradient bar
    const grad = ctx.createLinearGradient(0,y,0,y+bh);
    grad.addColorStop(0,'rgba(122,168,255,0.9)');
    grad.addColorStop(1,'rgba(255,102,204,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(x,y,bw-12,bh);
    // label
    ctx.fillStyle='rgba(230,233,255,0.8)';
    ctx.font='12px Inter, Arial';
    ctx.fillText(s.label, x, h-6);
  });
}

// Render charts
drawBarChart('chart-visitors', data.visitors);
drawBarChart('chart-donations', data.donations);
drawBarChart('chart-sales', data.sales);
drawBarChart('chart-events', data.events);

// Export helpers
function download(filename, text, mime='text/plain'){
  const a = document.createElement('a');
  a.href = 'data:'+mime+';charset=utf-8,' + encodeURIComponent(text);
  a.download = filename; a.click();
}

function csvFromSeries(series){
  return 'label,value\n' + series.map(s=>`${s.label},${s.value}`).join('\n');
}

document.querySelectorAll('[data-export]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const [name, type] = btn.dataset.export.split('-');
    const map = {{ visitors:data.visitors, donations:data.donations, sales:data.sales, events:data.events }};
    if (type==='csv'){
      download(name+'.csv', csvFromSeries(map[name]), 'text/csv');
    } else if (type==='png'){
      const id = 'chart-'+name;
      const c = document.getElementById(id);
      const url = c.toDataURL('image/png');
      const a = document.createElement('a'); a.href=url; a.download=name+'.png'; a.click();
    }
  });
});

// Debug panel mock checks
const runBtn = document.getElementById('runChecks');
const logBox = document.getElementById('logBox');
const debugResults = document.getElementById('debugResults');
const clearLogs = document.getElementById('clearLogs');
const exportCSV = document.getElementById('exportCSV');

if (runBtn){
  runBtn.onclick = ()=>{
    const checks = [
      { name:'Home images', pass:true },
      { name:'Events calendar', pass:true },
      { name:'Contact form', pass:true },
      { name:'Shop assets', pass:true },
      { name:'Admin charts', pass:true }
    ];
    const time = new Date().toISOString();
    debugResults.textContent = 'Completed at '+time;
    checks.forEach(c=>{
      logBox.textContent += `[${time}] ${c.pass?'PASS':'FAIL'} — ${c.name}\n`;
    });
  };
}
if (clearLogs){ clearLogs.onclick = ()=> logBox.textContent=''; }
if (exportCSV){ exportCSV.onclick = ()=>{
  const lines = logBox.textContent.trim().split('\n').filter(Boolean);
  const csv = 'timestamp,status,component\n' + lines.map(l=>{
    const m = l.match(/\[(.*?)\]\s(\w+)\s—\s(.*)/);
    return m? `${m[1]},${m[2]},${m[3]}` : '';
  }).join('\n');
  download('debug-log.csv', csv, 'text/csv');
};}
