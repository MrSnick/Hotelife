/*
  HOTELIFE — navegación compartida de la app del huésped.
  Varias pantallas tenían sus botones como placeholder (solo console.log).
  Este archivo conecta esos botones a su pantalla real para que el demo se
  pueda recorrer de punta a punta. Se carga al final de cada pantalla.
*/
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';

  function go(url) { window.location.href = url; }

  function on(selector, url) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); go(url); });
    });
  }

  // Barra inferior de 4 tabs (solo app del huésped; las apps de staff tienen sus propios tabs)
  const TABS = {
    inicio: 'home.html',
    servicios: 'servicios.html',
    solicitudes: 'solicitudes.html',
    cuenta: 'cuenta.html'
  };
  document.querySelectorAll('.bottom-nav .nav-item[data-tab]').forEach(btn => {
    const url = TABS[btn.dataset.tab];
    if (!url) return;
    btn.addEventListener('click', () => { if (url !== page) go(url); });
  });

  // Botones "volver" que solo hacían console.log
  const BACK = {
    'servicios.html': 'home.html',
    'solicitudes.html': 'home.html',
    'cuenta.html': 'home.html',
    'pasarela-pago.html': 'cuenta.html',
    'pago-qr.html': 'pasarela-pago.html',
    'mantenimiento.html': 'servicios.html'
  };
  if (BACK[page]) on('#backBtn', BACK[page]);

  // FAB de chat en pantallas que no tienen el overlay: abre el chat del Home
  if (page !== 'home.html' && !document.getElementById('chatOverlay')) {
    on('#chatFab', 'home.html#chat');
  }

  // Acciones puntuales por pantalla
  switch (page) {
    case 'home.html': {
      const SERVICE_LINKS = {
        housekeeping: 'servicio-solicitud.html?service=housekeeping',
        spa: 'servicio-reserva.html?service=spa',
        traslados: 'servicio-coordinacion.html?service=traslados',
        restaurante: 'servicio-reserva.html?service=restaurante',
        lavanderia: 'servicio-solicitud.html?service=lavanderia',
        'mas-servicios': 'servicios.html'
      };
      document.querySelectorAll('.service-card[data-service]').forEach(card => {
        const url = SERVICE_LINKS[card.dataset.service];
        if (url) card.addEventListener('click', () => go(url));
      });
      on('#verSolicitudesBtn', 'solicitudes.html');
      on('#agregarSolicitudBtn', 'servicios.html');
      if (location.hash === '#chat') document.getElementById('chatFab')?.click();
      break;
    }
    case 'solicitudes.html':
      on('#newRequestBtn', 'servicios.html');
      break;
    case 'cuenta.html':
      on('#checkoutBtn', 'pasarela-pago.html');
      break;
    case 'pasarela-pago.html':
      on('#payBtn', 'pago-qr.html');
      break;
    case 'pago-qr.html':
      on('#verifyBtn', 'checkout-exitoso.html');
      break;
    case 'checkout-exitoso.html':
      on('#finishBtn', 'login.html');
      break;
  }
})();
