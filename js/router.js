// SPA Router v3.5.6
(function(){
  function sanitize(html){
    return html.replace(/<footer[\s\S]*?<\/footer>/ig,'')
               .replace(/<div[^>]+class=["']mobile-nav["'][\s\\S]*?<\\/div>/ig,'');
  }
  function closeMobileNav(){
    var mn=document.querySelector('.mobile-nav');
    if(mn) mn.classList.remove('active');
  }
  function setActive(path){
    document.querySelectorAll('header nav a').forEach(function(a){
      a.classList.remove('active');
      if(a.getAttribute('href') && a.getAttribute('href').indexOf(path+'.html')>-1){
        a.classList.add('active');
      }
    });
  }
  function loadPage(path, push){
    var app=document.getElementById('app'); if(!app) return;
    var file=(path==='index'||path==='')?'home':path;
    fetch('partials/'+file+'.html').then(function(r){return r.ok?r.text():''}).then(function(html){
      app.innerHTML = sanitize(html||'');
      setActive(file);
      if(push){ history.pushState({path:file},'',(file==='home'?'index':file)+'.html'); }
      closeMobileNav();
      // run any inline scripts in the injected HTML
      app.querySelectorAll('script').forEach(function(s){
        var n=document.createElement('script');
        if(s.src){ n.src=s.src; } else { n.textContent=s.textContent; }
        document.body.appendChild(n); setTimeout(function(){ n.remove(); },0);
      });
    });
  }
  document.addEventListener('click', function(e){
    var a=e.target.closest('a'); if(!a) return;
    var href=a.getAttribute('href')||'';
    if(a.target==='_blank' || /^https?:/i.test(href) || href.startsWith('#')) return;
    if(/\.html$/i.test(href)){
      e.preventDefault();
      var page=href.replace(/^\//,'').replace(/\.html$/i,'');
      loadPage(page,true);
    }
  });
  window.addEventListener('popstate', function(e){ var st=e.state; if(st&&st.path){ loadPage(st.path,false); } });
  // initial
  var initial=(location.pathname.split('/').pop().replace(/\.html$/i,''))||'home';
  if(initial==='index') initial='home';
  loadPage(initial,false);
})();