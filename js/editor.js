
(function(){
  function adminOnly(){ try{ return window.isAdmin && window.isAdmin(); }catch(e){ return false; } }
  if(adminOnly() && !document.getElementById('editor-toolbar')){
    const bar = document.createElement('div');
    bar.id='editor-toolbar';
    bar.style.cssText='position:fixed;left:12px;bottom:12px;background:#111a;border:1px solid #333;padding:10px;border-radius:12px;backdrop-filter:blur(6px);z-index:9999;max-width:320px';
    bar.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Front Panel Editor</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
        <button class="btn" data-act="toggle-edit">Edit Mode</button>
        <button class="btn" data-act="save">Save</button>
        <button class="btn" data-act="export">Export JSON</button>
        <button class="btn" data-act="reset">Reset</button></div>
      <div style="margin-bottom:6px">Theme:</div>
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <button class="btn" onclick="Theme.setTheme('gold')">Gold/Bronze</button>
        <button class="btn" onclick="Theme.setTheme('green')">Green/Orange</button>
        <button class="btn" onclick="Theme.setTheme('pink')">Pink/Purple</button></div>
      <div>Font:</div>
      <select id="fontSel" style="width:100%;margin-top:6px">
        <option>Inter</option><option>Poppins</option><option>Roboto</option><option>Nunito</option><option>Montserrat</option>
      </select>`;
    document.body.appendChild(bar);
    document.getElementById('fontSel').addEventListener('change', e=> Theme.setFont(e.target.value));
    let editOn=false;
    function setEditable(on){
      document.querySelectorAll('[data-editable]').forEach(el=>{ el.contentEditable = on ? 'true' : 'false'; el.style.outline = on ? '1px dashed #666' : 'none'; });
    }
    bar.addEventListener('click', (e)=>{
      const act = e.target.getAttribute('data-act'); if(!act) return;
      if(act==='toggle-edit'){ editOn=!editOn; setEditable(editOn); }
      if(act==='save'){ document.querySelectorAll('[data-editable]').forEach((el,i)=>{ const key = el.id || `editable_${i}`; localStorage.setItem('content:'+key, el.innerHTML); }); alert('Saved locally (map to CMS in later release).'); }
      if(act==='export'){ const data={}; document.querySelectorAll('[data-editable]').forEach((el,i)=>{ const key = el.id || `editable_${i}`; data[key]=el.innerHTML; });
        const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='front-panel-content.json'; a.click(); URL.revokeObjectURL(url); }
      if(act==='reset'){ document.querySelectorAll('[data-editable]').forEach((el,i)=>{ const key = el.id || `editable_${i}`; localStorage.removeItem('content:'+key); }); location.reload(); }
    });
    document.querySelectorAll('[data-editable]').forEach((el,i)=>{ const key = el.id || `editable_${i}`; const val = localStorage.getItem('content:'+key); if(val) el.innerHTML = val; });
  }
})();
