(function(){
const KEY='dadventures.admin';function isAdmin(){return localStorage.getItem(KEY)==='1';}
function login(p){const ok=(p||'').trim()==='Dadventures!2025';if(ok)localStorage.setItem(KEY,'1');return ok;}
function init(){const form=document.getElementById('loginForm');if(form){form.addEventListener('submit',e=>{e.preventDefault();const pw=form.querySelector('input[type="password"]').value;const note=document.getElementById('loginNote');if(login(pw)){location.href='admin.html';}else{if(note)note.textContent='Invalid password';}});}}
window.DadventuresAdmin={isAdmin};document.addEventListener('DOMContentLoaded',init);}())