// Barra inferior común de las 5 apps de staff: Solicitudes · Mensajes · Equipo · Perfil
// Uso: <nav class="bottom-nav" id="staffNav" data-area="mantenimiento" data-active="solicitudes"></nav>
//      <script src="staff-nav.js"></script>
const NAV_ICONS = {
  clipboard: '<svg class="icon-svg" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.25001 2.33333H2.91667V12.25H11.0833V2.33333H8.75001M4.66667 7H9.33334M4.66667 9.33333H8.16667M5.25001 1.75H8.75001V4.08333H5.25001V1.75Z" stroke="currentColor" stroke-width="0.9625" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  calendar: '<svg class="icon-svg" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.75 5.83329H12.25M4.08333 1.16663V4.08329M9.91667 1.16663V4.08329M4.08333 8.16663H5.83333M8.16667 8.16663H9.91667M4.08333 10.5H5.83333M1.75 2.91663H12.25V12.8333H1.75V2.91663Z" stroke="currentColor" stroke-width="0.9625" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  message: '<svg class="icon-svg" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.41666 9.16647H15.5833M6.41666 12.8331H12.8333M19.25 10.0831C19.25 12.0281 18.3808 13.8933 16.8336 15.2686C15.2864 16.6439 13.188 17.4165 11 17.4165H6.41666L2.74999 20.1665V13.7498C2.20299 11.8049 2.54757 9.74647 3.70796 8.02738C4.86834 6.3083 6.74946 5.06937 8.93749 4.58314C11.1255 4.09691 13.4412 4.40321 15.3752 5.43466C17.3092 6.46611 18.703 8.13822 19.25 10.0831Z" stroke="currentColor" stroke-width="1.5125" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  users: '<svg class="icon-svg" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.583008 12.25V9.91668C0.583008 7.97224 1.74967 7.00002 4.08301 7.00002C6.41634 7.00002 7.58301 7.97224 7.58301 9.91668V12.25M10.4997 5.25002C10.7295 5.13511 10.9344 4.97606 11.1028 4.78196C11.2711 4.58785 11.3996 4.36249 11.4808 4.11874C11.5621 3.87498 11.5945 3.61761 11.5763 3.36132C11.5581 3.10503 11.4896 2.85483 11.3747 2.62502C11.2598 2.3952 11.1007 2.19027 10.9066 2.02193C10.7125 1.85358 10.4871 1.72511 10.2434 1.64386C9.99964 1.56261 9.74227 1.53017 9.48598 1.54838C9.22968 1.56659 8.97949 1.63511 8.74967 1.75002M9.33301 7.00002C11.6663 7.00002 12.833 7.97224 12.833 9.91668V12.25M5.83301 3.50002C5.83301 3.72983 5.78774 3.95739 5.6998 4.16971C5.61185 4.38203 5.48295 4.57495 5.32044 4.73745C5.15794 4.89996 4.96502 5.02886 4.7527 5.11681C4.54038 5.20475 4.31282 5.25002 4.08301 5.25002C3.85319 5.25002 3.62563 5.20475 3.41331 5.11681C3.20099 5.02886 3.00807 4.89996 2.84557 4.73745C2.68307 4.57495 2.55416 4.38203 2.46622 4.16971C2.37827 3.95739 2.33301 3.72983 2.33301 3.50002C2.33301 3.2702 2.37827 3.04264 2.46622 2.83032C2.55416 2.618 2.68307 2.42508 2.84557 2.26258C3.00807 2.10008 3.20099 1.97117 3.41331 1.88323C3.62563 1.79528 3.85319 1.75002 4.08301 1.75002C4.31282 1.75002 4.54038 1.79528 4.7527 1.88323C4.96502 1.97117 5.15794 2.10008 5.32044 2.26258C5.48295 2.42508 5.61185 2.618 5.6998 2.83032C5.78774 3.04264 5.83301 3.2702 5.83301 3.50002Z" stroke="currentColor" stroke-width="0.9625" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user: '<svg class="icon-svg" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.33301 12.8334V10.5001C2.33301 8.16675 3.88856 7.00008 6.99967 7.00008C10.1108 7.00008 11.6663 8.16675 11.6663 10.5001V12.8334M9.33301 3.50008C9.33301 4.11892 9.08718 4.71241 8.64959 5.15C8.21201 5.58758 7.61851 5.83342 6.99967 5.83342C6.38084 5.83342 5.78734 5.58758 5.34976 5.15C4.91217 4.71241 4.66634 4.11892 4.66634 3.50008C4.66634 2.88124 4.91217 2.28775 5.34976 1.85017C5.78734 1.41258 6.38084 1.16675 6.99967 1.16675C7.61851 1.16675 8.21201 1.41258 8.64959 1.85017C9.08718 2.28775 9.33301 2.88124 9.33301 3.50008Z" stroke="currentColor" stroke-width="0.9625" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const STAFF_AREAS = {
  mantenimiento: { label: '🔧 Mantenimiento', dept: 'Mantenimiento', home: 'staff-mantenimiento.html', first: [NAV_ICONS.clipboard, 'Solicitudes'],
    team: ['Carlos Ríos (técnico)', 'Luis Mora (eléctrico)', 'Andrés Pérez (plomero)'] },
  amadellaves: { label: '🧺 Ama de Llaves', dept: 'Ama de Llaves', home: 'staff-amadellaves.html', first: [NAV_ICONS.clipboard, 'Solicitudes'],
    team: ['María Gómez (camarera)', 'Rosa Díaz (camarera)', 'Elena Cruz (lavandería)', 'Paola Ruiz (camarera)'] },
  ayb: { label: '🍽️ Alimentos y Bebidas', dept: 'A&B', home: 'staff-ayb.html', first: [NAV_ICONS.clipboard, 'Pedidos'],
    team: ['Jorge Salas (mesero)', 'Camila Vega (mesera)', 'Iván Torres (cocina)'] },
  spa: { label: '🧖‍♀️ Spa & Wellness', dept: 'Spa', home: 'staff-spa.html', first: [NAV_ICONS.calendar, 'Agenda'],
    team: ['Laura Nieto (masajista)', 'Sofía Ortiz (esteticista)', 'Diego Rey (instructor)'] },
  conserjeria: { label: '🧭 Conserjería', dept: 'Conserjería', home: 'staff-conserjeria.html', first: [NAV_ICONS.clipboard, 'Solicitudes'],
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
  st.textContent = '.nav-item{position:relative;font-family:inherit;text-decoration:none}.nav-item.active{font-weight:700}.nav-icon{display:flex}.nav-icon svg{width:16px;height:16px}.nav-badge{position:absolute;top:-4px;right:-8px;min-width:15px;height:15px;border-radius:8px;background:#b5573a;color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px}';
  document.head.appendChild(st);
  const items = [
    ['solicitudes', A.first[0], A.first[1], A.home],
    ['mensajes', NAV_ICONS.message, 'Mensajes', 'staff-mensajes.html?area=' + area],
    ['equipo', NAV_ICONS.users, 'Equipo', 'staff-equipo.html?area=' + area],
    ['perfil', NAV_ICONS.user, 'Perfil', 'staff-perfil.html?area=' + area]
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
