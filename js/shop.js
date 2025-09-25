
async function loadShop(){
  const res = await fetch('content/products/products.json');
  let items = await res.json();
  const grid = document.getElementById('shopGrid');
  function render(list){
    grid.innerHTML = list.map(function(p){
      return '<article class="card" data-title="'+p.title.toLowerCase()+'">'
        + '<img src="'+p.image+'" alt="" style="width:100%;border-radius:12px;margin-bottom:10px;aspect-ratio:16/9;object-fit:contain;background:#0b0b0e"/>'
        + '<h3>'+p.title+'</h3>'
        + '<p class="muted">£'+p.price.toFixed(2)+'</p>'
        + '<a class="btn" href="'+p.link+'">View</a>'
        + '</article>';
    }).join('');
  }
  render(items);
  const sort = document.getElementById('sort');
  sort.addEventListener('change',function(){
    if(sort.value==='price') items.sort(function(a,b){ return a.price-b.price; });
    else items.sort(function(a,b){ return a.title.localeCompare(b.title); });
    render(items);
  });
  try{ const logs = JSON.parse(localStorage.getItem('dbg')||'[]'); logs.push({t:Date.now(), type:'open_shop'}); localStorage.setItem('dbg', JSON.stringify(logs)); }catch(e){}
}
loadShop();
