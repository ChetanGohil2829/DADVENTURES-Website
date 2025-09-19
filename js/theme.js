
(function(){
  const THEME_KEY='dadventures.theme';
  const themes=['green','orange','pink','purple','gold','bronze'];
  const fav={green:'images/favicon-green.png',orange:'images/favicon-orange.png',pink:'images/favicon-pink.png',purple:'images/favicon-purple.png',gold:'images/favicon-gold.png',bronze:'images/favicon-bronze.png',default:'images/favicon-default.png'};
  const pairs={green:'orange',pink:'purple',gold:'bronze'};
  const mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');
  function ensureIcon(){let l=document.querySelector('link[rel~="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l);}return l;}
  function resolve(t){try{if(mq&&mq.matches&&pairs[t])return pairs[t];}catch(e){}return t;}
  function setTheme(t){ if(!themes.includes(t)) t='green'; localStorage.setItem(THEME_KEY,t);
    document.documentElement.classList.remove(...themes.map(x=>'theme-'+x));
    const applied=resolve(t); document.documentElement.classList.add('theme-'+applied);
    ensureIcon().href = fav[applied] || fav.default;
    document.querySelectorAll('.logo img, img[alt*="logo" i]').forEach(img=>{ if(img && !/logo-teepee\.png$/i.test(img.src)) img.src='images/logo-teepee.png'; });
  }
  function init(){ setTheme(localStorage.getItem(THEME_KEY)||'green'); document.querySelectorAll('[data-theme]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault(); setTheme(x.getAttribute('data-theme'));})); if(mq&&mq.addEventListener){ mq.addEventListener('change',()=>setTheme(localStorage.getItem(THEME_KEY)||'green')); } }
  window.DadventuresTheme={setTheme,init};
  document.addEventListener('DOMContentLoaded', init);
})();
