/*
  HOTELIFE — Modo Privacidad ("No Molestar").
  Tarjeta presente en Inicio y en Perfil (igual que en Figma). El estado se guarda en
  localStorage para que ambas pantallas muestren lo mismo y recepción pueda leerlo.
*/
(function () {
  const KEY = 'hotelife_privacy';
  const ROOM_ID = '405';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function isOn() { return !!(load()[ROOM_ID] && load()[ROOM_ID].on); }
  function save(on) {
    const all = load();
    all[ROOM_ID] = { on, guestName: 'Sr Snick', updatedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  document.querySelectorAll('[data-privacy-card]').forEach(card => {
    const toggle = card.querySelector('.privacy-toggle');
    const sub = card.querySelector('.privacy-sub');
    function render(on) {
      toggle.classList.toggle('on', on);
      toggle.setAttribute('aria-checked', on ? 'true' : 'false');
      sub.textContent = on ? '"No Molestar" activo · recepción notificada' : 'Activar "No Molestar" en recepción';
    }
    render(isOn());
    toggle.addEventListener('click', () => {
      const on = !isOn();
      save(on);
      render(on);
    });
  });
})();
