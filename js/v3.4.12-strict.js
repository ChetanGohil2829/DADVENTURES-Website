
// v3.4.12 STRICT

// 1) Theme glow + override
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

// 3) Hamburger mobile menu toggle
(function(){
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var sourceNav = document.querySelector('header nav');
  if (!toggle || !mobileNav || !sourceNav) return;
  var links = mobileNav.querySelector('.mobile-links');
  if (!links) {
    links = document.createElement('div');
    links.className = 'mobile-links';
    mobileNav.appendChild(links);
  }
  if (links.children.length === 0) {
    links.innerHTML = sourceNav.innerHTML; // copy existing nav links
  }
  toggle.addEventListener('click', function(){
    mobileNav.classList.toggle('active');
  });
})();

// 4) Console check for soundbar
(function(){
  var globalBars = document.querySelectorAll('#globalMusic, #globalSoundbar');
  console.log("Soundbars detected:", globalBars.length);
})();
