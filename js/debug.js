
function sanitize(s){ return String(s||'').replace(/[^\w\s\-\.:@/]/g,''); }
function load(){
  var tb = document.querySelector('#tbl tbody');
  tb.innerHTML = '';
  var rows = []; try{ rows = JSON.parse(localStorage.getItem('dbg')||'[]'); }catch(e){ rows=[]; }
  rows.forEach(function(r){
    var tr = document.createElement('tr');
    var t = new Date(r.t||Date.now()).toLocaleString();
    tr.innerHTML = '<td>'+sanitize(t)+'</td><td>'+sanitize(r.type)+'</td><td>'+sanitize(JSON.stringify(r))+'</td>';
    tb.appendChild(tr);
  });
}
document.getElementById('refresh').onclick = load;
document.getElementById('clear').onclick = function(){ localStorage.setItem('dbg','[]'); load(); };
document.getElementById('download').onclick = function(){
  var rows = []; try{ rows = JSON.parse(localStorage.getItem('dbg')||'[]'); }catch(e){ rows=[]; }
  var header = 'time,type,data\\n';
  var csv = header + rows.map(function(r){ return new Date(r.t||Date.now()).toISOString()+','+(r.type||'')+','+((JSON.stringify(r)||'').replace(/,/g,';')); }).join('\\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='debug.csv'; document.body.appendChild(a); a.click(); a.remove();
};
document.getElementById('close').onclick = function(){ history.back(); };
load();
