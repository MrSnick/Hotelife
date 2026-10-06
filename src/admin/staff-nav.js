// Barra inferior común de las 5 apps de staff: Solicitudes · Mensajes · Equipo · Perfil
// Uso: <nav class="bottom-nav" id="staffNav" data-area="mantenimiento" data-active="solicitudes"></nav>
//      <script src="staff-nav.js"></script>
const STAFF_AREAS = {
  mantenimiento: { label: '🔧 Mantenimiento', dept: 'Mantenimiento', home: 'staff-mantenimiento.html', first: ['📋', 'Solicitudes'],
    team: ['Carlos Ríos (técnico)', 'Luis Mora (eléctrico)', 'Andrés Pérez (plomero)'] },
  amadellaves: { label: '🧺 Ama de Llaves', dept: 'Ama de Llaves', home: 'staff-amadellaves.html', first: ['📋', 'Solicitudes'],
    team: ['María Gómez (camarera)', 'Rosa Díaz (camarera)', 'Elena Cruz (lavandería)', 'Paola Ruiz (camarera)'] },
  ayb: { label: '🍽️ Alimentos y Bebidas', dept: 'A&B', home: 'staff-ayb.html', first: ['📋', 'Pedidos'],
    team: ['Jorge Salas (mesero)', 'Camila Vega (mesera)', 'Iván Torres (cocina)'] },
  spa: { label: '🧖‍♀️ Spa & Wellness', dept: 'Spa', home: 'staff-spa.html', first: ['📅', 'Agenda'],
    team: ['Laura Nieto (masajista)', 'Sofía Ortiz (esteticista)', 'Diego Rey (instructor)'] },
  conserjeria: { label: '🧭 Conserjería', dept: 'Conserjería', home: 'staff-conserjeria.html', first: ['📋', 'Solicitudes'],
    team: ['Ana Lucía Pardo (concierge)', 'Felipe Duarte (botones)'] }
};
const STAFF_THREADS_KEY = 'hotelife_staff_threads'; // { area: { messages:[{sender:'staff'|'reception',text,time}], unreadForStaff, unreadForReception } }

function staffThreads() { return JSON.parse(localStorage.getItem(STAFF_THREADS_KEY) || '{}'); }
function saveStaffThreads(t) { localStorage.setItem(STAFF_THREADS_KEY, JSON.stringify(t)); }
function staffAreaFromUrl() {
  const s = JSON.parse(localStorage.getItem('hotelife_staff_session') || 'null');
  const k = new URLSearchParams(location.search).get('area');
  return STAFF_AREAS[k] ? k : (s && STAFF_AREAS[s.role] ? s.role : 'mantenimiento');
}

(function () {
  const nav = document.getElementById('staffNav');
  if (!nav) return;
  const area = nav.dataset.area || staffAreaFromUrl();
  const active = nav.dataset.active;
  const A = STAFF_AREAS[area];
  const st = document.createElement('style');
  st.textContent = '.nav-item{position:relative;font-family:inherit;text-decoration:none}.nav-item.active{font-weight:700}.nav-badge{position:absolute;top:-4px;right:-8px;min-width:15px;height:15px;border-radius:8px;background:#b5573a;color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px}';
  document.head.appendChild(st);
  const items = [
    ['solicitudes', A.first[0], A.first[1], A.home],
    ['mensajes', '💬', 'Mensajes', 'staff-mensajes.html?area=' + area],
    ['equipo', '👥', 'Equipo', 'staff-equipo.html?area=' + area],
    ['perfil', '👤', 'Perfil', 'staff-perfil.html?area=' + area]
  ];
  function render() {
    const unread = (staffThreads()[area] || {}).unreadForStaff || 0;
    nav.innerHTML = items.map(([id, icon, label, href]) =>
      `<a class="nav-item ${id === active ? 'active' : ''}" href="${href}"><span class="nav-icon">${icon}</span><span>${label}</span>${id === 'mensajes' && unread ? `<span class="nav-badge">${unread}</span>` : ''}</a>`
    ).join('');
  }
  render();
  setInterval(render, 3000);
})();
