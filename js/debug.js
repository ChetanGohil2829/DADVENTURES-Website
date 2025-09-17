function logDebug(msg) {
  const panel = document.getElementById('debug-panel');
  panel.innerHTML += '[' + new Date().toLocaleTimeString() + '] ' + msg + '<br>';
}
document.getElementById('debug-toggle').addEventListener('click', () => {
  const panel = document.getElementById('debug-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});
logDebug('Debug panel ready');
