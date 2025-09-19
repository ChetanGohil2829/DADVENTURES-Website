
(function(){
  function isNetlify(){ return /netlify\.app$/i.test(location.hostname) || /netlify\.com$/i.test(location.hostname); }
  function handle(form){
    form.addEventListener('submit', function(e){
      if(isNetlify()) return;
      e.preventDefault();
      const ok=document.getElementById('formSuccess');
      if(ok){ ok.style.display='block'; ok.textContent='Thank you — DADVENTURES will respond within 48 hours.'; }
      form.reset();
    });
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('form[data-netlify]').forEach(handle);
  });
})();
