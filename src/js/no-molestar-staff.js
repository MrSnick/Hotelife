/*
  HOTELIFE — aviso de "No Molestar" en las apps del staff
  (Ama de Llaves, Mantenimiento, A&B, Spa, Conserjería).
  Lee el Modo Privacidad que activa el huésped (localStorage "hotelife_privacy") y:
  - muestra un aviso arriba de la lista con las habitaciones en No Molestar
  - marca cada solicitud de esas habitaciones con "🔕 No molestar"
*/
(function () {
  const KEY = 'hotelife_privacy';

  const style = document.createElement('style');
  style.textContent = `
    .dnd-banner{
      flex-shrink:0; margin:8px 20px 4px; padding:10px 14px; border-radius:14px;
      background:rgba(181,87,58,0.1); border:1px solid #b5573a; color:#b5573a;
      font-size:12px; font-weight:700; line-height:1.4; display:none;
    }
    .dnd-banner.visible{ display:block; }
    .dnd-banner span{ display:block; font-weight:600; font-size:11px; color:#8a4a36; }
    .ticket.ticket-dnd{ border-color:#b5573a; box-shadow: inset 4px 0 0 #b5573a; }
    .dnd-tag{
      display:inline-block; font-size:10px; font-weight:800; color:#b5573a;
      background:rgba(181,87,58,0.12); padding:3px 8px; border-radius:8px; white-space:nowrap;
    }
  `;
  document.head.appendChild(style);

  const list = document.getElementById('ticketList');
  if (!list) return;

  const banner = document.createElement('div');
  banner.className = 'dnd-banner';
  banner.setAttribute('role', 'status');
  list.parentNode.insertBefore(banner, list);

  function dndRooms() {
    let privacy = {};
    try { privacy = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
    return Object.entries(privacy).filter(([, p]) => p && p.on);
  }

  // Número de habitación de una solicitud: ".room-badge" (405) o ".room-sub" ("Suite Deluxe · 405")
  function roomOf(ticket) {
    const el = ticket.querySelector('.room-badge, .room-sub');
    if (!el) return null;
    const m = el.textContent.match(/(\d{3,4})\s*$/);
    return m ? m[1] : null;
  }

  function refresh() {
    const rooms = dndRooms();
    const set = new Set(rooms.map(([room]) => room));

    banner.classList.toggle('visible', rooms.length > 0);
    banner.innerHTML = rooms.length === 0 ? '' :
      `🔕 No Molestar: ${rooms.map(([room, p]) => `Hab. ${room}${p.guestName ? ' (' + p.guestName + ')' : ''}`).join(', ')}` +
      `<span>No ingresar ni llamar. Coordina con recepción antes de atender.</span>`;

    list.querySelectorAll('.ticket').forEach(ticket => {
      const isDnd = set.has(roomOf(ticket));
      ticket.classList.toggle('ticket-dnd', isDnd);
      let tag = ticket.querySelector('.dnd-tag');
      if (isDnd && !tag) {
        tag = document.createElement('span');
        tag.className = 'dnd-tag';
        tag.textContent = '🔕 No molestar';
        const anchor = ticket.querySelector('.ticket-room, .room-sub');
        (anchor || ticket.firstElementChild).after(tag);
      } else if (!isDnd && tag) {
        tag.remove();
      }
    });
  }

  refresh();
  setInterval(refresh, 3000);
  window.addEventListener('storage', refresh);
})();
