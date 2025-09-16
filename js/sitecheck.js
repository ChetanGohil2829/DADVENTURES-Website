(()=>{
const D = window.__dadventures_dbg?.dbg;
async function siteCheck(){
  const results = [];
  const pass = (name, info='') => { results.push({name, ok:true, info}); D?.add('CHECK ✓ ' + name + (info?(' — '+info):'')); };
  const fail = (name, info='') => { results.push({name, ok:false, info}); D?.add('CHECK ✗ ' + name + (info?(' — '+info):''), true); };
  try{
    // 1. Navigation links
    ['home','about','events','contact','shop'].forEach(id => {
      const el = document.querySelector(`[data-route="${id}"]`);
      if(el) pass('Nav '+id); else fail('Nav '+id, 'Missing link');
    });
    // 2. Search bar
    if(document.querySelector('#site-search')) pass('Search bar present'); else fail('Search bar present','Not found');
    // 3. Audio element
    const audio = document.querySelector('#bg-music');
    if(audio){ pass('Audio element present'); try{ await audio.play().catch(()=>{}); pass('Audio play attempt'); }catch(e){ fail('Audio play attempt', e.message); } }
    else fail('Audio element present','Not found');
    // 4. Calendar JSON
    try{ const r = await fetch('content/events/events.json?ts='+Date.now()); const j = await r.json(); if(Array.isArray(j) && j.length) pass('Events JSON loaded', j.length+' events'); else fail('Events JSON loaded','Empty or invalid'); }catch(e){ fail('Events JSON loaded', e.message); }
    // 5. Shop JSON
    try{ const r = await fetch('content/shop/products.json?ts='+Date.now()); const j = await r.json(); if(Array.isArray(j) && j.length) pass('Products JSON loaded', j.length+' products'); else fail('Products JSON loaded','Empty or invalid'); }catch(e){ fail('Products JSON loaded', e.message); }
    // 6. Contact form
    if(document.querySelector('form[data-netlify="true"]')) pass('Contact form present'); else fail('Contact form present','Not found');
    // 7. Logo
    if(document.querySelector('.site-logo')) pass('Logo present'); else fail('Logo present','Not found');
    // 8. Email templates
    try { const r1 = await fetch('emails/purchase.html'); r1.ok ? pass('Email template: purchase.html') : fail('Email template: purchase.html','Missing'); }
    catch(e){ fail('Email template: purchase.html', e.message); }
    try { const r2 = await fetch('emails/donation.html'); r2.ok ? pass('Email template: donation.html') : fail('Email template: donation.html','Missing'); }
    catch(e){ fail('Email template: donation.html', e.message); }
    // Summary
    const ok = results.filter(r=>r.ok).length; const total = results.length;
    D?.setSummary(`Site check complete: ${ok}/${total} tests passed (${new Date().toTimeString().split(' ')[0]})`);
  }catch(e){ D?.add('Site check crashed: '+e, true); }
}
window.runSiteCheck = siteCheck;
// auto-run on load
window.addEventListener('load', siteCheck);
})();
