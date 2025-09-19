
(function(){
  const THEME_KEY = 'dadventures.theme';
  const themes = ['green','orange','pink','purple','gold','bronze'];
  const favicons = {
    green: 'images/favicon-green.png',
    orange:'images/favicon-orange.png',
    pink:  'images/favicon-pink.png',
    purple:'images/favicon-purple.png',
    gold:  'images/favicon-gold.png',
    bronze:'images/favicon-bronze.png',
    default:'images/favicon-default.png'
  };

  function ensureFaviconLink(){
    let link = document.querySelector('link[rel~="icon"]');
    if(!link){
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    return link;
  }

  function setTheme(theme){
    if(!themes.includes(theme)) theme = 'green';
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.remove(...themes.map(t => 'theme-'+t));
    document.documentElement.classList.add('theme-'+theme);
    // swap favicon
    const link = ensureFaviconLink();
    link.href = favicons[theme] || favicons.default;
    // highlight active nav (optional) - skipped to avoid extra logic
  }

  function initTheme(){
    const saved = localStorage.getItem(THEME_KEY) || 'green';
    setTheme(saved);
    // Hook theme switchers if present
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        setTheme(btn.getAttribute('data-theme'));
      });
    });
  }

  window.DadventuresTheme = { setTheme, initTheme };
  document.addEventListener('DOMContentLoaded', initTheme);
})();
