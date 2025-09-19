
(function(){
  function code(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }
  function log(msg){ const el=document.getElementById('debugLog'); if(el){ el.textContent += msg + '\n'; } }
  function pass(name){ log('PASS ['+code()+']: '+name+' @ '+new Date().toISOString()); }
  function fail(name, err){ log('FAIL ['+code()+']: '+name+' -> '+(err||'unknown')+' @ '+new Date().toISOString()); }
  function run(){
    try{
      const a=document.getElementById('globalAudio'); a && typeof a.play==='function' ? pass('Audio element found') : fail('Audio element','missing');
      const f=document.querySelector('link[rel~="icon"]'); f && f.href ? pass('Favicon link present') : fail('Favicon','missing');
      ['content/events.json','content/blog.json','content/shop.json','content/timeline.json'].forEach(p=>{ fetch(p).then(r=>r.ok?pass(p+' ok'):fail(p,'not ok')); });
    }catch(e){ fail('Runtime', e.message||String(e)); }
  }
  window.DadventuresDebug={run};
  document.addEventListener('DOMContentLoaded',()=>{
    const b=document.getElementById('runDebug'); if(b) b.addEventListener('click', run);
  });
})();
