(async function(){
  const panel = document.getElementById('debugPanel');
  const log = (msg, cls='ok')=>{ const d=document.createElement('div'); d.textContent=msg; d.className=cls; panel.appendChild(d); };
  const pass = m => log('✓ '+m,'ok');
  const warn = m => log('! '+m,'warn');
  const fail = m => log('✖ '+m,'err');

  // 1. Navigation routes present
  const must = ['home','about','events','contact','shop'];
  const missing = must.filter(id=>!document.getElementById(id));
  missing.length? fail('Routes missing: '+missing.join(', ')) : pass('All routes present');

  // 2. Social links valid
  const soc = Array.from(document.querySelectorAll('footer a'));
  const bad = soc.filter(a=>!a.getAttribute('href') || a.getAttribute('href')==='#');
  bad.length? fail('Social links placeholder found') : pass('Social links ok');

  // 3. Audio element wired
  const audio = document.getElementById('bg-music');
  if(!audio) fail('Audio element missing'); else pass('Audio element present');

  // 4. Search box present
  const sb = document.getElementById('site-search');
  sb ? pass('Search input present') : fail('Search input missing');

  // 5. Data files exist
  try{ await fetch('content/events/events.json').then(r=>r.json()); pass('Events data loaded'); }catch{ fail('Events data missing'); }
  try{ await fetch('content/shop/products.json').then(r=>r.json()); pass('Shop data loaded'); }catch{ fail('Shop data missing'); }

  // 6. Email templates exist
  const e1 = await fetch('emails/purchase.html'); e1.ok? pass('Purchase email present') : fail('Purchase email missing');
  const e2 = await fetch('emails/donation.html'); e2.ok? pass('Donation email present') : fail('Donation email missing');

  // 7. Quick search test after shop loads
  await new Promise(r=>setTimeout(r, 300));
  if(sb){
    sb.value='mug'; sb.dispatchEvent(new Event('input'));
    await new Promise(r=>setTimeout(r, 50));
    const any = Array.from(document.querySelectorAll('.product')).some(x=>x.style.display!== 'none');
    any? pass('Search filter shows results') : warn('Search showed no visible products (may be waiting for shop load)');
    sb.value=''; sb.dispatchEvent(new Event('input'));
  }

  log('Debug ready. Click Debug to hide/show.', 'warn');
})();