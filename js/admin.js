
(function(){
  const KEY = 'dadventures.admin';
  function isAdmin(){ return localStorage.getItem(KEY) === '1'; }
  function requireAdmin(el){
    if(!el) return;
    if(isAdmin()) el.classList.add('visible'); else el.classList.remove('visible');
  }
  function login(pw){
    // simple mock hash check (not real security)
    const ok = (pw || '').trim() === 'Dadventures!2025';
    if(ok){ localStorage.setItem(KEY,'1'); }
    return ok;
  }
  function logout(){ localStorage.removeItem(KEY); }

  function initAdminUI(){
    // Toggle debug panel visibility by admin
    document.querySelectorAll('.debug').forEach(requireAdmin);

    const form = document.getElementById('loginForm');
    if(form){
      form.addEventListener('submit', e => {
        e.preventDefault();
        const pw = form.querySelector('input[type="password"]').value;
        const note = document.getElementById('loginNote');
        if(login(pw)){
          location.href = 'admin.html';
        }else{
          if(note){ note.textContent = 'Invalid password'; }
        }
      });
    }
  }

  window.DadventuresAdmin = { isAdmin, login, logout, requireAdmin };
  document.addEventListener('DOMContentLoaded', initAdminUI);
})();
