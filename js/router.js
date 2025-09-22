// SPA Router v3.5.2
(function(){
  function loadPage(path, push){
    const app=document.getElementById('app');
    if(!app) return;
    fetch('partials/'+path+'.html').then(r=>{
      if(!r.ok) return "";
      return r.text();
    }).then(html=>{
      app.innerHTML=html||"";
      document.querySelectorAll('header nav a').forEach(a=>{
        a.classList.remove('active');
        if(a.getAttribute('href').includes(path)) a.classList.add('active');
      });
      if(push) history.pushState({path},'',path+'.html');
    }).catch(()=>{});
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(a && a.getAttribute('href') && !a.getAttribute('href').startsWith('http')){
      const href=a.getAttribute('href');
      const page=href.replace('.html','').replace('/','');
      if(page){
        e.preventDefault();
        loadPage(page,true);
      }
    }
  });
  window.addEventListener('popstate',e=>{
    const st=e.state; if(st&&st.path){ loadPage(st.path,false); }
  });
  // Default load home
  const path=location.pathname.split('/').pop().replace('.html','')||'home';
  loadPage(path||'home',false);
})();