
(function(){
  function syncAllButtons(audio){
    document.querySelectorAll('#globalPlayPause').forEach(function(btn){
      btn.textContent = audio.paused ? 'Play' : 'Pause';
    });
    document.querySelectorAll('#globalVol').forEach(function(sl){
      sl.value = audio.volume;
    });
  }
  function init(){
    var audio = document.getElementById('globalMusic');
    if(!audio) return;
    var vol = parseFloat(localStorage.getItem('music_vol')||'0.4');
    if(isNaN(vol)) vol=0.4;
    audio.volume = vol;
    if(localStorage.getItem('music_play')==='true'){
      audio.muted=false;
      audio.play().catch(function(){});
    }
    document.addEventListener('click', function once(){ 
      if(localStorage.getItem('music_play')==='true'){
        audio.muted=false;
        audio.play().catch(function(){});
      }
      document.removeEventListener('click', once);
    });
    document.querySelectorAll('#globalVol').forEach(function(sl){
      sl.addEventListener('input', function(){
        audio.volume = +sl.value;
        localStorage.setItem('music_vol', String(audio.volume));
        document.querySelectorAll('#globalVol').forEach(function(s2){ if(s2!==sl) s2.value = sl.value; });
      });
    });
    document.querySelectorAll('#globalPlayPause').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(audio.paused){ audio.muted=false; audio.play().catch(function(){}); localStorage.setItem('music_play','true'); }
        else { audio.pause(); localStorage.setItem('music_play','false'); }
        syncAllButtons(audio);
      });
    });
    if(!document.getElementById('musicBar')){
      var bar = document.createElement('div');
      bar.id='musicBar';
      bar.setAttribute('role','region');
      bar.style.position='fixed'; bar.style.left='0'; bar.style.right='0'; bar.style.bottom='0';
      bar.style.background='rgba(11,12,18,0.7)'; bar.style.backdropFilter='blur(6px)';
      bar.style.borderTop='1px solid #1d2230'; bar.style.padding='8px'; bar.style.display='flex'; bar.style.justifyContent='center'; bar.style.zIndex='50';
      bar.innerHTML = '<div class="volume-controls" style="display:flex;gap:8px;align-items:center">'
        + '<button id="globalPlayPause" class="btn">Play</button>'
        + '<input id="globalVol" type="range" min="0" max="1" step="0.01" value="'+audio.volume+'"/>'
        + '</div>';
      document.body.appendChild(bar);
    }
    syncAllButtons(audio);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
