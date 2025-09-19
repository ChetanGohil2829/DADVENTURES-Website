
(function(){
  function q(s,root){ return (root||document).querySelector(s); }

  // Remove Join Us + Control Panel tabs if exist
  document.querySelectorAll('nav a').forEach(a=>{
    if(/join us|control panel/i.test(a.textContent)){ a.remove(); }
  });

  // MUSIC setup
  var trailer = document.querySelector('#trailer, footer, .trailer, .footer') || document.body;
  if(trailer){
    var icon=document.createElement('button');
    icon.id='dad-music-icon';
    icon.innerHTML='🎵';
    trailer.appendChild(icon);

    var panel=document.createElement('div');
    panel.id='dad-music-panel';
    panel.innerHTML='<button id="music-play">Play</button><input id="music-vol" type="range" min="0" max="1" step="0.01" value="0.7">';
    trailer.appendChild(panel);

    var audio=document.querySelector('#bg-music');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='bg-music';
      audio.src='/assets/audio/relaxing-piano.mp3';
      audio.loop=true; audio.preload='auto';
      document.body.appendChild(audio);
    }
    var playBtn=panel.querySelector('#music-play');
    var vol=panel.querySelector('#music-vol');

    // Autoplay muted until first click
    audio.volume=0;
    audio.play().catch(()=>{});
    document.addEventListener('click',function once(){
      audio.volume=parseFloat(vol.value);
      document.removeEventListener('click',once);
    });

    icon.addEventListener('click',()=>{
      panel.classList.toggle('open');
    });

    if(playBtn){
      playBtn.addEventListener('click',()=>{
        if(audio.paused){ audio.play(); playBtn.textContent='Pause'; }
        else { audio.pause(); playBtn.textContent='Play'; }
      });
    }
    if(vol){
      vol.addEventListener('input',()=>{ audio.volume=parseFloat(vol.value); });
    }
  }
})();