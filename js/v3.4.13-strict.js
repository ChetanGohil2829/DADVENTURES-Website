
// v3.4.13 STRICT

// Compute glow (theme + optional admin override)
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
  computeGlow();
  window.addEventListener('storage', computeGlow);
})();

// Prepare mobile menu
(function(){
  var toggle = document.querySelector('header .menu-toggle');
  var mobile = document.querySelector('.mobile-nav');
  var headerNav = document.querySelector('header nav');
  if(!toggle || !mobile || !headerNav) return;
  var links = mobile.querySelector('.mobile-links');
  if (links && links.children.length === 0){
    links.innerHTML = headerNav.innerHTML;
  }
  toggle.addEventListener('click', function(){
    mobile.classList.toggle('active');
  });
})();

// Soundbar check
(function(){
  var header = document.querySelector('header');
  if (header){
    header.querySelectorAll('audio, .volume-controls').forEach(function(el){ el.remove(); });
  }
  var globals = document.querySelectorAll('#globalMusic, #globalSoundbar, .global-soundbar');
  console.log('Global soundbars found =', globals.length);
})();
