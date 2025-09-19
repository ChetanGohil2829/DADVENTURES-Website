(function(){
const THEME_KEY='dadventures.theme';const themes=['green','orange','pink','purple','gold','bronze'];
const fav={green:'images/favicon-green.png',orange:'images/favicon-orange.png',pink:'images/favicon-pink.png',purple:'images/favicon-purple.png',gold:'images/favicon-gold.png',bronze:'images/favicon-bronze.png',default:'images/favicon-default.png'};
function ensure(){let l=document.querySelector('link[rel~="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l);}return l;}
function setTheme(t){if(!themes.includes(t))t='green';localStorage.setItem(THEME_KEY,t);document.documentElement.classList.remove(...themes.map(x=>'theme-'+x));document.documentElement.classList.add('theme-'+t);ensure().href=fav[t]||fav.default;}
function init(){setTheme(localStorage.getItem(THEME_KEY)||'green');document.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();setTheme(b.getAttribute('data-theme'));}));}
window.DadventuresTheme={setTheme,init};document.addEventListener('DOMContentLoaded',init);}())