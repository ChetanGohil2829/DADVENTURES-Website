
(function(){
  const THEME_KEY='dadventures.theme';
  const themes=['blue','purple','pink','gold','bronze','green','orange'];
  const fav={
    blue:'images/favicon-blue.png', purple:'images/favicon-purple.png', pink:'images/favicon-pink.png',
    gold:'images/favicon-gold.png', bronze:'images/favicon-bronze.png', green:'images/favicon-green.png', orange:'images/favicon-orange.png'
  };
  function ensureIcon(){ let l=document.querySelector('link[rel~="icon"]'); if(!l){ l=document.createElement('link'); l.rel='icon'; document.head.appendChild(l); } return l; }
  function setTheme(t){
    if(!themes.includes(t)) t='blue';
    localStorage.setItem(THEME_KEY,t);
    document.documentElement.classList.remove(...themes.map(x=>'theme-'+x));
    document.documentElement.classList.add('theme-'+t);
    ensureIcon().href = fav[t] || fav.blue;
    // teepee logo top-left
    const header=document.querySelector('header')||document.body;
    let brand = header.querySelector('.logo');
    if(!brand){
      brand=document.createElement('a'); brand.className='logo'; brand.href='index.html';
      const img=document.createElement('img'); img.alt='Dadventures logo'; img.style.height='28px'; img.src='images/logo-teepee.png';
      brand.appendChild(img); header.insertBefore(brand, header.firstChild);
    } else {
      const img=brand.querySelector('img')||(()=>{const i=document.createElement('img'); i.alt='Dadventures logo'; i.style.height='28px'; brand.appendChild(i); return i;})();
      if(!/logo-teepee\.png/i.test(img.src)) img.src='images/logo-teepee.png';
      img.style.filter='drop-shadow(0 0 8px rgba(0,160,255,.55))';
    }
    // accent color per theme
    const accents={blue:'#00a0ff',purple:'#785aff',pink:'#ff50a0',gold:'#ffc850',bronze:'#cd7f32',green:'#00c896',orange:'#ff8c00'};
    document.documentElement.style.setProperty('--accent', accents[t]||'#00a0ff');
  }
  function tweakNav(){
    const nav=(document.querySelector('header nav')||document.querySelector('nav')); if(!nav) return;
    function add(text,href){
      if(Array.from(nav.querySelectorAll('a')).some(a=>(a.textContent||'').trim().toLowerCase()===text.toLowerCase())) return;
      const a=document.createElement('a'); a.href=href; a.textContent=text;
      const base=nav.querySelector('a'); if(base){ a.className=base.className; a.style.padding=getComputedStyle(base).padding; a.style.borderRadius=getComputedStyle(base).borderRadius; }
      nav.appendChild(a);
    }
    add('Join Us','join.html'); add('Blog','blog.html'); add('Sign In','signin.html'); add('Control Panel','admin.html');
    nav.querySelectorAll('a').forEach(a=>{ if((a.textContent||'').trim().toLowerCase()==='debug'){ a.style.display='none'; } });
  }
  function fixFooter(){
    const footer=document.querySelector('footer'); if(!footer) return;
    const host=footer.querySelector('.footer-inner')||footer;
    // copyright
    const txt='Copyright 2025 DADVENTURES';
    let copyEl=[...host.childNodes].find(n=>(n.textContent||'').toLowerCase().includes('copyright'));
    if(copyEl){ copyEl.textContent=txt; } else { const d=document.createElement('div'); d.textContent=txt; host.prepend(d); }
    // links
    if(!footer.querySelector('a[href*="tiktok.com"]')){
      const links=[
        ['https://www.tiktok.com','TikTok'],
        ['https://www.instagram.com','Instagram'],
        ['https://www.facebook.com','Facebook']
      ];
      links.forEach((L,i)=>{ const a=document.createElement('a'); a.href=L[0]; a.target='_blank'; a.rel='noopener'; a.textContent=L[1]; host.appendChild(a); if(i<links.length-1) host.appendChild(document.createTextNode(' · ')); });
    }
  }
  function setHeaderHeight(){
    const h=document.querySelector('header'); const v=h? (h.getBoundingClientRect().height|0) : 72;
    document.documentElement.style.setProperty('--header-h', v+'px');
  }
  function hideLegacyHeaderAudio(){
    const header=document.querySelector('header'); if(!header) return;
    header.querySelectorAll('input[type="range"]').forEach(el=>{ el.style.display='none'; });
    header.querySelectorAll('button,a').forEach(el=>{
      const t=(el.textContent||'').trim().toLowerCase();
      if(t==='play'||t==='pause') el.style.display='none';
    });
  }
  function init(){ setTheme(localStorage.getItem(THEME_KEY)||'blue'); tweakNav(); fixFooter(); setHeaderHeight(); hideLegacyHeaderAudio(); window.addEventListener('resize', setHeaderHeight); }
  window.DadventuresTheme={setTheme,init};
  document.addEventListener('DOMContentLoaded', init);
})();
