
(function(){
  function apply(d){
    var root = document.documentElement;
    if(!d) return;
    if(d.box_glow) root.style.setProperty('--box-glow', d.box_glow);
    if(d.box_glow_hover) root.style.setProperty('--box-glow-hover', d.box_glow_hover);
    if(d.home_image_hover_scale) root.style.setProperty('--home-img-scale', d.home_image_hover_scale);
  }
  fetch('content/pages/design.json', {cache:'no-store'})
    .then(r => r.ok ? r.json() : null)
    .then(apply).catch(()=>{});
})();
