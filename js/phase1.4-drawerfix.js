
(function(){
  function q(s){return document.querySelector(s);}

  // Toggle drawers
  const navBtn=q('#nav-btn'); const nav=q('#nav-drawer');
  if(navBtn && nav){ navBtn.addEventListener('click',()=>{nav.classList.toggle('open');}); }

  const musicBtn=q('#music-btn'); const musicDrawer=q('#music-drawer');
  if(musicBtn && musicDrawer){ musicBtn.addEventListener('click',()=>{musicDrawer.classList.toggle('open');}); }

  // Music controls
  const audio=q('#bg-music'); const playBtn=q('#music-play'); const vol=q('#music-vol');
  if(audio && playBtn){
    playBtn.addEventListener('click',()=>{
      if(audio.paused){ audio.play(); playBtn.textContent='Pause'; }
      else { audio.pause(); playBtn.textContent='Play'; }
    });
  }
  if(audio && vol){
    vol.addEventListener('input',()=>{ audio.volume=vol.value; });
  }
})();
