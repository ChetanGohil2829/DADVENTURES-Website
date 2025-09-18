
(function(){
  const AUDIO_SRC = 'audio/relaxing-piano-ambient.wav';
  let audio = document.getElementById('global-audio');
  if(!audio){
    audio = document.createElement('audio');
    audio.id = 'global-audio';
    audio.src = AUDIO_SRC; audio.loop = true; audio.preload = 'auto';
    audio.volume = parseFloat(localStorage.getItem('audioVolume')||'0.3');
    audio.muted = localStorage.getItem('audioMuted')==='true';
    document.body.appendChild(audio);
  }
  const firstTouch = () => { audio.play().catch(()=>{});
    document.removeEventListener('click', firstTouch);
    document.removeEventListener('touchstart', firstTouch);
  };
  document.addEventListener('click', firstTouch);
  document.addEventListener('touchstart', firstTouch);
  if(!document.getElementById('audio-widget')){
    const wrap = document.createElement('div');
    wrap.id='audio-widget';
    wrap.style.cssText='position:fixed;right:12px;bottom:12px;background:#111a;border:1px solid #333;padding:10px;border-radius:12px;backdrop-filter:blur(6px);z-index:9999;';
    wrap.innerHTML = `<div style="font-size:12px;margin-bottom:6px">Music</div>
      <input id="vol" type="range" min="0" max="1" step="0.01" value="${audio.volume}" style="width:140px">
      <button id="mute" class="btn" style="margin-left:8px">${audio.muted?'Unmute':'Mute'}</button>`;
    document.body.appendChild(wrap);
    wrap.querySelector('#vol').addEventListener('input', (e)=>{
      audio.volume = parseFloat(e.target.value);
      localStorage.setItem('audioVolume', String(audio.volume));
      audio.muted = false; localStorage.setItem('audioMuted', 'false');
      audio.play().catch(()=>{});
    });
    wrap.querySelector('#mute').addEventListener('click', (e)=>{
      audio.muted = !audio.muted; e.target.textContent = audio.muted?'Unmute':'Mute';
      localStorage.setItem('audioMuted', audio.muted?'true':'false');
      audio.play().catch(()=>{});
    });
  }
})();
