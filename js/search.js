
async function runSearch(){
  var q = (document.getElementById('search').value||'').trim().toLowerCase();
  var container = document.getElementById('searchResults');
  if(!container) return;
  if(!q){ container.innerHTML=''; return; }
  function card(title, href, extra){
    return "<article class='card'><div style='display:flex;gap:10px;align-items:center'>"
      + "<img src='images/logo-icon.svg' alt='' style='height:18px'/> <strong>"+title+"</strong></div>"
      + (extra? ("<div class='muted'>"+extra+"</div>"):"")
      + "<br/><a class='btn' href='"+href+"'>Open</a></article>";
  }
  var resE = []; try{ resE = await fetch('content/events/events.json').then(function(r){return r.json()}); }catch(e){}
  var resP = []; try{ resP = await fetch('content/products/products.json').then(function(r){return r.json()}); }catch(e){}
  var pages = [
    {title:'Home', href:'index.html', text:'adventures bring us closer'},
    {title:'About', href:'about.html', text:'mission timeline'},
    {title:'Shop', href:'shop.html', text:'cap tshirt mug'},
    {title:'Contact', href:'contact.html', text:'form whatsapp'},
    {title:'Donations', href:'donations.html', text:'support donate'}
  ];
  var results = [];
  resE.forEach(function(e){
    var text = (e.title+' '+e.description+' '+e.route).toLowerCase();
    if(text.includes(q)) results.push(card('Event: '+e.title, 'events.html', new Date(e.datetime).toLocaleString()));
  });
  resP.forEach(function(p){
    var text = (p.title).toLowerCase();
    if(text.includes(q)) results.push(card('Product: '+p.title, 'shop.html'));
  });
  pages.forEach(function(p){ if(p.text.includes(q) || p.title.toLowerCase().includes(q)) results.push(card(p.title, p.href)); });
  container.innerHTML = results.join('') || "<div class='card'>No results for <em>"+q+"</em></div>";
  try{ var logs = JSON.parse(localStorage.getItem('dbg')||'[]'); logs.push({t:Date.now(), type:'search', q:q}); localStorage.setItem('dbg', JSON.stringify(logs)); }catch(e){}
}
document.getElementById('searchBtn')?.addEventListener('click',runSearch);
document.getElementById('search')?.addEventListener('keydown',function(e){ if(e.key==='Enter') runSearch(); });
