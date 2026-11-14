const display = document.getElementById('pin');
const timer = document.getElementById('countdown');
if (display) {
  async function refresh() {
    try {
      const response = await fetch(display.dataset.url, {cache: 'no-store'});
      if (!response.ok) throw new Error('Could not refresh');
      const data = await response.json();
      display.textContent = data.code || 'CLOSED';
      timer.textContent = data.code ? `${data.seconds}s remaining` : 'Session closed';
    } catch (_) { timer.textContent = 'Connection lost; reload this page.'; }
  }
  setInterval(refresh, 1000);
}
