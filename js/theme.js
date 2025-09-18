
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
