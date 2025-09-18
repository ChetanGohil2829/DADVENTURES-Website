
(function(){
  if (!window.netlifyIdentity) {
    var s = document.createElement('script');
    s.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.defer = true; document.head.appendChild(s);
  }
  window.isAdmin = function(){ 
    try{ const u = window.netlifyIdentity && window.netlifyIdentity.currentUser(); return !!u; }catch(e){ return false; }
  };
  window.requireAdmin = function(){
    if(!window.isAdmin()){ alert('Admin sign-in required'); location.href = 'signin.html'; }
  };
})();
