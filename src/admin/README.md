# HOTELIFE — Panel de Administración (Admin/Staff)

Esta carpeta contiene el lado del proyecto dirigido al **staff del hotel**, complementario a la app del huésped (carpeta `src/` en la raíz del repo).

## Arquitectura de 2 capas

1. **Recepción (`dashboard.html`)** — panel de escritorio/tablet. Ve **absolutamente todas** las solicitudes de todas las áreas del hotel, siempre (lee todo, sin filtrar por departamento). Es el respaldo 24/7 cuando el jefe de área correspondiente no está disponible. También incluye `mensajes.html` (chat con huéspedes) y `control-accesos.html` (validar pases de invitados).
2. **Apps móviles por jefe de área (`staff-*.html`)** — cada jefe de área tiene un celular corporativo con su propia vista, filtrada solo a las solicitudes de su categoría (vía el campo `dept` de cada solicitud).

## Acceso (login) y sesión simulada

`login.html` es el punto de entrada del staff (mismo estilo visual que el login del huésped). Pide correo, contraseña y área; **no valida credenciales contra nada real** (cualquier combinación con los 3 campos llenos entra). Al enviar, guarda `hotelife_staff_session` en `localStorage` y redirige al panel de esa área (Recepción → `dashboard.html`, o la app `staff-*.html` correspondiente). Los 6 paneles revisan esa clave al cargar y, si no existe, regresan a `login.html`. Cada app de staff tiene un botón "←" en el encabezado que regresa al login, y su pestaña "Perfil" abre `staff-perfil.html?area=<área>` (una sola página que se adapta al área); ahí "Cerrar sesión" borra `hotelife_staff_session` y vuelve al login. El Dashboard tiene su propio botón "Cerrar sesión" en la barra superior.

## Mapeo de categorías del catálogo de servicios → jefe de área

| Archivo | Jefe de área | Categorías que atiende |
|---|---|---|
| `staff-mantenimiento.html` | Jefe de Mantenimiento | A/C, plomería, eléctrico, TV/WiFi, puertas, muebles |
| `staff-amadellaves.html` | Jefa de Ama de Llaves | Housekeeping, Lavandería, Minibar, Amenities adicionales |
| `staff-ayb.html` | Jefe de Alimentos y Bebidas | Room Service, Bar, Desayuno, Restaurante |
| `staff-spa.html` | Jefe de Spa & Wellness | Spa, Gimnasio, Piscina, Sauna, Clases |
| `staff-conserjeria.html` | Jefe de Conserjería | Traslados, Alquiler de vehículos, Tours, Entradas, Niñera |

**Sin jefe de área asignado (atendido directo por recepción, solo visible en `dashboard.html`):** caja fuerte, valet, equipaje, tienda, mascotas, médico, late check-out/early check-in, salones de eventos, centro de negocios.

## Vocabulario de estados (sigue sin unificar entre apps)

Cada app usa un flujo de estados ligeramente distinto según la naturaleza de su trabajo:

- **Mantenimiento / Ama de Llaves:** Pendiente → En proceso → Completada
- **A&B (pedidos):** Nuevo → Preparando → En camino → Entregado
- **Spa (reservas):** Por confirmar → Confirmada → Completada
- **Conserjería (coordinación):** Pendiente → Coordinando → Confirmado

⚠️ Esto sigue sin unificarse formalmente. El Dashboard normaliza estos estados a 4 categorías visuales (Pendiente/En proceso/Confirmado/Completada) solo para mostrarlos en su tabla — pero cada app de staff internamente sigue usando su propio vocabulario. Antes de un backend real, vale la pena definir un único vocabulario canónico.

## Conexión real entre huésped y staff — YA FUNCIONA EN LAS 5 ÁREAS

Todas las apps de staff (y el Dashboard) leen en vivo de `localStorage`, no solo A&B:

- **`hotelife_service_requests`** (clave genérica) — la leen `staff-mantenimiento.html`, `staff-amadellaves.html`, `staff-spa.html`, `staff-conserjeria.html`, y parcialmente `staff-ayb.html` (Bar/Desayuno/Restaurante), filtrando por `dept.includes('NombreDelÁrea')`. La escriben: las 4 plantillas genéricas del huésped (`servicio-solicitud.html`, `servicio-menu.html`, `servicio-reserva.html`, `servicio-coordinacion.html`), más `mantenimiento.html` y `amenities.html`.
- **`hotelife_shared_orders`** (específica de Room Service) — la lee `staff-ayb.html`, la escribe `room-service.html`.
- **`hotelife_access_passes`** — conecta `accesos-invitados.html` (huésped) con `control-accesos.html` (recepción) y `mi-pase-acceso.html` (invitado). Reception debe escanear/aprobar antes de que el pase pase de `pendiente` a `activo`.
- **`hotelife_chat_threads`** — conecta el FAB de chat de `home.html` con `mensajes.html` en recepción.

`dashboard.html` lee **tanto** `hotelife_service_requests` **como** `hotelife_shared_orders`, sin filtrar por departamento, y recalcula su KPI de "Solicitudes pendientes" contando filas reales + las de ejemplo. Todas las vistas hacen *polling* (releen `localStorage` cada pocos segundos) para simular actualización en vivo — no hay push real.

**Limitación importante que sigue vigente:** `localStorage` es del navegador local, no una base de datos real — solo funciona entre pestañas del mismo navegador, sirviendo los archivos desde un servidor local (ver README raíz). En producción esto sería una API real para que funcione entre dispositivos distintos.

## Pendientes conocidos

- [ ] Las solicitudes que van a "🏨 Recepción" (caja fuerte, valet, equipaje, mascotas, médico, etc.) no tienen una app de staff dedicada — solo se ven en la tabla del Dashboard. Podría bastar así, o podría necesitar su propia vista si el volumen lo justifica.
- [ ] Los KPIs de "Ocupación", "Ingresos de hoy", "Actividad en vivo" y "Ocupación por tipo de habitación" del Dashboard siguen siendo 100% datos de ejemplo — solo "Solicitudes pendientes" y la tabla de solicitudes leen datos reales.
- [ ] Unificar el vocabulario de estados entre huésped y staff (ver arriba).
- [ ] Ningún panel tiene autenticación real — se asume una sesión ya iniciada por jefe de área.
- [ ] La lógica de "escalamiento" (si un jefe de área no responde en X minutos, recepción debe intervenir) solo existe como indicador visual estático en el dashboard (`⚠️ Sin respuesta 22 min`), no hay lógica real de tiempo transcurrido para solicitudes reales todavía.
- [ ] Minibar llega a Ama de Llaves a través de la plantilla genérica de formulario simple — el rediseño de catálogo+carrito que ya existe en Figma para Minibar no se ha trasladado al código.

## Diseño

El diseño visual de estas pantallas también existe en Figma (mismo archivo del proyecto general). La interactividad real (filtros, cambios de estado, carga de datos) vive solo en este código — en Figma solo algunas piezas puntuales son interactivas de verdad (ver README raíz, sección "Figma: qué es real y qué es solo visual").

## Barra inferior de 4 pestañas (staff)
Las 5 apps usan la misma barra: **Solicitudes** (A&B "Pedidos", Spa "Agenda") · **Mensajes** · **Equipo** · **Perfil**.
- `staff-nav.js`: renderiza la barra (`<nav id="staffNav" data-area=".." data-active="..">`), define `STAFF_AREAS` (equipos por área) y el badge de no leídos.
- `staff-mensajes.html?area=`: chat del jefe de área con Recepción. Clave `hotelife_staff_threads` (`{area:{messages,unreadForStaff,unreadForReception,areaLabel}}`). Recepción lo ve en `mensajes.html` (conversaciones "Staff").
- `staff-equipo.html?area=`: disponibilidad del equipo (clave `hotelife_staff_team`) y asignación de solicitudes (`assignedTo` en `hotelife_service_requests`).
- "Completadas" queda como filtro dentro de Solicitudes (sustituye a Historial).
