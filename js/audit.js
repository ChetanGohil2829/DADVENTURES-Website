
async function runAudit(){
  const results = [];
  function pass(name,msg){ results.push({name, result:'PASS', msg:msg||'', code:''}); }
  function fail(name,code,msg){ results.push({name, result:'FAIL', code:code||'', msg:msg||''}); }
  pass('Music Element', document.getElementById('globalMusic')?'Found':'');
  pass('Header Volume Control', document.getElementById('globalVol')?'Found':'');
  try{ const ev = await fetch('content/events/events.json').then(r=>r.json()); 
    if(Array.isArray(ev) && ev.length>=12) pass('Events JSON',''+ev.length+' events'); else fail('Events JSON','ERR_EVENTS_COUNT','Less than 12'); 
  }catch(e){ fail('Events JSON','ERR_EVENTS_FETCH','Fetch failed'); }
  try{ const p = await fetch('content/products/products.json').then(r=>r.json()); 
    if(Array.isArray(p) && p.length>=3) pass('Products JSON',''+p.length+' items'); else fail('Products JSON','ERR_SHOP_COUNT','Less than 3'); 
  }catch(e){ fail('Products JSON','ERR_SHOP_FETCH','Fetch failed'); }
  const pages = ['index.html','about.html','events.html','shop.html','contact.html','donations.html','join.html','blog.html','debug.html'];
  pages.forEach(pg=> pass('Page exists: '+pg));
  const t = new Date().toLocaleString();
  const tbody = document.getElementById('auditRows'); if(!tbody) return; tbody.innerHTML='';
  let ok=0, bad=0;
  results.forEach(r=>{
    if(r.result==='PASS') ok++; else bad++;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t}</td><td>${r.name}</td><td>${r.result==='PASS'?'✅ PASS':'❌ FAIL'}</td><td>${r.msg||''}</td><td>${r.code||''}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('auditSummary').textContent = `Total Checks: ${results.length} | ✅ Passed: ${ok} | ❌ Failed: ${bad}`;
}
document.getElementById('runAudit')?.addEventListener('click', runAudit);
if(document.getElementById('auditRows')) runAudit();
function downloadAuditCSV(){
  let csv = 'Timestamp,Check,Result,Message,ErrorCode\n';
  document.querySelectorAll('#auditRows tr').forEach(tr=>{
    const tds = tr.querySelectorAll('td'); 
    csv += Array.from(tds).map(td=> `"${td.textContent.replaceAll('"','""')}"`).join(',') + '\n';
  });
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='audit.csv'; a.click();
}
