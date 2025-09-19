
(function(){
  function logDebug(msg){
    try{
      var dbg = document.getElementById('admin-debug');
      if(dbg){ var p = document.createElement('div'); p.textContent = '['+ new Date().toISOString().slice(0,19).replace('T',' ') +'] ' + msg; dbg.appendChild(p); }
      console.log(msg);
    }catch(e){}
  }
  var audio = document.getElementById('bg-music');
  try{
    if(audio){
      var saved = sessionStorage.getItem('dad_music_time');
      var vol = sessionStorage.getItem('dad_music_vol');
      if(saved) audio.currentTime = parseFloat(saved);
      if(vol) audio.volume = parseFloat(vol);
      logDebug('MUSIC: Player initialized successfully.');
    }
  }catch(e){ logDebug('MUSIC: Failed to initialize — fallback active.'); }
  try{
    var toggle = document.getElementById('music-toggle');
    var volEl = document.getElementById('music-vol');
    if(toggle && audio){
      toggle.addEventListener('click', function(){
        if(audio.paused){ audio.play(); toggle.textContent='Pause'; logDebug('MUSIC: Playback started at ' + Math.floor(audio.currentTime)); }
        else { audio.pause(); toggle.textContent='Play'; logDebug('MUSIC: Playback paused at ' + Math.floor(audio.currentTime)); }
      });
    }
    if(volEl && audio){
      volEl.addEventListener('input', function(){ audio.volume = volEl.value; sessionStorage.setItem('dad_music_vol', audio.volume); logDebug('MUSIC: Volume set to ' + Math.round(audio.volume*100) + '%'); });
    }
    window.addEventListener('beforeunload', function(){ try{ sessionStorage.setItem('dad_music_time', audio.currentTime);}catch(e){} });
  }catch(e){ logDebug('MUSIC: Controls binding failed — fallback active.'); }
  // Trailer text effect simple
  try{
    var trailer = document.getElementById('trailer');
    if(trailer){
      var txt = trailer.getAttribute('data-text')||trailer.textContent;
      trailer.textContent=''; var i=0;
      (function step(){ if(i<txt.length){ trailer.textContent += txt[i++]; setTimeout(step,60);} })();
      document.getElementById('trailer-skip') && document.getElementById('trailer-skip').addEventListener('click', function(){ window.location.href='/index.html'; });
      setTimeout(function(){ if(window.location.pathname !== '/index.html') window.location.href='/index.html'; }, 30000);
    }
  }catch(e){}
})();
