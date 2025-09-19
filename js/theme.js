
(function(){
  const savedTheme = localStorage.getItem('theme') || 'gold';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const savedFont = localStorage.getItem('fontFamily') || 'Inter, system-ui, sans-serif';
  document.documentElement.style.setProperty('--font-family', savedFont);
  document.body.style.fontFamily = 'var(--font-family)';
  window.Theme = {
    setTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); },
    setFont(f){
      const link = document.getElementById('google-font') || (function(){ const l=document.createElement('link');l.id='google-font';l.rel='stylesheet';document.head.appendChild(l);return l;})();
      link.href = 'https://fonts.googleapis.com/css2?family='+encodeURIComponent(f)+':wght@300;400;600;800&display=swap';
      document.documentElement.style.setProperty('--font-family', `'${f}', system-ui, sans-serif`);
      localStorage.setItem('fontFamily', f);
    },
    reset(){ localStorage.removeItem('theme'); localStorage.removeItem('fontFamily'); location.reload(); }
  };
})();


// Update homepage title and hero tint by theme
(function(){
  function applyThemeUI(){
    const t = document.documentElement.getAttribute('data-theme') || 'gold';
    const nameMap = {gold:'Dadventures • Gold', green:'Dadventures • Green', pink:'Dadventures • Pink'};
    const h = document.getElementById('home_title') || document.getElementById('site-name');
    if(h){ h.textContent = nameMap[t] || 'Dadventures'; }
    const hero = document.getElementById('hero');
    if(hero){
      if(t==='gold') hero.style.background = 'linear-gradient(135deg, rgba(184,115,51,.25), rgba(255,212,121,.15))';
      if(t==='green') hero.style.background = 'linear-gradient(135deg, rgba(40,167,69,.25), rgba(255,140,43,.15))';
      if(t==='pink') hero.style.background = 'linear-gradient(135deg, rgba(214,51,132,.25), rgba(86,204,255,.15))';
    }
  }
  window.Theme.applyThemeUI = applyThemeUI;
  // Patch into existing setter
  const _setTheme = window.Theme.setTheme;
  window.Theme.setTheme = function(t){ _setTheme(t); setTimeout(applyThemeUI, 0); };
  document.addEventListener('DOMContentLoaded', applyThemeUI);
})();
