
(function(){
  const VKEY = 'dadventures.volume';
  const TKEY = 'dadventures.audio.time';
  const AID = 'globalAudio';

  function initAudio(){
    const audio = document.getElementById(AID);
    if(!audio) return;

    audio.loop = true;
    audio.muted = true; // autoplay policy
    audio.volume = parseFloat(localStorage.getItem(VKEY) || '0.35');
    const last = parseFloat(localStorage.getItem(TKEY) || '0');
    if(!isNaN(last)) { try { audio.currentTime = last % Math.max(1,audio.duration||60); } catch(e){} }

    const tryPlay = () => audio.play().catch(()=>{});
    tryPlay();
    document.addEventListener('click', ()=>{ audio.muted = false; tryPlay(); }, { once:true });

    // Persist last position every 2s
    setInterval(()=>{ try { localStorage.setItem(TKEY, String(audio.currentTime||0)); } catch(e){} }, 2000);

    // Volume control hookup
    document.querySelectorAll('input[type="range"][data-volume]').forEach(r => {
      r.value = String(audio.volume);
      r.addEventListener('input', () => {
        const v = Math.max(0, Math.min(1, parseFloat(r.value)));
        audio.volume = v;
        localStorage.setItem(VKEY, String(v));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAudio);
})();
