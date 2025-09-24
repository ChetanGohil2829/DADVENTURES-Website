
// Runtime design settings from CMS (design.json)
(function(){
  function applyDesign(d){
    if(!d) return;
    var root = document.documentElement;
    if(d.box_glow) root.style.setProperty('--box-glow', d.box_glow);
    if(d.box_glow_hover) root.style.setProperty('--box-glow-hover', d.box_glow_hover);
  }
  try {
    fetch('/content/pages/design.json', {cache:'no-store'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(applyDesign)
      .catch(function(){ /* silent */ });
  } catch(e){ /* silent */ }
})();
