# HOTELIFE

Sitio web accesible vía código QR que le da al huésped de un hotel acceso a todos los servicios del hotel desde su celular, sin necesidad de descargar una app.

**Slogan:** "Todo a través de un clic."

## Estado actual

- [x] Login / identificación del huésped
- [x] Home (llave digital, mis solicitudes, servicios rápidos, descubrir más)
- [x] Catálogo completo de Servicios (7 categorías, buscador)
- [x] Mis solicitudes (filtros, historial, cancelar)
- [x] Mi cuenta (folio de consumos, resumen, check-out)
- [x] Flujo de pago del check-out (pasarela Wompi/Mercado Pago → QR → confirmación)
- [x] Mantenimiento (reporte de problema técnico: categoría, descripción+foto, urgencia, acceso)
- [ ] Detalle de pedido por servicio individual (ej. menú de Room Service, agenda de Spa)
- [ ] Pantallas del lado del hotel (admin: recibir solicitudes, gestionar huéspedes)
- [ ] Integración con backend / PMS del hotel
- [ ] Definición de segundo factor de autenticación (pendiente — ver nota de seguridad abajo)

## Estructura del repositorio

```
src/
  login.html              -> identificación del huésped (tipo + número de documento)
  home.html                -> pantalla principal post-login
  servicios.html           -> catálogo completo de servicios del hotel
  solicitudes.html         -> historial y estado de solicitudes del huésped
  cuenta.html              -> folio de consumos + botón de check-out
  pasarela-pago.html       -> selección de método de pago (Wompi / Mercado Pago)
  pago-qr.html             -> pago por QR con cuenta regresiva
  checkout-exitoso.html    -> confirmación de check-out + calificación de estadía
  mantenimiento.html       -> reporte de problema técnico en la habitación
  formulario-documento.html -> prototipo temprano del formulario de documento (revisar si sigue siendo necesario; su contenido ya vive en login.html)
assets/    -> imágenes, íconos, fuentes
docs/      -> notas de producto, decisiones de diseño
```

Todas las pantallas comparten la misma paleta (navy `#1a222d` + dorado `#d4b285` + crema `#f9f6f0`) y estructura de "teléfono" (status bar, header, contenido scrolleable, barra inferior de 4 tabs, FAB de chat).

## Notas pendientes

- El login actual identifica al huésped solo con tipo + número de documento, sin contraseña. Evaluar un segundo factor (código de reserva, últimos dígitos de tarjeta, código enviado al check-in) antes de producción.
- Definir si el modelo es B2B SaaS (se le vende el software al hotel) o comisión por reservas/consumos generados dentro de la app.
- Definir integración con el PMS del hotel (Opera, Cloudbeds, etc.) o si el staff actualiza todo manualmente.
- La tarifa de habitación NO se paga dentro de la app (se removió intencionalmente del flujo de check-out) — falta definir y documentar dónde se paga esa parte de la cuenta.
- El "adjuntar foto" en Mantenimiento es solo un estado visual simulado; falta conectar un `<input type="file">` real con backend/storage.
- El QR de pago es un patrón visual, no un código real escaneable ni conectado a Wompi/Mercado Pago todavía.
- Los estados usados en "Mis solicitudes" (Pendiente, En camino, Confirmado, Completada) deben coincidir exactamente con los que use el panel de administración del hotel cuando se construya.

## Diseño

El diseño visual vive en Figma. El código en `src/` se genera/exporta a partir de las pantallas ya cerradas ahí (Figma es la fuente de verdad del diseño).

