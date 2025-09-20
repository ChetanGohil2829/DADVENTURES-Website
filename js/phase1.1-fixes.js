
(function(){
  function logDebug(msg){
    try{
      var dbg = document.getElementById('admin-debug');
      if(dbg){ var p=document.createElement('div'); p.textContent='['+ new Date().toISOString().slice(0,19).replace('T',' ')+'] '+msg; dbg.appendChild(p); }
    }catch(e){}
  }

  // Header toggle
  try{
    var header=document.querySelector('header.site-header');
    var hbtn=document.getElementById('header-toggle');
    if(hbtn && header){
      hbtn.addEventListener('click', function(){
        header.classList.toggle('reduced');
        hbtn.textContent= header.classList.contains('reduced') ? '˅' : '˄';
      });
    }
  }catch(e){}

  // Music controls
  var audio=document.getElementById('bg-music');
  try{
    if(audio){
      var toggle=document.getElementById('music-toggle');
      var volEl=document.getElementById('music-vol');
      if(toggle){
        toggle.addEventListener('click',function(){
          if(audio.paused){ audio.play(); toggle.textContent='Pause'; logDebug('MUSIC: Play'); }
          else{ audio.pause(); toggle.textContent='Play'; logDebug('MUSIC: Pause'); }
        });
      }
      if(volEl){
        volEl.addEventListener('input',function(){ audio.volume=volEl.value; logDebug('MUSIC: Volume '+Math.round(audio.volume*100)+'%'); });
      }
    }
  }catch(e){ logDebug('MUSIC: Failed controls'); }

  // Music bar reduce/expand
  try{
    var bar=document.getElementById('music-bar');
    var mbtn=document.getElementById('music-resize');
    if(bar && mbtn){
      mbtn.addEventListener('click', function(){
        bar.classList.toggle('reduced');
        mbtn.textContent= bar.classList.contains('reduced') ? '˄' : '˅';
      });
    }
  }catch(e){}

  // Trailer simple fade text
  try{
    var trailer=document.getElementById('trailer');
    if(trailer){
      var txt=trailer.getAttribute('data-text')||trailer.textContent;
      trailer.textContent=''; var i=0;
      (function step(){ if(i<txt.length){ trailer.textContent+=txt[i++]; setTimeout(step,60);} })();
      var skip=document.getElementById('trailer-skip');
      if(skip){ skip.addEventListener('click', function(){ window.location.href='/index.html'; }); }
      setTimeout(function(){ if(window.location.pathname!='/index.html') window.location.href='/index.html'; },30000);
    }
  }catch(e){}
})();
