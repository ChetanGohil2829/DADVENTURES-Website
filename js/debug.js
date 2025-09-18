
const checks = [
  async ()=> ({name:'Music Controls', pass: !!document.getElementById('globalMusic')}),
  async ()=> ({name:'Navigation Links', pass: !!document.querySelector('nav a')}),
  async ()=> {
    try { const r = await fetch('content/events/events.json'); const j = await r.json(); return {name:'Events JSON', pass: Array.isArray(j) && j.length>=12, msg:`${j.length} events`}; }
    catch(e){ return {name:'Events JSON', pass:false, code:'ERR_EVENTS_404'}; }
  },
  async ()=> {
    try { const r = await fetch('content/shop/products.json'); const j = await r.json(); return {name:'Shop Products', pass: Array.isArray(j) && j.length>=3, msg:`${j.length} products`}; }
    catch(e){ return {name:'Shop Products', pass:false, code:'ERR_SHOP_404'}; }
  },
  async ()=> ({name:'Footer Music Bar', pass: !!document.querySelector('.fixed-bottom-bar')}),
];
async function runAudit(){
  const out = []; let pass=0, fail=0;
  for(const c of checks){
    const res = await c();
    if(res.pass) pass++; else fail++;
    out.push(res);
  }
  const summary = document.getElementById('summary');
  summary.textContent = `Total Checks: ${out.length} | ✅ Passed: ${pass} | ❌ Failed: ${fail}`;
  const tbody = document.getElementById('rows'); tbody.innerHTML='';
  const now = new Date();
  out.forEach(r=>{
    const tr = document.createElement('tr');
    const ts = now.toISOString().replace('T',' ').split('.')[0];
    tr.innerHTML = `<td>${ts}</td><td>${r.name}</td><td>${r.pass?'✅ PASS':'❌ FAIL'}</td><td>${r.msg||''}</td><td>${r.code||''}</td>`;
    tbody.appendChild(tr);
  });
}
document.addEventListener('DOMContentLoaded', runAudit);
function downloadCSV(){
  let csv = 'Timestamp,Check,Result,Message,ErrorCode\n';
  document.querySelectorAll('#rows tr').forEach(tr=>{
    const tds = tr.querySelectorAll('td');
    csv += Array.from(tds).map(td=>`"${td.textContent.replaceAll('"','""')}"`).join(',') + '\n';
  });
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='audit.csv'; a.click();
}
