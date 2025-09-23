
// v3.4.14 STRICT — hamburger beside clock, single audio, center tabs

// Theme glow (theme + admin override)
(function(){
  function computeGlow(){
    var theme = localStorage.getItem('dad_theme') || 'blue';
    var glow = '#1fb6ff';
    if (theme==='pink') glow='#ff4d94';
    if (theme==='purple') glow='#9b59b6';
    if (theme==='green') glow='#2ecc71';
    if (theme==='orange') glow='#e67e22';
    if (theme==='gold') glow='#f1c40f';
    var ov = document.body.getAttribute('data-glow-override');
    if (ov) glow = ov;
    document.documentElement.style.setProperty('--theme-glow', glow);
  }
  computeGlow(); window.addEventListener('storage', computeGlow);
})();

// Mobile menu: copy existing header nav into overlay


// Audio: keep only the main bottom bar; remove any floating/duplicate panels
(function(){
  // Known duplicate classes/ids
  var selectors = [
    '.floating-player', '#music-overlay', '.music-overlay', '.audio-floating', '.player-overlay',
    '#musicPanel', '.music-panel', '#floatingMusic', '.floating-music'
  ];
  selectors.forEach(function(sel){ document.querySelectorAll(sel).forEach(function(el){ el.remove(); }); });

  // Heuristic: remove any fixed-position containers with a button + range that are NOT #audioControls
  document.querySelectorAll('div,section').forEach(function(el){
    var cs = getComputedStyle(el);
    if (cs.position === 'fixed' && (el.id||'') !== 'audioControls'){
      if (el.querySelector('button') && el.querySelector('input[type="range"]')){
        el.remove();
      }
    }
  });
  // Log number of bottom bars
  var bars = document.querySelectorAll('#audioControls');
  console.log('audioControls bars found =', bars.length);
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
