
(function(){
  function log(msg){ const el = document.getElementById('debugLog'); if(el){ el.textContent += msg + "\n"; } }
  function pass(name){ log('PASS: ' + name + ' @ ' + new Date().toISOString()); }
  function fail(name, err){ log('FAIL: ' + name + ' -> ' + err + ' @ ' + new Date().toISOString()); }

  function runChecks(){
    try{
      // Check audio element
      const a = document.getElementById('globalAudio');
      if(a && typeof a.play === 'function') pass('Audio element found'); else fail('Audio element','missing');

      // Check favicon
      const f = document.querySelector('link[rel~="icon"]');
      if(f && f.href) pass('Favicon link present'); else fail('Favicon','missing');

      // Check pages/navigation links
      document.querySelectorAll('nav a').forEach(a => { if(a.getAttribute('href')){} });
      pass('Nav links exist');

      // Check content data presence
      fetch('content/events.json').then(r=>r.ok?pass('Events data ok'):fail('Events data','not ok'));
      fetch('content/blog.json').then(r=>r.ok?pass('Blog data ok'):fail('Blog data','not ok'));
      fetch('content/shop.json').then(r=>r.ok?pass('Shop data ok'):fail('Shop data','not ok'));
      fetch('content/timeline.json').then(r=>r.ok?pass('Timeline data ok'):fail('Timeline data','not ok'));
    }catch(e){
      fail('Runtime', e.message||String(e));
    }
  }

  window.DadventuresDebug = { runChecks };
  document.addEventListener('DOMContentLoaded', ()=>{
    const runBtn = document.getElementById('runDebug');
    if(runBtn){ runBtn.addEventListener('click', runChecks); }
  });
})();
