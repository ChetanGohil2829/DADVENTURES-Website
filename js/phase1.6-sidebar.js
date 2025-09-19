
(function(){
  function q(s,root){ return (root||document).querySelector(s); }
  function qa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  // Clean old experimental overlays if any
  qa('#dad-header, #nav-drawer, #music-drawer').forEach(el => el && el.remove());

  // Remove stray /1 or \1 in headers globally
  qa('header').forEach(h => { if(h) h.innerHTML = h.innerHTML.replaceAll('/1','').replaceAll('\\1',''); });

  // ===== NAV: move the real nav into a left sidebar on toggle =====
  // Find header and its nav
  var header = q('header');
  var nav = header ? q('nav, .nav', header) : null;
  if(header && nav){
    // Add hamburger icon to existing header (right side)
    var btn = document.createElement('button');
    btn.id = 'dad-nav-toggle';
    btn.className = 'dad-icon';
    btn.title = 'Open navigation';
    btn.innerHTML = '<svg width="26" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="0" width="24" height="2" rx="1" fill="currentColor"/><rect y="8" width="24" height="2" rx="1" fill="currentColor"/><rect y="16" width="24" height="2" rx="1" fill="currentColor"/></svg>';
    // Try place at end of header
    header.appendChild(btn);

    // Create aside container (hidden by default)
    var aside = document.createElement('div');
    aside.id = 'dad-aside-nav';
    document.body.appendChild(aside);

    // Placeholder to remember original nav position
    var placeholder = document.createElement('span');
    placeholder.id = 'dad-nav-placeholder';
    nav.parentNode.insertBefore(placeholder, nav);
    var asideOpen = false;

    btn.addEventListener('click', function(){
      if(!asideOpen){
        // Move nav into aside and make vertical
        aside.appendChild(nav);
        document.body.classList.add('dad-aside-open');
        aside.classList.add('open');
        asideOpen = true;
      }else{
        // Move nav back into header
        placeholder.parentNode.insertBefore(nav, placeholder);
        document.body.classList.remove('dad-aside-open');
        aside.classList.remove('open');
        asideOpen = false;
      }
    });
  }

  // ===== MUSIC: add icon to the trailer bar and open panel from left =====
  // Find existing trailer/music bar (look for #music-bar or bar with a Play button)
  var musicBar = q('#music-bar') || qa('div,footer,section').find(el => /Play/i.test(el.textContent||''));
  if(musicBar){
    // Add themed SVG music icon to the bar
    var iconWrap = document.createElement('button');
    iconWrap.id = 'dad-music-icon';
    iconWrap.className = 'dad-icon';
    iconWrap.title = 'Music controls';
    iconWrap.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 19a3 3 0 1 1-2-2.83V5l12-2v10.17A3 3 0 1 1 18 19a3 3 0 0 1 1-2.24V6.03l-8 1.33V16.17A3 3 0 1 1 9 19z"/></svg>';
    musicBar.appendChild(iconWrap);

    // Create music panel (slides from left)
    var panel = document.createElement('div');
    panel.id = 'dad-music-panel';
    panel.innerHTML = `
      <button id="dad-music-play">Play</button>
      <input id="dad-music-vol" type="range" min="0" max="1" step="0.01" value="0.7">
    `;
    document.body.appendChild(panel);

    // Attach to existing <audio> if present, else create one hidden
    var audio = q('#bg-music');
    if(!audio){
      audio = document.createElement('audio');
      audio.id = 'bg-music';
      audio.src = '/assets/audio/relaxing-piano.mp3';
      audio.loop = true;
      audio.preload = 'auto';
      audio.style.display = 'none';
      document.body.appendChild(audio);
    }
    var playBtn = q('#dad-music-play');
    var vol = q('#dad-music-vol');

    iconWrap.addEventListener('click', function(){
      panel.classList.toggle('open');
    });

    if(playBtn){
      playBtn.addEventListener('click', function(){
        if(audio.paused){ audio.play(); playBtn.textContent = 'Pause'; }
        else { audio.pause(); playBtn.textContent = 'Play'; }
      });
    }
    if(vol){
      vol.addEventListener('input', function(){ audio.volume = parseFloat(vol.value); });
    }
  }
})();