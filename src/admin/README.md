# HOTELIFE — Panel de Administración (Admin/Staff)

Esta carpeta contiene el lado del proyecto dirigido al **staff del hotel**, complementario a la app del huésped (carpeta `src/` en la raíz del repo).

## Arquitectura de 2 capas

1. **Recepción (`dashboard.html`)** — panel de escritorio/tablet. Ve **absolutamente todas** las solicitudes de todas las áreas del hotel, siempre. Es el respaldo 24/7 cuando el jefe de área correspondiente no está disponible.
2. **Apps móviles por jefe de área (`staff-*.html`)** — cada jefe de área tiene un celular corporativo con su propia vista, filtrada solo a las solicitudes de su categoría.

## Mapeo de categorías del catálogo de servicios → jefe de área

| Archivo | Jefe de área | Categorías que atiende |
|---|---|---|
| `staff-mantenimiento.html` | Jefe de Mantenimiento | A/C, plomería, eléctrico, TV/WiFi, puertas, muebles |
| `staff-amadellaves.html` | Jefa de Ama de Llaves | Limpieza, toallas/amenities, lavandería, minibar |
| `staff-ayb.html` | Jefe de Alimentos y Bebidas | Room Service, restaurante, bar, desayuno |
| `staff-spa.html` | Jefe de Spa & Wellness | Spa, gimnasio, piscina, clases |
| `staff-conserjeria.html` | Jefe de Conserjería | Traslados, tours, alquiler de vehículos, entradas, niñera |

**Sin jefe de área asignado (atendido directo por recepción):** caja fuerte, valet, equipaje, tienda, mascotas, médico, negocios.

## Vocabulario de estados (IMPORTANTE: debe coincidir con el lado del huésped)

Cada app usa un flujo de estados ligeramente distinto según la naturaleza de su trabajo:

- **Mantenimiento / Ama de Llaves:** Pendiente → En proceso → Completada
- **A&B (pedidos):** Nuevo → Preparando → En camino → Entregado
- **Spa (reservas):** Por confirmar → Confirmada → Completada
- **Conserjería (coordinación):** Pendiente → Coordinando → Confirmado

⚠️ Esto está definido de forma independiente por ahora. Si el lado del huésped (carpeta `src/solicitudes.html`, `src/home.html`) usa nombres de estado distintos para la misma solicitud, hay que unificar el vocabulario antes de construir un backend real — ver nota en el README raíz del repo.

## Conexión real entre huésped y staff (prototipo, no backend)

`src/room-service.html` (huésped) y `staff-ayb.html` (staff) están conectados de verdad mediante `localStorage`, bajo la clave `hotelife_shared_orders`, como prueba de concepto de "los pedidos del huésped llegan al panel del jefe de área correspondiente":

- Cuando el huésped confirma un pedido en `room-service.html`, se guarda un objeto en `localStorage`.
- Al cargar `staff-ayb.html`, se lee ese storage y el pedido aparece al tope de la lista, ya con el flujo completo de estados funcionando.

**Limitación importante:** `localStorage` es del navegador local, no una base de datos real. Para que esto funcione en la demo, los archivos deben servirse desde un mismo servidor local (`python3 -m http.server`, por ejemplo) y no abrirse con doble clic — los navegadores modernos aíslan `localStorage` por archivo cuando se usa `file://`. En producción esto sería una API real conectada a una base de datos, para que funcione entre dispositivos distintos (celular del huésped ↔ celular del jefe de área), no solo pestañas del mismo navegador.

Los otros 3 paneles de staff (Mantenimiento, Ama de Llaves, Spa, Conserjería) **todavía no están conectados así** — solo A&B tiene la prueba de concepto completa. Sería el siguiente paso lógico si se sigue este patrón.

## Pendientes conocidos

- [ ] Conectar Mantenimiento, Ama de Llaves, Spa y Conserjería al mismo patrón de `localStorage` (o a un backend real) que ya tiene A&B.
- [ ] Los contadores de resumen (KPIs arriba de cada app) son en su mayoría estáticos — solo A&B recalcula sus 3 contadores en vivo según el estado real de los tickets.
- [ ] Unificar el vocabulario de estados entre huésped y staff (ver arriba).
- [ ] El dashboard de recepción (`dashboard.html`) tiene datos 100% de ejemplo (KPIs, actividad, ocupación) — no lee nada del storage compartido todavía.
- [ ] Ningún panel tiene autenticación real — se asume una sesión ya iniciada por jefe de área.
- [ ] La lógica de "escalamiento" (si un jefe de área no responde en X minutos, recepción debe intervenir) solo existe como indicador visual estático en el dashboard (`⚠️ Sin respuesta 22 min`), no hay lógica real de tiempo transcurrido.

## Diseño

El diseño visual de estas 6 pantallas también existe en Figma (mismo archivo del proyecto general), construido con el mismo sistema de columnas/paneles pero sin interactividad real (eso vive solo en este código).
