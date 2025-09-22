// SPA Router v3.5.5
(function(){
  function sanitize(html){
    // Drop any duplicate footer blocks that may exist in some partials
    return html.replace(/<footer[\s\S]*?<\/footer>/ig,'')
               .replace(/<div[^>]+class=["']footer-links["'][\s\S]*?<\/div>/ig,'')
               .replace(/<div[^>]+class=["']footer-copy["'][\s\S]*?<\/div>/ig,'')
               .replace(/<div[^>]+class=["']mobile-nav["'][\s\S]*?<\/div>/ig,'');
  }
  function loadPage(path, push){
    var app=document.getElementById('app');
    if(!app) return;
    var file = (path==='index' || path==='') ? 'home' : path;
    fetch('partials/'+file+'.html').then(function(r){ return r.ok ? r.text() : ''; }).then(function(html){
      app.innerHTML = sanitize(html||'');
      // active nav highlighting
      document.querySelectorAll('header nav a').forEach(function(a){
        a.classList.remove('active');
        if((path==='index' && a.getAttribute('href').includes('index.html')) ||
           a.getAttribute('href').includes(file+'.html')){
          a.classList.add('active');
        }
      });
      if(push){ history.pushState({path:file}, '', (file==='home'?'index':file)+'.html'); }
    }).catch(function(){});
  }
  // Intercept nav clicks (header + mobile nav)
  document.addEventListener('click', function(e){
    var a=e.target.closest('a');
    if(!a) return;
    var href=a.getAttribute('href')||'';
    if(a.target==='_blank') return;
    if(/^https?:/i.test(href) || href.startsWith('#')) return;
    // Only intercept site page links that end with .html
    if(/\.html$/i.test(href)){
      e.preventDefault();
      var page=href.replace(/^\//,'').replace(/\.html$/i,'');
      loadPage(page,true);
    }
  });
  // Back/forward
  window.addEventListener('popstate', function(e){
    var st=e.state; if(st && st.path){ loadPage(st.path,false); }
  });
  // Default initial load: map index->home
  var initial=(location.pathname.split('/').pop().replace(/\.html$/i,''))||'home';
  if(initial==='index') initial='home';
  loadPage(initial,false);
})();