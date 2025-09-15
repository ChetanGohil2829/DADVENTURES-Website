
(function(){
  const results = document.getElementById('results');
  const add = (ok, msg) => {
    const li = document.createElement('li');
    li.textContent = (ok ? '✅ ' : '❌ ') + msg;
    results.appendChild(li);
  };
  // Assets
  fetch('images/WELCOME_IMAGE.png').then(r=>add(r.ok,'WELCOME_IMAGE.png loaded')).catch(()=>add(false,'WELCOME_IMAGE.png failed'));
  fetch('images/BACKGROUND.png').then(r=>add(r.ok,'BACKGROUND.png loaded')).catch(()=>add(false,'BACKGROUND.png failed'));
  fetch('images/logo.png').then(r=>add(r.ok,'logo.png loaded')).catch(()=>add(false,'logo.png failed'));
  fetch('audio/relaxing-piano-ambient.mp3').then(r=>add(r.ok,'audio file present')).catch(()=>add(false,'audio missing'));
  // Data
  fetch('content/events/events.json').then(r=>r.json()).then(()=>add(true,'events.json valid JSON')).catch(()=>add(false,'events.json invalid'));
  fetch('content/shop/products.json').then(r=>r.json()).then(()=>add(true,'products.json valid JSON')).catch(()=>add(false,'products.json invalid'));
})();
