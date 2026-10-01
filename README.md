# HOTELIFE

Sitio web accesible vía código QR que le da al huésped de un hotel acceso a todos los servicios del hotel desde su celular, sin necesidad de descargar una app — y del otro lado, un panel para que recepción y cada jefe de área reciban y atiendan esas solicitudes desde su propio celular corporativo o computador.

**Slogan:** "Todo a través de un clic."

**Demo interactivo:** https://mrsnick.github.io/Hotelife/ — se adapta a celular, tablet y computador.

**Estética:** navy oscuro (`#1a222d`) + dorado (`#d4b285`) + crema (`#f9f6f0`), tipografía Cormorant Garamond (títulos) + Manrope/Inter (cuerpo). Todas las pantallas de huésped comparten estructura de "teléfono": status bar, header, contenido scrolleable, barra inferior de 4 tabs, FAB de chat.

**Diseño:** vive en Figma (archivo "Proyecto-Hotel-Life"). El código en este repo se genera a partir de cada pantalla ya cerrada ahí — Figma es la fuente de verdad del diseño, pero **toda la interactividad real vive en el código**, no en Figma (ver sección de limitaciones más abajo).

---

## ⚠️ Cómo probarlo — requiere servidor local

Varias pantallas comparten datos entre sí a través de `localStorage` (ver sección de arquitectura de datos). **Esto NO funciona si abres los archivos con doble clic** (`file://`) — los navegadores modernos (Chrome especialmente) aíslan `localStorage` por archivo en ese modo. Para probar las conexiones reales:

```bash
cd src
python3 -m http.server 8000
# o: npx serve
```

Luego abre `http://localhost:8000/login.html` y navega desde ahí. Para ver el lado del staff reaccionar en vivo, abre `http://localhost:8000/admin/dashboard.html` (o la app del jefe de área correspondiente) en **otra pestaña del mismo navegador**.

---

## Estructura del repositorio

```
src/
  login.html                   -> identificación del huésped (tipo + número de documento)
  home.html                    -> pantalla principal post-login (llave digital, servicios rápidos, chat)
  servicios.html               -> catálogo completo de 29 servicios, todos enlazados a su pantalla real
  solicitudes.html             -> historial y estado de solicitudes del huésped
  cuenta.html                  -> folio de consumos + botón de check-out
  perfil.html                  -> datos personales, preferencias, métodos de pago, accesos e invitados
  pasarela-pago.html           -> selección de método de pago (Wompi / Mercado Pago)
  pago-qr.html                 -> pago por QR con cuenta regresiva
  checkout-exitoso.html        -> confirmación de check-out + calificación de estadía
  mantenimiento.html           -> reporte de problema técnico (categoría, foto, urgencia, acceso)
  room-service.html            -> menú de Room Service con carrito y pedido real
  amenities.html                -> catálogo de amenities (Baño/Habitación) con carrito y pedido real
  (amenities.html?catalog=minibar -> mismo patrón para Minibar)
  accesos-invitados.html       -> el huésped autoriza invitados (aforo, formulario, lista con estados)
  mi-pase-acceso.html          -> pase QR del invitado (bloqueado hasta que recepción lo valide)
  servicio-solicitud.html      -> PLANTILLA genérica (?service=xxx) — 11 servicios tipo formulario simple
  servicio-menu.html           -> PLANTILLA genérica (?service=xxx) — Bar, Desayuno, Tienda (catálogo+carrito)
  servicio-reserva.html        -> PLANTILLA genérica (?service=xxx) — 8 servicios tipo reserva fecha/hora
  servicio-coordinacion.html   -> PLANTILLA genérica (?service=xxx) — 5 servicios que requiere Conserjería
  formulario-documento.html    -> prototipo temprano, duplicado de login.html (candidato a eliminar)

src/admin/
  login.html                   -> login del staff: correo, contraseña y área; redirige al panel de esa área (sesión simulada en localStorage, sin validar contraseña)
  dashboard.html               -> panel de recepción (escritorio): KPIs, TODAS las solicitudes en vivo
  mensajes.html                -> bandeja de chat con huéspedes, conectada en vivo al chat del huésped
  control-accesos.html         -> escáner de recepción para validar pases de invitados
  staff-mantenimiento.html     -> app del Jefe de Mantenimiento (celular)
  staff-amadellaves.html       -> app de la Jefa de Ama de Llaves (celular)
  staff-ayb.html                -> app del Jefe de Alimentos y Bebidas (celular)
  staff-spa.html                -> app del Jefe de Spa & Wellness (celular)
  staff-conserjeria.html       -> app del Jefe de Conserjería (celular)
  README.md                    -> notas específicas de esta sección (mapeo de departamentos, etc.)
```

### Las 4 plantillas genéricas de servicio

En vez de 27 archivos distintos para los 27 servicios restantes del catálogo (más allá de Room Service, Amenities, Mantenimiento y Minibar), se construyeron **4 plantillas reutilizables** que leen qué servicio mostrar desde la URL:

| Plantilla | Ejemplo de uso | Sirve a |
|---|---|---|
| `servicio-solicitud.html?service=lavanderia` | Formulario corto (1-2 campos) + enviar | Housekeeping(*), Lavandería, Late check-out, Caja fuerte, Valet, Equipaje, Mascotas, Médico, WiFi |
| `servicio-menu.html?service=bar` | Catálogo con carrito, como Room Service | Bar, Desayuno, Tienda del hotel |
| `servicio-reserva.html?service=spa` | Selección de opción + fecha + hora | Spa, Gimnasio, Piscina, Sauna, Clases, Restaurante, Salones, Centro de negocios |
| `servicio-coordinacion.html?service=traslados` | Formulario + aviso de que Conserjería coordina por chat | Traslados, Alquiler de vehículos, Tours, Entradas, Niñera |

`(*) Housekeeping además tiene el bloque "Programar Limpieza de Suite" con selector de hora, como en Figma. Minibar ya no usa esta plantilla: usa el mismo catálogo + carrito de Amenities (`amenities.html?catalog=minibar`).`

Cada fila del catálogo (`servicios.html`) ya tiene su `href` apuntando a la plantilla + parámetro correcto.

---

## Arquitectura de datos compartidos (todo vive en `localStorage`)

No hay backend real — esto es un prototipo funcional. La "base de datos" es `localStorage` del navegador, compartida entre pestañas del mismo navegador (ver advertencia del servidor local arriba). Claves en uso:

- **`hotelife_service_requests`** — array de solicitudes genéricas. Lo escriben: las 4 plantillas, `mantenimiento.html`, `amenities.html`. Cada objeto tiene `{ id, service, title, dept, room, roomType, guestName, details|items, status, urgent, createdAt }`. El campo `dept` (ej. `"🔧 Mantenimiento"`, `"🧺 Ama de Llaves"`, `"🍽️ A&B"`, `"🧖‍♀️ Spa"`, `"🧭 Conserjería"`, `"🏨 Recepción"`) es lo que cada app de staff usa para filtrar solo lo suyo.
- **`hotelife_shared_orders`** — específico de Room Service (estructura ligeramente distinta, con `items`/`total`). Lo lee `staff-ayb.html`.
- **`hotelife_access_passes`** — pases de acceso de invitados. Lo escribe `accesos-invitados.html`, lo lee `mi-pase-acceso.html` y `admin/control-accesos.html`. Estados: `pendiente` → `activo` (recepción debe validar antes de activar).
- **`hotelife_chat_threads`** — hilos de chat por habitación. Lo escribe/lee `home.html` (el FAB de chat) y `admin/mensajes.html`.

**Cada app de staff filtra por su propio departamento** usando `dept.includes('Nombre')`. El Dashboard de recepción (`admin/dashboard.html`) es el único que lee **todo**, sin filtrar — por diseño: recepción es el respaldo 24/7 cuando el jefe de área no está disponible.

### ¿Qué pantallas SÍ están conectadas de verdad end-to-end?

✅ Room Service → A&B · ✅ Housekeeping/Lavandería/Amenities → Ama de Llaves · ✅ Mantenimiento → Mantenimiento · ✅ Spa/Gimnasio/Piscina/Sauna/Clases → Spa · ✅ Traslados/Vehículos/Tours/Entradas/Niñera → Conserjería · ✅ Bar/Desayuno/Restaurante → A&B · ✅ Accesos e Invitados → Control de Accesos · ✅ Chat del Home → Mensajes de recepción · ✅ Todo lo anterior también aparece en el Dashboard de recepción.

❌ Lo que va a "🏨 Recepción" (Caja fuerte, Valet, Equipaje, Mascotas, Médico, Late check-out, Salones, Centro de negocios, Tienda) no tiene una app de staff dedicada — solo aparece en la tabla del Dashboard.

---

## Figma: qué es real y qué es solo visual

Como regla general del proyecto, **la interactividad real vive en el código**, no en Figma — Figma se usó principalmente para diseño visual y navegación entre pantallas. Excepciones donde sí se construyó lógica real en Figma (variantes + reacciones):

- Selector de tipo de documento (login)
- Selector de tipo de servicio (Lavandería) y tipo de solicitud (Late check-out/Early check-in) — arrancan en placeholder neutro, como el login
- Selector de hora para Programar Limpieza (Housekeeping) — 10 opciones con scroll horizontal, cualquiera seleccionable
- FAB de chat (abre/cierra overlay) en todas las pantallas que lo tienen
- Flujo de Amenities: overlay de cantidad (1 item de ejemplo) → resumen → confirmación → vuelve a Home
- Navegación entre Inicio/Servicios/Mis solicitudes/Mi cuenta desde cualquiera de las ~36 pantallas que tienen esa barra

**Limitación real descubierta (no es falta de plan pago):** un botón dentro de un overlay no puede cambiar la variante de la pantalla que tiene debajo (`CHANGE_TO` cruzando ese límite es rechazado por Figma directamente). Por eso, por ejemplo, la barra de carrito de Amenities/Minibar no aparece dinámicamente en Figma tras agregar un item — solo existe así en el código.

---

## Notas pendientes / decisiones sin resolver

**Negocio (desde el día 1, nunca resueltas):**
- Modelo: ¿B2B SaaS o comisión por reservas/consumos?
- Seguridad del login: solo documento, sin contraseña ni segundo factor
- Integración con el PMS del hotel (Opera, Cloudbeds, etc.) o actualización manual por el staff

**Técnicas:**
- Modo Privacidad ("No Molestar"): se guarda en `localStorage` (`hotelife_privacy`) y lo muestran el Dashboard de recepción y las 5 apps de staff (aviso arriba + marca en cada solicitud de esa habitación)
- El "adjuntar foto" en Mantenimiento es solo un estado visual simulado, sin `<input type="file">` real
- El QR de pago (`pago-qr.html`) es un patrón visual, no un código real escaneable
- La tarifa de habitación NO se paga dentro de la app (removido intencionalmente) — falta definir dónde se paga
- `formulario-documento.html` sigue siendo un duplicado de `login.html`, candidato a eliminar
- El refresco de datos en vivo (Dashboard, apps de staff) es por *polling* (revisa `localStorage` cada pocos segundos), no push real — suficiente para demo, no para producción
- `localStorage` es del navegador, no una base de datos real — para producción, todo esto necesita una API real para que funcione entre dispositivos distintos (celular del huésped ↔ celular del jefe de área), no solo pestañas del mismo navegador
