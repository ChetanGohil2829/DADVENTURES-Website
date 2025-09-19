
(function(){
  function code(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }
  function log(msg){ const el=document.getElementById('debugLog'); if(el){ el.textContent += msg + '\n'; } }
  function pass(name){ log('PASS ['+code()+']: '+name+' @ '+new Date().toISOString()); }
  function fail(name, err){ log('FAIL ['+code()+']: '+name+' -> '+(err||'unknown')+' @ '+new Date().toISOString()); }
  function run(){
    try{
      const a=document.getElementById('globalAudio'); a && typeof a.play==='function' ? pass('Audio element ok') : fail('Audio element','missing');
      const icon=document.querySelector('link[rel~="icon"]'); icon && icon.href ? pass('Favicon present') : fail('Favicon','missing');
      ['content/events.json','content/blog.json','content/shop.json','content/timeline.json'].forEach(p=>{
        fetch(p).then(r=>r.ok?pass(p+' ok'):fail(p,'not ok'));
      });
      const tl=document.querySelector('.timeline'); tl ? pass('Timeline present') : fail('Timeline','missing');
      const cal=document.getElementById('eventsCalendar'); cal ? pass('Calendar enhancement present') : pass('Calendar enhancement optional');
    }catch(e){ fail('Runtime', e.message||String(e)); }
  }
  function exportLog(){
    const el=document.getElementById('debugLog'); if(!el) return;
    const blob=new Blob([el.textContent||''],{type:'text/plain'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='dadventures-debug.txt'; a.click();
  }
  window.DadventuresDebug={run,exportLog};
  document.addEventListener('DOMContentLoaded',()=>{
    const b=document.getElementById('runDebug'); if(b) b.addEventListener('click', run);
    const ex=document.getElementById('exportDebug'); if(ex) ex.addEventListener('click', exportLog);
  });
})();
