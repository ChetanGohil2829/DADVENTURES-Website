
// v3.4.11 STRICT — implements 4 requested changes

// 1) Theme glow + admin override
(function(){
  function computeGlow(){
    var theme = localStorage.getItem('dad_theme') || 'blue';
    var glow = '#1fb6ff';
    if (theme === 'pink') glow = '#ff4d94';
    if (theme === 'purple') glow = '#9b59b6';
    if (theme === 'green') glow = '#2ecc71';
    if (theme === 'orange') glow = '#e67e22';
    if (theme === 'gold') glow = '#f1c40f';
    var override = document.body.getAttribute('data-glow-override');
    if (override) glow = override;
    document.documentElement.style.setProperty('--theme-glow', glow);
  }
  computeGlow();
  window.addEventListener('storage', computeGlow);
})();

// 3) Mobile wardrobe menu toggle


// 4) Remove header soundbar
(function(){
  var header = document.querySelector('header');
  if (!header) return;
  header.querySelectorAll('audio, .volume-controls').forEach(function(el){ el.remove(); });
})();


// v3.5.17 menu fix
(function(){
  var toggleBtns=document.querySelectorAll('header .menu-toggle');
  var mobile=document.querySelector('.mobile-nav');
  var headerNav=document.querySelector('header nav');
  if(!mobile || !headerNav) return;
  var links=mobile.querySelector('.mobile-links');
  if(links && links.children.length===0){
    links.innerHTML=headerNav.innerHTML;
  }
  toggleBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      mobile.classList.toggle('active');
    }, {passive:true});
  });
  if(links){
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobile.classList.remove('active'); }, {passive:true});
    });
  }
})();
