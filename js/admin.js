
(function(){
  const KEY='dadventures.admin';
  function isAdmin(){ return localStorage.getItem(KEY)==='1'; }
  function login(u,p){ const ok=(u||'').trim().length>0 && (p||'').trim()==='Dadventures!2025'; if(ok) localStorage.setItem(KEY,'1'); return ok; }
  function logout(){ localStorage.removeItem(KEY); location.href='index.html'; }
  function bindControls(){
    const fs=document.getElementById('fontSize'); if(fs){ fs.addEventListener('input',()=>{ document.documentElement.style.setProperty('--font-size', fs.value+'px'); }); }
    document.querySelectorAll('[data-theme]').forEach(b=> b.addEventListener('click',e=>{ e.preventDefault(); window.DadventuresTheme&&DadventuresTheme.setTheme(b.getAttribute('data-theme')); }));
    const reset=document.getElementById('resetAll'); if(reset){ reset.addEventListener('click',()=>{ localStorage.clear(); location.reload(); }); }
  }
  function init(){
    const form=document.getElementById('loginForm');
    if(form){
      form.addEventListener('submit',e=>{
        e.preventDefault();
        const u=form.querySelector('input[name="username"]').value;
        const pw=form.querySelector('input[type="password"]').value;
        const note=document.getElementById('loginNote');
        if(login(u,pw)){ location.href='admin.html'; } else { if(note) note.textContent='Invalid credentials'; }
      });
      const fp=document.getElementById('forgot'); if(fp){ fp.addEventListener('click',e=>{e.preventDefault(); alert('Password reset link will be emailed (mock).'); }); }
    }
    if(document.body.classList.contains('admin-page')){
      if(!isAdmin()){ location.href='signin.html'; return; }
      bindControls();
    }
  }
  window.DadventuresAdmin={isAdmin,logout};
  document.addEventListener('DOMContentLoaded', init);
})();
