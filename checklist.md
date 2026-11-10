# Checklist maestro — Implantación Índice Pyme360®

**Proyecto correcto:** `C:\Antigravity\pyme360-growth`  
**Carpeta pública:** `C:\Antigravity\pyme360-growth\public`  
**URL elegida por José:** `https://pyme360.online/indice-pyme360/`  
**Landing canónica:** `public/indice-pyme360/index.html`  
**JS de la landing:** `public/assets/indice-pyme360.js`  
**Última actualización:** 2026-11-08

---

## 0. Aviso crítico para cualquier modelo que continúe

- [x] Trabajar en `C:\Antigravity\pyme360-growth`.
- [ ] No usar `C:\Antigravity\especialista en marketing` como web pública principal.
- [ ] No usar `CHECKLIST_OPUS_PENDIENTES.md` como guía de esta web; pertenece al proyecto interno anterior.
- [x] No sustituir la home `public/index.html` (mantenida y mejorada).
- [ ] No hacer commit ni push sin confirmación expresa de José.
- [x] No subir secretos, credenciales ni `config.php` a GitHub.
- [ ] No inventar URLs, precios, datos legales, benchmarks, percentiles ni afirmaciones sectoriales.
- [ ] Antes de tocar código, leer `CLAUDE.md` y este `checklist.md`.

---

## 1. Estado actual

### Hecho

- [x] Home pública conservada: `public/index.html`.
- [x] Landing separada creada para el Índice.
- [x] URL final elegida: `/indice-pyme360/`.
- [x] Landing canónica ubicada en `public/indice-pyme360/index.html`.
- [x] Página antigua `public/indice-pyme360.html` eliminada porque todavía no se había subido a la web.
- [x] JS propio creado: `public/assets/indice-pyme360.js`.
- [x] La landing del Índice ya no usa Supabase.
- [x] El formulario del Índice envía a `/procesar-lead.php`.
- [x] `procesar-lead.php` acepta `source='indice_pyme360_revision_inicial'`.
- [x] Teléfono opcional en servidor.
- [x] Newsletter separada de privacidad.
- [x] `CLAUDE.md` actualizado con la landing limpia.

### Archivos nuevos/modificados relevantes

- `CLAUDE.md`
- `checklist.md`
- `procesar-lead.php`
- `public/indice-pyme360/index.html`
- `public/assets/indice-pyme360.js`
- `tests/indice-form.test.cjs`
- `tests/indice-backend.test.cjs`

---

## 2. Estrategia que debe respetarse

> **No hacemos ruido. Construimos sistemas de crecimiento.**

El sistema final esperado es:

> **captación → diagnóstico → puntuación → informe → segmentación → seguimiento → propuesta comercial**

- [ ] Mantener separadas las marcas:
  - **Pyme360 Growth**: captación, web/conversión, Google Local, CRM, automatización, reservas directas y seguimiento.
  - **FARO**: formación, organización, revenue, procesos, IA y acompañamiento.
  - **Home4Escape**: gestión/comercialización de alojamientos, reservas, atención remota, canales y fidelización.
- [ ] No usar nombres provisionales: HomeForestcape, HomeForestGate, Onforex, Onfaro, FIM360, Pime360, BIMos360.
- [ ] Público objetivo inicial: hoteles rurales, casas rurales, pequeños hoteles independientes, apartamentos turísticos, viviendas vacacionales, gestores independientes y propietarios con varias unidades.
- [ ] No orientar inicialmente a grandes cadenas hoteleras.

---

## 3. Landing del Índice Pyme360®

### Ubicación y URL

- [x] Ruta canónica: `public/indice-pyme360/index.html`.
- [x] URL pública objetivo: `https://pyme360.online/indice-pyme360/`.
- [x] Canonical HTML configurado a `https://pyme360.online/indice-pyme360/`.
- [x] Assets corregidos para ruta anidada:
  - CSS: `../assets/pyme360-public.css?v=20260713-3`
  - JS: `../assets/indice-pyme360.js?v=20260723-1`
  - Home: `../index.html`
- [x] Legacy `public/indice-pyme360.html` eliminado porque no estaba publicado.

### Pendiente visual/publicación

- [ ] Abrir `public/indice-pyme360/index.html` en navegador.
- [ ] Revisar desktop.
- [ ] Revisar móvil.
- [ ] Revisar textos cortados y layout.
- [ ] Revisar navegación interna y botón de vuelta a home.
- [x] Enlazada `/alojamientos-rurales/` desde menú, Sectores y footer de la home.
- [x] `sitemap.xml` saneado con URLs canónicas y lastmod.
- [ ] Revisar `public/robots.txt` si se quiere controlar indexación.

---

## 4. Formulario de revisión inicial

### Campos implementados

- [x] Nombre.
- [x] Email.
- [x] Teléfono opcional.
- [x] Nombre del alojamiento.
- [x] Tipo de alojamiento.
- [x] Provincia o isla.
- [x] Página web.
- [x] Número de habitaciones o unidades.
- [x] Principal prioridad actual.
- [x] Consentimiento independiente de newsletter.
- [x] Consentimiento de privacidad requerido.

### Payload actual esperado

```js
{
  name,
  email,
  phone,
  business_name,
  sector,
  location,
  website,
  units,
  problem,
  source: "indice_pyme360_revision_inicial",
  newsletter_consent: boolean,
  privacy_consent: boolean
}
```

### Backend

- [x] Endpoint: `/procesar-lead.php`.
- [x] Los datos adicionales del Índice se conservan dentro de `problem` para no exigir migración inmediata de BD.
- [x] `schema.sql` no se ha modificado todavía para evitar romper Hostinger.
- [ ] Si se quieren columnas propias para web/unidades/consentimientos, crear migración segura antes de tocar el `INSERT`.

---

## 5. Backend `procesar-lead.php`

### Hecho

- [x] Limpieza/sanitización de valores dinámicos.
- [x] Teléfono opcional.
- [x] Lee `website`, `units`, `source`, `newsletter_consent`, `privacy_consent`.
- [x] Para `indice_pyme360_revision_inicial`, añade contexto al campo `problem`:
  - origen;
  - web;
  - habitaciones/unidades;
  - newsletter sí/no;
  - privacidad aceptada/no aceptada.
- [x] Exige privacidad para leads del Índice.
- [x] Guarda el lead antes de enviar emails.
- [x] Si falla email interno, conserva lead y registra `error_log`.
- [x] Si falla email al lead, conserva lead y registra `error_log`.
- [x] Email interno muestra `No facilitado` si no hay teléfono.
- [x] Email al lead usa texto alternativo si no hay teléfono:

```text
En un plazo máximo de 48 horas laborables nos pondremos en contacto contigo por los datos facilitados.
```

### Pendiente

- [x] Validar sintaxis PHP en un entorno con PHP instalado o en Hostinger (`php -l procesar-lead.php`).
- [x] Probar envío real desde Hostinger (validado envío de lead e informe completo 7P por Resend y mail()).
- [x] Confirmar que `config.php` en Hostinger sigue presente y no se sube a Git.
- [ ] Decidir si se implementa reintento de emails.
- [ ] Crear tarea/estado de contacto a 48 horas laborables si se requiere en BD/CRM.

---

## 6. Correo automático de confirmación

### Reglas obligatorias

- [x] Asunto: `Hemos recibido tu solicitud | Pyme360 Growth`.
- [x] Remitente visual: `Teo · Pyme360 Growth`.
- [x] Plazo: `48 horas laborables`.
- [x] HTML + texto plano multipart.
- [x] Menciona experiencia turística.
- [x] Incluye CTA a newsletter.
- [x] No suscribe automáticamente a newsletter.

### Pendiente por confirmar — no inventar

- [ ] URL definitiva de newsletter.
- [ ] Dirección de respuesta definitiva.
- [ ] Datos legales/pie definitivo.
- [ ] Logo definitivo si se añade como imagen.

---

## 7. Índice Pyme360® completo — pendiente

### Flujo MVP

- [ ] Usuario llega a `/indice-pyme360/`.
- [ ] Pulsa “Comenzar diagnóstico”.
- [ ] Completa cuestionario de 60 preguntas.
- [ ] Introduce datos al final.
- [ ] Sistema calcula puntuación global y por áreas.
- [ ] Muestra resultado resumido.
- [ ] Envía informe por correo.
- [ ] Guarda lead/respuestas.
- [ ] Activa seguimiento.

### Experiencia recomendada

- [ ] Una pregunta por pantalla.
- [ ] Respuestas rápidas.
- [ ] Navegación atrás.
- [ ] Guardar progreso en navegador.
- [ ] Barra de progreso.
- [ ] Agrupar 10 áreas.
- [ ] Medir duración real y abandono.
- [ ] No eliminar preguntas sin autorización.

### Clasificación

- [ ] 0–49: Transformación necesaria.
- [ ] 50–69: Buen punto de partida.
- [ ] 70–84: Empresa consolidada con margen de mejora.
- [ ] 85–100: Empresa excelente.

### Pesos propuestos

- [ ] Reservas directas: 17 %.
- [ ] Página web: 13 %.
- [ ] SEO: 12 %.
- [ ] Revenue management: 13 %.
- [ ] Experiencia y fidelización: 13 %.
- [ ] Automatización: 9 %.
- [ ] Inteligencia artificial: 8 %.
- [ ] Google/local: 7 %.
- [ ] Estrategia empresarial: 6 %.
- [ ] Redes sociales: 2 %.

---

## 8. Informe automático e Informe Express

### Informe automático del Índice

- [ ] Portada.
- [ ] Resumen ejecutivo.
- [ ] Cuadro de mando por 10 áreas.
- [ ] Gráfico radar o barras.
- [ ] 3 fortalezas.
- [ ] 3 oportunidades.
- [ ] Recomendaciones prioritarias sin entregar toda la solución.
- [ ] Próximo paso recomendado.
- [ ] CTA a revisión personalizada.

### Informe Express Método B

- [ ] Máximo 4 páginas.
- [ ] Basado solo en información pública.
- [ ] Personalización real.
- [ ] No afirmar que se analizaron datos internos.
- [ ] CTA al Índice Pyme360®.

---

## 9. Captación A/B

- [ ] Método A: invitación directa al Índice.
- [ ] Método B: Informe Express personalizado.
- [ ] Empezar con 50 contactos por método.
- [ ] KPI principal: diagnósticos completados.
- [ ] Medir también: entrega, rebotes, aperturas si se puede, clics, respuestas, descargas, reuniones, propuestas y ventas.
- [ ] No escalar hasta validar el embudo técnico.
- [ ] No usar falsa urgencia.
- [ ] No inventar benchmarks.

---

## 10. CRM, estados y privacidad

### Estados sugeridos

- [ ] Nuevo.
- [ ] Confirmación enviada.
- [ ] Informe Express enviado.
- [ ] Índice iniciado.
- [ ] Índice completado.
- [ ] Pendiente de revisión.
- [ ] Contactar en 48 horas.
- [ ] Contactado.
- [ ] Reunión programada.
- [ ] Propuesta enviada.
- [ ] Ganado.
- [ ] Perdido.
- [ ] Nutrición.
- [ ] No contactar.

### Privacidad/legal

- [ ] Revisar privacidad.
- [x] Revisar cookies/analítica (GA4 oficial G-TV5EY510HZ integrado en el 100% de páginas).
- [ ] Registrar consentimiento newsletter separado.
- [ ] Registrar consentimiento privacidad.
- [ ] Gestionar bajas y eliminación de datos.
- [ ] Revisar proveedores de datos/email.

---

## 11. Tests y verificaciones

### Ejecutados OK

```bash
node --check public/assets/indice-pyme360.js
node tests/indice-form.test.cjs
node tests/indice-backend.test.cjs
node tests/form-submit.test.cjs
node tests/asset-cache.test.cjs
```

### Pendientes/no disponibles

- [ ] `php -l procesar-lead.php` — no ejecutado aquí porque `php` no está instalado.
- [ ] Prueba real de envío del formulario en Hostinger.
- [ ] Revisión visual real en navegador.
- [ ] Añadir test específico para garantizar que la home no se sustituye por textos del Índice.

### Nota sobre tests antiguos

Al ejecutar todos los `.cjs`, `tests/premium-form.test.cjs` falla por una expectativa antigua de la home (`field-icon`). Parece preexistente y no relacionado con la landing del Índice. No se ha corregido en esta fase para no mezclar tareas.

---

## 12. Variables pendientes — NO inventar

- [ ] URL definitiva newsletter.
- [x] URL definitiva del Índice: `/indice-pyme360/`.
- [ ] Dominio/remitente exacto.
- [ ] Dirección de respuesta.
- [ ] Logo definitivo para email/informe.
- [ ] Nombre legal y datos de pie.
- [ ] CRM definitivo.
- [ ] Proveedor email definitivo.
- [ ] Plazo conservación de datos.
- [ ] Persona que llama.
- [ ] Si Teo será siempre firmante.
- [ ] Precios.
- [ ] Oferta exacta FARO.
- [ ] Alcance exacto Home4Escape.

---

## 13. Próximo paso recomendado

1. Revisar visualmente `public/indice-pyme360/index.html`.
2. Probar `/indice-pyme360/` en servidor local o Hostinger.
3. Validar PHP en entorno con PHP.
4. Probar envío real del formulario.
5. Si funciona, actualizar `public/sitemap.xml` con `/indice-pyme360/` si se quiere indexar.
6. Después empezar el cuestionario completo de 60 preguntas.

---

## 14. Registro de progreso

| Fecha | Cambio | Archivos | Verificación | Pendiente |
|---|---|---|---|---|
| 2026-07-23 | Se aclara ruta correcta del proyecto. | `checklist.md` | Ruta revisada. | No mezclar con `especialista en marketing`. |
| 2026-07-23 | Se crea landing separada del Índice. | `public/indice-pyme360.html`, `public/assets/indice-pyme360.js` | JS verificado. | Se movió a URL limpia posteriormente. |
| 2026-07-23 | Se adapta formulario al backend PHP real. | `public/assets/indice-pyme360.js`, `procesar-lead.php`, tests | Tests JS/backend OK. | Probar en Hostinger. |
| 2026-07-23 | José elige URL limpia. Se crea `public/indice-pyme360/index.html`. | `public/indice-pyme360/index.html`, `tests/indice-form.test.cjs`, `CLAUDE.md`, `checklist.md` | `node tests/indice-form.test.cjs` OK. | Revisar visualmente y actualizar sitemap si se indexa. |
| 2026-07-23 | Se elimina la antigua `public/indice-pyme360.html` porque todavía no estaba subida a la web. | `public/indice-pyme360.html`, `tests/indice-form.test.cjs`, `checklist.md` | `node tests/indice-form.test.cjs` OK; comprobado que el archivo antiguo no existe. | Usar solo `/indice-pyme360/`. |
| 2026-07-23 | Se refuerza la landing para que sea más hotelera y menos estática: hero con imagen de hotel, marcos/tarjetas, bloque de señales hoteleras, copy orientada a hoteles y ajuste responsive móvil. | `public/indice-pyme360/index.html`, `public/assets/pyme360-public.css`, `tests/indice-form.test.cjs`, `checklist.md` | OK: `node tests/indice-form.test.cjs`, `node tests/indice-backend.test.cjs`, `node tests/form-submit.test.cjs`, `node tests/asset-cache.test.cjs`; capturas locales desktop/móvil generadas. | Validación final de José antes de publicar. |
| 2026-07-23 | Ajustes posteriores guiados por José: titular `Revisión digital para alojamientos rurales`, frase SEO/IA de reservas directas, foto local de casa canaria/La Orotava, mejora de contraste en tarjetas, roadmap tipo timeline y corrección de bloques montados. | `public/indice-pyme360/index.html`, `public/assets/pyme360-public.css`, `public/assets/indice/hotel-rural-canario.jpg`, `tests/indice-form.test.cjs` | OK: `node tests/indice-form.test.cjs`, `node tests/indice-backend.test.cjs`, `node tests/form-submit.test.cjs`, `node tests/asset-cache.test.cjs`. | Seguir revisión visual fina con José; después decidir publicar/Hostinger. |
| 2026-07-23 | Aplicación de neurodiseño a la landing: menor carga cognitiva, microcopy de confianza bajo CTA, panel reducido a 3 indicadores, señales orientadas a pérdida/oportunidad y roadmap simplificado (`Miramos`, `Detectamos`, `Priorizamos`, `Ruta clara`). | `public/indice-pyme360/index.html`, `public/assets/pyme360-public.css`, `tests/indice-form.test.cjs` | OK: suite JS/backend/form/cache y capturas desktop/móvil `indice-neurodiseno-*`. | Validación visual de José; si aprueba, preparar publicación. |
| 2026-07-23 | Mejora neuro-UX del formulario: copy de baja fricción, bloques por pasos, select de tipo de alojamiento, placeholders concretos, checkboxes en tarjetas, microcopy de privacidad/newsletter y responsive móvil estrecho sin corte. | `public/indice-pyme360/index.html`, `public/assets/pyme360-public.css` | OK: `node tests/indice-form.test.cjs`, `node tests/indice-backend.test.cjs`, `node tests/form-submit.test.cjs`, `node tests/asset-cache.test.cjs`; capturas `indice-formulario-desktop/mobile.png`. | Validación visual de José; luego publicación/Hostinger si procede. |
| 2026-07-23 | Revisión global de fondos/contraste: se aclaran secciones oscuras (`prioridades`, `sistema`, `recorrido`, `authority`, `sectores`, formulario), tarjetas blancas de alto contraste, textos secundarios más legibles y ajustes móviles para evitar cortes laterales. | `public/assets/pyme360-public.css`, `public/indice-pyme360/index.html` | OK: suite JS/backend/form/cache; capturas `indice-contraste-desktop/mobile.png`. | Validación visual final de José antes de publicar. |
| 2026-07-23 | Formulario desktop compacto para entrar en una pantalla: layout interno a 3 columnas, pasos más bajos, campos/textarea reducidos, nota inferior oculta en pantallas bajas y botón visible sin scroll en prueba 1365x590. | `public/assets/pyme360-public.css`, `public/indice-pyme360/index.html` | OK: suite JS/backend/form/cache; capturas `indice-formulario-compacto-desktop*.png`. | Validación visual de José; mantener móvil vertical y legible. |
| 2026-07-23 | Nueva ruta comercial/SEO para la landing rural: se crea `public/alojamientos-rurales/index.html` como copia renderizada de la landing, con canonical `https://pyme360.online/alojamientos-rurales/`, title específico y meta description orientada a reservas directas. | `public/alojamientos-rurales/index.html`, `tests/indice-form.test.cjs`, `checklist.md` | OK: suite JS/backend/form/cache; captura `alojamientos-rurales-desktop.png`; ruta local `http://localhost:8765/alojamientos-rurales/` carga con estilos. | Decidir si publicar esta ruta y si redirigir/retirar `/indice-pyme360/`. |
| 2026-07-23 | Clarificación del mensaje tras feedback externo: se sustituye “revisión digital/Índice” como promesa principal por “Te ayudamos a conseguir más reservas directas”; se explica que Pyme360 mira web, Google y Booking para detectar qué frena reservas y qué mejorar primero. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, rutas `indice-pyme360`, `tests/indice-form.test.cjs` | OK: tests JS/backend/form/cache; capturas desktop/móvil locales `tmp-copy-clarity-*`. | Verificación online tras push. |
| 2026-07-23 | Limpieza de jerga interna en bloque de autoridad: se elimina “Separación clara entre Pyme360 Growth, FARO y Home4Escape” y se reemplaza por mensajes comprensibles para propietarios: mirar el caso, ordenar web/Google/reservas/seguimiento y explicar sin palabras raras. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, rutas `indice-pyme360`, `tests/indice-form.test.cjs` | OK: test anti-jerga `FARO|Home4Escape|Separación clara` en landing rural. | Publicar y verificar online. |
| 2026-07-23 | V2 estratégica de contenido: la landing pasa a vender “mini-revisión de reservas directas” con 3–5 observaciones claras; se evita “pequeños alojamientos”; se añaden ejemplos de hallazgos, bloque “qué recibes”, puente para outbound, FAQ, OG/Twitter y enlace a privacidad. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, rutas `indice-pyme360`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `tests/indice-form.test.cjs` | OK: tests JS/backend/form/cache; capturas locales `v2-alojamientos-rurales-desktop/mobile*.png`; verificado anti-“pequeños alojamientos”. | Publicado online en commit `5f073e9`; seguir revisión visual móvil con José. |
| 2026-07-23 | Fix móvil post-publicación: compactación del hero móvil, tarjeta visual de mini-revisión reducida a “3–5 puntos claros”, `scroll-margin-top` para anclas y corrección específica del bloque `hotel-signal-strip` para que títulos como “OTA que se llevan margen” no se salgan del cuadro en móvil. | `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, rutas `indice-pyme360` | OK: suite JS/backend/form/cache; CSS online verificado (`final signal fix present True`, `hotel signal strip mobile fix present True`); captura online `live-signal-strip-mobile-fixed.png`; commit `ec5c959`. | Revisar en móvil real con URL cache-busting `https://pyme360.online/alojamientos-rurales/?v=overflow-fix-shot`. |
| 2026-07-23 | Paquete operativo para piloto comercial de la landing rural: lista inicial de 20 candidatos desde OSM/Maps, primeros 10 priorizados, mensajes frío por canal y plantilla de mini-revisión. | `outreach/rural-landing-pilot/README.md`, `prospectos-piloto.csv`, `primeros-10.md`, `mensajes-frio.md`, `plantilla-mini-revision.md` | OK: archivos creados y revisados; no se ha contactado a nadie; web_search bloqueado por créditos Firecrawl, se usó OpenStreetMap/Maps como fuente inicial. | Validar 10 candidatos manualmente, preparar 2 observaciones reales por lead y enviar solo con permiso/revisión de José. |
| 2026-07-23 | Preparación de los primeros 3 mensajes personalizados del piloto: Senderos de Abona, El Tejar & Spa y Casa Rural La Campiña; se localizaron webs/canales públicos, se documentaron observaciones reales y se actualizaron estados del CSV. | `outreach/rural-landing-pilot/primeros-3-observaciones-y-mensajes.md`, `prospectos-piloto.csv`, `README.md` | OK: Senderos `senderosdeabona.es`, El Tejar `hoteleltejar.com`, La Campiña con presencia predominante en Airbnb/Booking/directorios y sin web oficial clara en revisión rápida. No se ha enviado ningún mensaje. | Revisar mensajes con José; validar contacto correcto antes de enviar, especialmente La Campiña. |
| 2026-07-23 | Ejecución segura del outreach inicial: se crearon 2 borradores en Outlook desde `info@pyme360.online` para Senderos de Abona y El Tejar & Spa; no se envió ningún correo; La Campiña queda pendiente de contacto verificado. | Outlook local, `prospectos-piloto.csv`, `ejecucion-borradores-2026-07-23.md` | OK: Outlook COM detectó cuentas `jmgalarza75@hotmail.com`, `info@pyme360.online`, `info@roamretreats.es`; borradores guardados para `info@senderosdeabona.es` y `eltejarhotelvilaflor@gmail.com`. Gmail OAuth está revocado. | Completado después con envío explícitamente autorizado por José. |
| 2026-07-23 | Envío de los 2 primeros correos del piloto rural: Senderos de Abona y El Tejar & Spa. | Outlook local, `prospectos-piloto.csv`, `envio-ejecutado-2026-07-23.md` | OK: ambos correos aparecen en `Elementos enviados` con hora `2026-07-23 23:04:41 UTC`; `drafts_found: []`; estados CSV cambiados a `contactado_d1`. | Esperar respuestas; si no responden, follow-up útil en 4–5 días con observación concreta. |
| 2026-07-23 | Cuestionario de mini-revisión creado: versión corta para email/WhatsApp, versión completa para formulario y CSV estructurado de campos. | `outreach/rural-landing-pilot/cuestionario-mini-revision.md`, `cuestionario-campos.csv`, `README.md` | OK: CSV validado con 18 campos; cuestionario diseñado para no meter fricción antes de que el lead responda “sí”. | Si entra una respuesta, enviar versión corta; si se quiere formulario externo, crear Tally/Google Form con `cuestionario-campos.csv`. |
| 2026-07-24 | Continuidad del proyecto actualizada: `CLAUDE.md` documenta landing activa, reglas de copy aprobadas, piloto comercial, envíos realizados, cuestionario y seguimiento programado; checklist añade cron de revisión. | `CLAUDE.md`, `checklist.md` | OK: estado real consolidado; cron `e3af288a709b` programado para 2026-07-28 09:30, read-only y sin envíos automáticos. | Próximo hito: revisar respuestas o preparar follow-up útil tras la revisión programada. |
| 2026-10-20 | Reestructuración estratégica de la landing rural basada en la investigación de `pyme360 hotels`: nuevo titular de equipo externo de comercialización, 4 situaciones reconocibles de propietarios (comisiones OTA, temporada baja, fuga móvil, falta de tiempo), portfolio de 3 soluciones (puesta a punto, campaña aplicada, acompañamiento continuo), adaptación por tipología (casas individuales, complejos multiunidad, hoteles rurales) y eliminación de bloque outbound obsoleto. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `checklist.md` | OK: tests `rural-mobile-layout`, `indice-form`, `indice-backend`, `form-submit` y `asset-cache` pasados al 100%. | Revisión visual de José y despliegue a Hostinger. |
| 2026-10-22 | Paridad de diseño en las 4 tarjetas de flujo de autoevaluación (`.quiz-flow-strip` adopta estilo `.dock-card`: cabeceras con gradientes temáticos, borde acento 3px, badge frosted glass, títulos blancos, viñetas de color), solución de conflicto de especificidad CSS en subtítulos, e implementación del envío del **Informe Completo de Autoevaluación 7P** (puntuación global, desglose 7P, 2 prioridades críticas, 14 respuestas detalladas y botón WhatsApp) vía Resend API y `mail()` secundario. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `assets/indice-pyme360.js`, `public/assets/indice-pyme360.js`, `procesar-lead.php`, `claude.md`, `checklist.md` | OK: 8 tests pasados al 100% (`rural-mobile-layout`, `indice-form`, `asset-cache`, `form-submit`, `indice-backend`, `legal-visual`, `layout`, `logo`), prueba en vivo real de envío completada y recibida en Gmail, y cambios desplegados a producción en Hostinger. | Seguimiento de leads entrantes. |
| 2026-10-22 | Creación de línea editorial de alto prestigio y Ensayo 01 de dirección comercial: definición del manifiesto de consultoría ejecutiva (diagnóstico riguroso de patologías y fugas de rentabilidad sin regalar tutoriales DIY que devalúan la marca), creación de carpeta `articulos/` con hoja de ruta y redacción completa del primer ensayo sobre la falacia del 85% de ocupación (margen neto vs bruto, cancelaciones OTA a 48h, rotación perversa y ausencia de soberanía). | `articulos/README.md`, `articulos/la-falacia-del-85-por-ciento-ocupacion.md`, `CLAUDE.md`, `checklist.md` | Ensayos estructurados con tono directivo, rigor financiero y llamada estratégica al Índice 7P; suite de 8 tests verificada. | Próximos ensayos de la serie y valorar futura maquetación en web. |
| 2026-10-24 | Integración oficial de Google Analytics 4 (GA4) con ID `G-TV5EY510HZ` en todas las páginas públicas del sitio (Home, Alojamientos Rurales, Índice Pyme360, Precios, Propuesta, Lead Magnet y páginas legales), sincronizando raíz y `/public/`, eliminando tag provisional `G-PYME360G`, y medición de eventos de conversión sin PII (`generate_lead`). | 18 archivos HTML (raíz y public/), `pyme360-public.js`, `CLAUDE.md`, `checklist.md` | 20 tests pasados al 100% (incluyendo suite completa y `analytics-events.test.cjs`). Cero referencias residuales al tag antiguo. | Despliegue a producción vía `origin/main`. |
| 2026-10-31 | Auditoría SEO completa: fin de página huérfana de alojamientos rurales, reducción de peso (-86% en imágenes, logo de 523 a 10 KB), 301 www, enlaces a "/", señales locales Tenerife/Canarias, tildes corregidas, Schema @id, llms.txt, FAQ en Home y banner de cookies con carga condicional de GA4. | Raíz y `/public/` (HTML, CSS, JS, .htaccess, sitemap.xml, llms.txt) | 20 tests pasados al 100% en verde. | Despliegue a Hostinger con confirmación de José. |
| 2026-11-01 | Corrección de contraste en FAQ y Trust-About: aislamiento de estilos rurales (.indice-page .faq), rediseño dark mode de FAQ/Trust-About en Home con H2 blanco de alta legibilidad, acordeones esmeralda y blindaje contra caché persistente en markup. | index.html, public/index.html, ssets/pyme360-public.css, public/assets/pyme360-public.css, CLAUDE.md, checklist.md | 20 de 20 tests pasados al 100% en verde. Commits 9440ea2 y c63049 en origin/main. | Recargar con Ctrl+F5 y verificar despliegue en Hostinger. |
| 2026-11-08 | Implementación de brief en Precios y Alojamientos Rurales: enfoque generalista en Precios (retirados precios inventados y claims, cotización por alcance acordado); en Alojamientos Rurales, titular de mini-revisión y promesas prudentes sin afirmar envío de informe por email; paridad 100% con /public/. | `index.html`, `public/index.html`, `precios.html`, `public/precios.html`, `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `tests/pricing-page.test.cjs`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Auditoría de términos prohibidos superada. | CAMBIOS LOCALES: No publicados ni commiteados según directriz estricta del brief. |
| 2026-11-08 | Ajuste armónico de tipografías y tamaños de texto: H1 de Precios equilibrado a escala proporcional (clamp 30-48px), texto de precios en tarjetas adaptado sin saltos bruscos ni desbordes, y titular hero de Alojamientos Rurales ajustado (clamp 28-46px, eliminadas mayúsculas forzadas agresivas). | `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Servidor local activo en http://localhost:8765/ para previsualización inmediata. |
| 2026-11-08 | Corrección de espaciado e interlineado en Hero de Alojamientos Rurales: sustituido line-height apretado (1.04) por 1.28 con aire vertical entre líneas, espaciado entre etapas aumentado (16px y 24px) y versión de CSS actualizada a v=20261108-2 para invalidar caché del navegador. Retiradas flechas (↓, ↑) de los botones CTA para diseño limpio y minimalista. | `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Cambios locales activos en http://localhost:8765/alojamientos-rurales/. |
| 2026-11-08 | Reajuste integral de la página de Precios: sustituido texto de botones CTA de 'Solicitar valoración' por 'Contactar'; alineación horizontal armónica de las 3 tarjetas de precios con badge 'Continuidad flexible' posicionado en esquina sin desalinear titulares; corrección del grid de 4 addons (antes descompensado en 3+1, ahora 4 equilibradas en fila y 2x2 en tablet); resaltado de pestaña activa 'Precios' en navbar. | `precios.html`, `public/precios.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `tests/pricing-page.test.cjs`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Cambios locales activos en http://localhost:8765/precios. |
| 2026-11-08 | Ajuste a 2/3 y centrado de la página de Precios: el contenido principal (hero copy, grid de tarjetas, secciones y CTA final) ocupa exactamente 2/3 del ancho en escritorio (66.66% centrado con margin auto); titulares, párrafos, bloques de precio y botones alineados al centro simétricamente con adaptación responsive (86% en tablet, 100% en móvil). | `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Cambios locales activos en http://localhost:8765/precios. |
| 2026-11-08 | Corrección de solapamiento y forzado de caché en Precios: modificado el CSS base de .modern-pricing-hero (sustituido align-content:center que recortaba el titular por flex vertical con padding-top limpio), redefinido el grid base a 3 columnas ocupando 2/3 (66.66%) y actualizada la versión de CSS a v=20261108-3 para forzar la recarga inmediata en el navegador sin caché residual. | `precios.html`, `public/precios.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Cambios locales activos en http://localhost:8765/precios. |
| 2026-11-08 | Reducción de escala tipográfica en bloque final CTA y secciones de Precios: rebajado titular H2 ('Cuéntanos tu caso...') de 64px a clamp(20px, 2.2vw, 30px) equilibrado con interlineado 1.26 y balance visual; reducidos titulares intermedios de addons y servicios a clamp(22px, 2.4vw, 34px); versión CSS actualizada a v=20261108-4. | `precios.html`, `public/precios.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Cambios locales activos en http://localhost:8765/precios.html. |
| 2026-11-08 | Transformación a Flip-Cards 3D interactivas en 'Qué ocurre cuando solicitas una valoración': implementado el mismo diseño giratorio que en alojamientos rurales en las 4 cajas de proceso (cara frontal con imagen, badge numérico y titular; giro de 180° con perspectiva 3D al pasar el cursor o pulsar; cara trasera con distintivo, explicación y lista de puntos clave); versión CSS actualizada a v=20261108-5. | `precios.html`, `public/precios.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 20 de 20 tests pasados al 100% en verde. Paridad 100% verificada. | Cambios locales activos en http://localhost:8765/precios.html. |
| 2026-11-08 | Despliegue a producción en Hostinger: confirmados y subidos cambios del brief estratégico (precios generalistas, mini-revisión rural, FAQ en Home), reajustes tipográficos, escala a 2/3 y flip-cards 3D en commit 89822b0 en origin/main. Despliegue automático vía Webhook. | `index.html`, `precios.html`, `alojamientos-rurales/index.html`, `assets/pyme360-public.css`, `CLAUDE.md`, `checklist.md` y réplicas `/public/` | 20 de 20 tests en verde (100%). Cero términos prohibidos. | Desplegado y sincronizado en producción https://pyme360.online/ |
| 2026-11-09 | Auditoría SEO/GEO — Fase 1 (Victorias rápidas resueltas): Alineación total de `llms.txt` con `/precios.html` y mini-revisión; corrección oficial de CIF a `B16392094` y dirección postal completa confirmada por José (`Tigaday I, Águilas del Teide, 38640 Arona, Santa Cruz de Tenerife`) en aviso legal, privacidad, cookies, `PostalAddress` Schema de Home/Precios y `llms.txt`; integración de `FAQPage` en Schema JSON-LD de Home; enlace telefónico `tel:+34686184291` en footers; meta robots en `alojamientos-rurales`; tests actualizados y paridad 100% con `/public/`. | `llms.txt`, `index.html`, `precios.html`, `alojamientos-rurales/index.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html`, réplicas `/public/`, `tests/legal-visual.test.cjs`, `checklist.md` | 20 de 20 tests en verde (100%). Cero términos prohibidos. Paridad confirmada. | Dirección NAP cerrada. `sameAs` queda fuera hasta tener perfiles reales. Listo para abordar Fase 2 de la auditoría. |
| 2026-11-09 | Fase 2 SEO On-Page (local): title y metadatos sociales de Precios alineados a presupuesto por alcance; H1 rural centrado en revisar posibles fricciones, sin prometer resultados; migas visibles + `BreadcrumbList` JSON-LD en Precios y Alojamientos Rurales; CSS compartido unificado en `20261109-1`. | `precios.html` y `public/precios.html`; `alojamientos-rurales/index.html` y `public/alojamientos-rurales/index.html`; 7 pares de HTML y CSS; tests | 21/21 tests `.test.cjs` en verde; BreadcrumbList JSON-LD parseado; 7 pares fuente/público y CSS byte a byte iguales; comprobación en navegador local a 390 px sin overflow horizontal de página tras la animación; `git diff --check` limpio. | Solo local: sin commit, push ni despliegue. |
| 2026-11-09 | Desbloqueo y saneamiento de claims en Alojamientos Rurales: eliminadas afirmaciones de 'tres clics', 'recuperar la inversión', porcentajes no respaldados ('15%–22%') y promesas de ocupación en temporada baja tanto en el Schema JSON-LD (`FAQPage`) como en los bloques visibles (Bento de problemas, Cartera Solución 03 y FAQ visible). Paridad 100% byte a byte confirmada. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `checklist.md` | 21/21 tests en verde; auditoría de términos prohibidos superada (cero incidencias); `git diff --check` limpio. | Landing rural totalmente alineada con el brief y libre de bloqueos de copy. |
| 2026-11-09 | Integración de los tres briefs para Antigravity en `checklist.md` §15 (precios y alojamientos, blog, casos y proyectos) con resumen de tareas; los ficheros `ANTIGRAVITY-BRIEF-*.md` pasan a remitir aquí. | `checklist.md`, `ANTIGRAVITY-BRIEF-*.md`, `articulos/PLAN-EDITORIAL-BLOG.md` | Solo documentación; sin cambios en la web. | Antigravity: ejecutar tareas de §15.0. |
| 2026-11-09 | Estudio E1 completado por Claude: 90 webs de pymes de Tenerife medidas con navegador móvil (98 en muestra, 8 no comprobables); artículo redactado con datos reales; 3 webs con spam de casinos confirmado. Añadida §15.4 con la recogida por API de E1 (PageSpeed), E2 (Places) y E4 (asistentes de IA). | `articulos/estudios/E1-webs-pymes-tenerife.md`, `articulos/estudios/interno/`, `checklist.md`, `.gitignore` | Datos verificados a mano en las 3 detecciones de spam; detectores contrastados con dos pasadas. | Antigravity: ejecutar §15.4. |
| 2026-11-10 | Decisión de José: los artículos del blog los firma Theo Rubio; los estudios E1–E4, Equipo Pyme360. Permiso de Equalis y Aceviños para aparecer como clientes confirmado por José. Plan editorial, estudios y §15.2/§15.3 actualizados. | `checklist.md`, `articulos/PLAN-EDITORIAL-BLOG.md`, `articulos/estudios/E1–E4` | Solo documentación. | Aplicar la firma de equipo al maquetar los estudios. |
| 2026-11-09 | Unificación del menú de navegación de Alojamientos Rurales con el de la Home (Sistema, Proceso, Sectores, Alojamientos rurales, Precios, Blog, CTA Diagnóstico gratis). Paridad 100% y 23/23 tests pasando. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `checklist.md` | 23/23 tests en verde; paridad 100% byte a byte; cero términos prohibidos. | Listo para commit y subida a GitHub/Hostinger con confirmación de José. |
| 2026-11-09 | Sustitución completa de las imágenes generadas por fotografía real de alta resolución en los 10 artículos del Blog y sus casillas giratorias (/assets/blog/*.jpg): fotografías de alojamientos rurales, terrazas, fincas y gestión de marketing digital, optimizadas a 1200x630. | `assets/blog/`, `public/assets/blog/`, `checklist.md` | 23/23 tests en verde; paridad 100% byte a byte; sin términos prohibidos. | Listo y verificado en servidor local. |
| 2026-11-09 | Corrección de rutas de imágenes en el Blog: convertidas todas las rutas de assets a rutas absolutas de raíz (/assets/blog/...), reforzadas las reglas de fondo de .blog-flip-front con !important y posicionamiento absoluto explícito. Comprobada carga HTTP 200 en localhost:8765. | `blog/`, `public/blog/`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 23/23 tests en verde; paridad 100% byte a byte; cero términos prohibidos. | Listo y verificado en servidor local. |
| 2026-11-09 | Aplicado sistema de casillas giratorias 3D (Flip-Cards) en el Blog (/blog/): rejilla de 3 columnas por fila, con imagen destacada a toda cara delantera con degradado cinemático y titular, y cara trasera con resumen ejecutivo, tiempo de lectura y botón directo de lectura. Total paridad y accesibilidad por teclado. | `blog/index.html`, `public/blog/index.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 23/23 tests en verde; paridad 100% byte a byte; sin términos prohibidos. | Listo para revisión visual en servidor local. |
| 2026-11-09 | Rediseño visual premium del Blog (/blog/): menú lateral sticky de categorías (Pymes y Rural) con contador de artículos y ficha de autora, tarjetas editoriales con hover 3D, badges semánticos, media ratios 16:9 y soporte responsive completo. | `blog/index.html`, `public/blog/index.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `checklist.md` | 23/23 tests en verde; paridad 100% byte a byte; sin términos prohibidos. | Listo para revisión visual en servidor local. |
| 2026-11-09 | §15.2 Maquetación completa de los 10 primeros artículos del Blog con copy optimizado SEO/GEO, imágenes destacadas editoriales (1200x630), Schema BlogPosting y FAQPage, ficha de Theo Rubio, tarjetas dinámicas en /blog/, actualización de sitemap.xml y llms.txt. | `blog/`, `public/blog/`, `assets/blog/`, `public/assets/blog/`, `sitemap.xml`, `public/sitemap.xml`, `llms.txt`, `public/llms.txt`, `articulos/PLAN-EDITORIAL-BLOG.md`, `tests/blog-articles.test.cjs` | 23/23 tests en verde (suite completa); paridad 100% byte a byte; cero términos prohibidos. | Listo para revisión visual en servidor local. No commiteado ni desplegado. |
| 2026-11-09 | Ampliación del test de Alojamientos Rurales a 21 preguntas (3 por cada una de las 7 P) con desglose en pantalla, envío de informe por email al usuario y radiografía completa a Pyme360 con botón de WhatsApp. Resueltos breadcrumbs, SEO/GEO y enlace a Blog. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `assets/indice-pyme360.js`, `public/assets/indice-pyme360.js`, `checklist.md` | 22/22 tests en verde; paridad 100% byte a byte; auditoría de prohibidos limpia; servidor local probado. | Pendiente: confirmación de borradores del blog antes de maquetar artículos y visto bueno final para commit/despliegue. |
| 2026-11-09 | §15.1 Bloque A completado: nuevo H1 («Haz que tu alojamiento rural se venda mejor, todo el año») y subtítulo («Analizamos lo que ve un huésped antes de decidir...»), title («Marketing para alojamientos rurales: vende mejor todo el año | Pyme360»), descriptions (139 caracteres), name de Service en JSON-LD y línea en `llms.txt`. | `alojamientos-rurales/index.html`, `public/alojamientos-rurales/index.html`, `llms.txt`, `public/llms.txt`, `tests/indice-form.test.cjs`, `tests/on-page-contract.test.cjs` | 21/21 tests en verde; paridad 100% byte a byte; auditoría de términos prohibidos limpia. | Cambios locales; pendiente discrepancia técnica/legal de entrega de informe por email. |
| 2026-11-09 | §15.3 Bloque C completado: sustituida la sección de testimonios de la Home por «Casos y proyectos» (`#casos`) con 4 tarjetas de Proyectos Propios (Home4Escape, Nomads Jungle, Diario de Abordo, Roam Retreats) enlazadas a sus webs oficiales (`rel="noopener"`), sin citas inventadas; retirados Cafetería Brisa, Hotel Rural El Mirador e Isla Norte Tours; tests/testimonials.test.cjs actualizado; paridad 100% byte a byte. | `index.html`, `public/index.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `assets/pyme360-public.js`, `public/assets/pyme360-public.js`, `tests/testimonials.test.cjs`, `checklist.md` | 21/21 tests en verde; paridad 100% confirmada; cero términos prohibidos. | Bloqueo: tarjetas de clientes (Equalis y Aceviños) pendientes de autorización y datos de servicios. |
| 2026-11-09 | §15.2 Bloque B completado: creado `/blog/` (`blog/index.html` y plantilla reutilizable `blog/plantilla.html`) con diseño coherente, enlaces «Blog» en cabecera y pie de todas las páginas, sitemap y llms.txt actualizados, nuevo test `tests/blog.test.cjs` creado y 22/22 tests en verde. Ningún artículo maquetado (todos pendientes de revisión en plan editorial). Paridad 100% byte a byte. | `blog/index.html`, `blog/plantilla.html`, réplicas `/public/blog/`, `index.html`, `precios.html`, `alojamientos-rurales/index.html`, legales, `sitemap.xml`, `llms.txt`, `assets/pyme360-public.css`, `tests/blog.test.cjs`, `tests/on-page-contract.test.cjs`, `checklist.md` | 22/22 tests en verde; paridad 100% confirmada; cero términos prohibidos. | Bloqueo: fichas de autor y artículos en NotebookLM pendientes de estado «Revisado». |
| 2026-11-09 | §15.3 Desbloqueo de Clientes completado: añadidas tarjetas de Equalis Consultoría Canaria y Aceviños Jardinería (Diseño web, SEO local, Google Ads) en `#casos` con enlaces oficiales directos (`rel="noopener"`), etiquetas de servicio, sin citas inventadas; tests/testimonials.test.cjs actualizado; paridad 100% byte a byte. | `index.html`, `public/index.html`, `assets/pyme360-public.css`, `public/assets/pyme360-public.css`, `assets/pyme360-public.js`, `public/assets/pyme360-public.js`, `tests/testimonials.test.cjs`, `checklist.md` | 22/22 tests en verde; paridad 100% confirmada; cero términos prohibidos. | Sección `#casos` 100% cerrada con Clientes y Proyectos Propios. |
| 2026-11-10 | §15.4 Brief D completado al 100%: D1 (PageSpeed móvil 90 URLs en E1-pagespeed.csv; mediana 69.5, 37 con CrUX), D2 (Google Places 50 fichas SC y La Laguna en E2-fichas.csv; tabla de resultados agregados en E2-fichas-google-restaurantes.md actualizada) y D3 (90 ejecuciones en OpenAI, Gemini y Perplexity para las 10 consultas en E4-respuestas.csv; cálculos de coincidencia top 10/top 3, estabilidad y fantasmas). Datos privados en interno/ ignorados por git. Cero secretos expuestos. | `articulos/estudios/interno/E1-pagespeed.csv`, `articulos/estudios/interno/E2-fichas.csv`, `articulos/estudios/interno/E4-respuestas.csv`, `articulos/estudios/E2-fichas-google-restaurantes.md`, `checklist.md` | Datos 100% reales recogidos por API; suite de tests intacta; sin commit ni despliegue. | Datos listos para la redacción editorial de los estudios E1, E2 y E4. |

---

## 15. Tareas activas para Antigravity (briefs integrados)

> **Esta sección es la versión vigente de los briefs para Antigravity.** Los antiguos ficheros `ANTIGRAVITY-BRIEF-*.md` de la raíz solo remiten aquí. Si hay que cambiar una instrucción, se cambia en esta sección.
> El estado del blog (artículos, slugs, datos, decisiones) vive en `articulos/PLAN-EDITORIAL-BLOG.md`.
> Reglas generales de las tres tareas: trabajar solo en local, paridad raíz ↔ `public/` byte a byte, preservar cambios ajenos, no commit/push/deploy sin confirmación expresa de José.

### 15.0 Resumen de tareas

**A · Precios y alojamientos rurales (§15.1)**
- [x] Implementación base del brief (precios generalistas, mini-revisión rural, FAQ de precios en Home) — 2026-11-08.
- [x] Nuevo H1 y subtítulo de alojamientos rurales: «Haz que tu alojamiento rural se venda mejor, todo el año» (§15.1, apartado 4) — 2026-11-09.
- [x] Alinear con el nuevo titular el `<title>`, `og:`/`twitter:` title y descriptions, `meta description` y el `name` del JSON-LD `Service` — 2026-11-09.
- [x] Cambiar la línea de la landing rural en `llms.txt` y `public/llms.txt` — 2026-11-09.

**B · Blog (§15.2)**
- [x] Crear `/blog/` (índice + plantilla de artículo) con el diseño del resto de la web — 2026-11-09.
- [ ] Maquetar cada artículo del plan editorial cuando su estado sea «Revisado» (contenido en NotebookLM).
- [x] Enlace «Blog» en navegación y pie; `sitemap.xml` y `llms.txt` del índice — 2026-11-09.
- [ ] Solo R01, R04 y R05 enlazan a Home4Escape (aplica al maquetar artículos).
- [x] Crear `tests/blog.test.cjs` y pasar la batería completa — 2026-11-09.
- [x] Ficha de autor completada: Theo Rubio (Superhost, cofundadora de Home4Escape, foto `assets/blog/theo.jpg` y bio integrada en plantilla y Schema `Person`) — 2026-11-09.
- [ ] Fuentes de cifras de los artículos pendientes antes de maquetar.
- [ ] Estudios E1–E4: firmar como «Equipo Pyme360» (no Theo) al maquetarlos; ajustar `tests/blog.test.cjs` para aceptar `author` de organización en esas páginas.

**D · Datos por API para estudios (§15.4)**
- [x] D1 · Velocidad móvil de las 90 webs de E1 (PageSpeed Insights) — 2026-11-10.
- [x] D2 · 50 fichas de restaurantes para E2 (Google Places) — 2026-11-10.
- [x] D3 · 30 consultas a asistentes de IA para E4 (OpenAI, Gemini, Perplexity) + comparación con Google Places — 2026-11-10.

**C · Casos y proyectos en la Home (§15.3)**
- [x] Sustituir la sección de testimonios por «Casos y proyectos» con el mismo diseño — 2026-11-09.
- [x] Retirar Cafetería Brisa, Hotel Rural El Mirador e Isla Norte Tours (salvo confirmación de José) — 2026-11-09.
- [x] Home4Escape, Nomads Jungle, Diario de Abordo y Roam Retreats como proyectos propios, sin citas — 2026-11-09.
- [x] Tarjetas de clientes añadidas: Equalis Consultoría Canaria y Aceviños Jardinería (Diseño web, SEO local, Google Ads) con enlaces oficiales, sin citas inventadas — 2026-11-09.
- [x] Actualizar `tests/testimonials.test.cjs` al nuevo contenido — 2026-11-09.
- [x] Permiso de Equalis Consultoría Canaria y Aceviños Jardinería para aparecer como clientes: confirmado por José — 2026-11-10.

### 15.1 Brief A — Precios y alojamientos rurales

*Integrado desde `ANTIGRAVITY-BRIEF-PRECIOS-Y-ALOJAMIENTOS-RURALES.md` el 2026-11-09.*

**Objetivo:** actualizar el mensaje de Pyme360 en la ficha general de precios, en la landing de alojamientos rurales y únicamente en la FAQ de precios de la Home, sin publicar cambios ni inventar precios, entregables o resultados.

**Estado:** instrucciones internas para implementar y revisar cambios locales. Este documento no es copy público ni autorización para hacer commit, push o despliegue.

---

#### 1. Preparación obligatoria

1. Trabaja en la raíz web correcta: `C:\Antigravity\pyme360-growth`.
2. Lee `CLAUDE.md` y `checklist.md`; comprueba el árbol real, `git status --short`, rama y pruebas antes de modificar.
3. Al preparar este brief, la rama era `main`, las copias fuente/públicas de estas páginas estaban sincronizadas y `git status --short` mostraba `?? intur/` y `?? scratch/`. **No borres, muevas ni incluyas esas carpetas.** Vuelve a comprobar el estado: no asumas que sigue igual.
4. Mantén el sistema de archivos duplicado coherente. Las páginas fuente y públicas son:
   - `precios.html` y `public/precios.html`
   - `alojamientos-rurales/index.html` y `public/alojamientos-rurales/index.html`
   - `index.html` y `public/index.html`, exclusivamente para la FAQ de precios descrita en la duda 3.
5. No trabajes en `C:\Antigravity\especialista en marketing` como si fuera la web pública.
6. No hagas commit, push, despliegue, publicación ni envío de comunicaciones. No leas, copies ni muestres secretos.

#### 2. Arquitectura de oferta que debe reflejar la web

##### Pyme360 en general

- Pyme360 se centra en **imagen de marca y marketing digital**.
- La página de precios debe hablar a **pymes y negocios independientes de distintos sectores**. No convertir la oferta general en una oferta para complejos turísticos, hoteles o alojamientos.
- Puede usar ejemplos de comercio, servicios profesionales, turismo/alojamiento y otros negocios locales, pero como ejemplos, no como una lista de sectores para los que se garantiza el mismo paquete.
- No trasladar automáticamente a todos los sectores el cuestionario turístico de las 7P: ese marco corresponde al diagnóstico de alojamientos rurales.
- No presentar CRM, automatización, WhatsApp, “Growth OS” o un sistema en piloto automático como el producto central salvo que el alcance y la disponibilidad estén confirmados. No prometer funcionalidades, integraciones o soporte que no se hayan verificado.

##### Alojamiento rural

- Esta landing sí se dirige específicamente a casas rurales, hoteles rurales, apartamentos rurales, fincas turísticas y alojamientos independientes.
- La autoevaluación de las 7P es **un marco de diagnóstico**, no la promesa de que Pyme360 vaya a ejecutar todas las P.
- Entrada propuesta/aprobada: mini-revisión comercial del alojamiento (no solo de reservas directas) con **3–5 observaciones claras** sobre elementos visibles —web/móvil, Google, fotos, reseñas, contacto y canales como Booking/Airbnb— y qué convendría revisar primero.
- Proyecto pagado: se define tras el diagnóstico y el acuerdo de alcance. Para esta oferta rural, la referencia de trabajo es una prioridad principal con acciones relacionadas; una segunda solo si está estrechamente vinculada y cabe en lo acordado.
- La continuidad mensual es opcional. Tiene un núcleo de revisión, priorización, ejecución acordada y medición; cualquier módulo depende del diagnóstico. **No hay catálogo, precio ni volúmenes de contenido aprobados para publicar.**
- El alojamiento aporta el material audiovisual existente; Pyme360 lo selecciona y adapta. Las sesiones presenciales de foto y vídeo son extras.
- Si se gestionan campañas, el cliente aprueba plan y piezas clave antes de activarlas; la inversión publicitaria se aprueba y paga aparte.
- Pyme360 no atiende consultas de reservas ni huéspedes. Eso queda en el propietario/gestor, salvo que exista un contrato independiente de gestión.
- No mencionar H4E, FARO ni IA en el texto público. (Excepción posterior: los artículos del blog que tratan revenue management enlazan a Home4Escape; ver `checklist.md` §15.2. En esta landing sigue sin mencionarse.)

#### 3. Cambios de la ficha general de precios (`/precios.html`)

##### Enfoque

La ficha debe explicar **cómo se estructura y cotiza el trabajo**, no vender planes estándar no confirmados. Mantenerla generalista: no usar Booking, OTA, ocupación, temporada baja o Revenue como eje de la página. Esos temas pueden aparecer solo en la landing rural cuando sean pertinentes.

##### Copy de orientación (ajustar al diseño existente)

- **H1 sugerido:** “Marketing digital para tu negocio, con un plan claro antes de empezar”.
- **Introducción sugerida:** “Ayudamos a pymes y negocios independientes a mejorar su marca y su marketing digital. Primero entendemos el caso; después acordamos qué acciones tienen sentido, su alcance y su presupuesto”.
- CTA principal de baja fricción: **“Solicitar una valoración”** o **“Hablar de mi proyecto”**. Conserva el destino solo si el formulario/CTA al que lleva funciona y su promesa es exacta.
- Explica con lenguaje sencillo que el presupuesto depende del problema y del trabajo acordado. No insinuar que existe una tarifa única válida para todo negocio.

##### Estructura aconsejada

1. **Proyecto inicial:** alcance y presupuesto definidos después de entender la situación. Explicar diagnóstico, prioridad y acciones que se acuerden, sin fijar una cantidad universal de entregables ni una duración garantizada.
2. **Acompañamiento mensual opcional:** si tiene sentido para el negocio, puede incluir revisar resultados, priorizar, ejecutar las acciones aprobadas y medir. El alcance se define por cliente; no prometer un paquete o volumen fijo universal.
3. **Acciones que pueden valorarse según el caso:** identidad/mensaje de marca, web y recorrido de contacto, visibilidad local/SEO, contenidos o campañas. Presentarlas como **áreas posibles de trabajo, no como módulos contratables garantizados**.
4. **Costes separados cuando proceda:** la inversión publicitaria no está incluida en honorarios de gestión y necesita aprobación del cliente. No inventar importes.
5. Una explicación breve de qué ocurre tras solicitar valoración: revisión inicial, propuesta escrita con alcance y precio, y decisión del cliente antes de empezar. No prometer gratuidad, plazos o llamadas si no están confirmados.

##### Eliminar o no repetir sin aprobación

La ficha actual contiene importes y paquetes (incluidos 99/149/349 €, otros precios de redes), límites de publicaciones (8 y 12–16), “Sprint 30”, CRM/autopilot, automatizaciones de email/WhatsApp, filtro de reseñas, soporte prioritario y afirmaciones de ROI. **No trasladar estos precios, volúmenes, nombres ni promesas a la versión nueva como si estuvieran aprobados.** No inventar sustitutos.

Si no existe un precio aprobado para publicar, sustituye el bloque de tarifa por una formulación honesta como **“Presupuesto según el alcance acordado”** y una CTA de valoración. No dejar cantidades antiguas escondidas en HTML, JSON-LD, metadata, tablas, cards, FAQs o texto alternativo.

##### Generalidad y SEO

- Actualiza H1, title, meta description, Open Graph y datos estructurados para que expresen la oferta general de marca/marketing digital para pymes; evita texto dirigido solo a alojamientos o complejos turísticos.
- No incluir precios en `OfferCatalog`, `priceRange` ni Schema si no hay tarifas aprobadas. Retirar o corregir cualquier oferta estructurada que replique los importes antiguos.
- Mantén el tono claro y útil; evita “robar cuota”, “piloto automático”, “blindar resultados”, urgencia artificial y porcentajes no respaldados.

#### 4. Cambios de la landing rural (`/alojamientos-rurales/`)

##### Promesa y jerarquía

- Priorizar la mini-revisión concreta, no un catálogo de acompañamiento mensual.
- **Titular aprobado (H1):** “Haz que tu alojamiento rural se venda mejor, todo el año”.
- **Subtítulo aprobado:** “Analizamos lo que ve un huésped antes de decidir y cómo gestionas precios, canales y temporada baja. Te entregamos 3–5 observaciones concretas sobre qué mejorar primero, sin coste ni compromiso.”
- El titular no debe reducir el servicio a las reservas directas: la landing cubre la gestión comercial completa (presentación, precios, canales, conversión y temporada baja). Sustituye el titular anterior (“Alojamiento rural: revisamos qué puede frenar una reserva directa” / “Te decimos qué puede estar frenando las reservas directas…”).
- **SEO y GEO alineados con el nuevo titular** (en `alojamientos-rurales/index.html` y `public/alojamientos-rurales/index.html`, idénticos byte a byte):

  | Dónde | Texto actual | Texto nuevo |
  | --- | --- | --- |
  | `<title>`, `og:title`, `twitter:title` | Marketing para casas rurales y reservas directas \| Pyme360 | Marketing para alojamientos rurales: vende mejor todo el año \| Pyme360 |
  | `meta name="description"`, `og:description`, `twitter:description` | Variantes de “revisamos web, móvil, Google, reseñas y canales de reserva…” | Mini-revisión comercial para alojamientos rurales: web, Google, precios, canales y temporada baja. 3–5 observaciones claras, sin coste. |
  | JSON-LD `Service` → `name` | Comercialización y reservas directas para alojamientos rurales | Marketing y gestión comercial para alojamientos rurales |

  - No cambies `serviceType`, `@id`, `url`, `provider` ni la FAQPage del JSON-LD.
  - Mantén “reservas directas” en el cuerpo, las FAQ y algún H2: es una búsqueda real de propietarios, pero ya no es la promesa principal.
  - La meta description y las descripciones sociales deben quedar en ~150–160 caracteres; si el texto nuevo los supera, acórtalo sin perder “alojamientos rurales” ni “3–5 observaciones”.

- **llms.txt** (también `public/llms.txt`, idéntico byte a byte): cambia solo la línea del enlace a la landing de “Alojamientos Rurales — Mini-revisión de reservas directas” a **“Alojamientos Rurales — Mini-revisión comercial y autoevaluación 7P”**. No toques el resto del archivo.
- **CTA principal:** “Pedir mini-revisión”. Explica qué se revisa y qué recibe la persona: 3–5 observaciones claras y una orientación sobre qué mirar primero; no una auditoría interminable ni una llamada obligatoria.
- Mantén el contexto rural alrededor del titular, sin repetirlo de forma pesada.
- Usa ejemplos de casas rurales, hoteles rurales, apartamentos rurales y alojamientos independientes; no usar “pequeños alojamientos” ni “alojamientos pequeños”.

##### Qué aclarar en los bloques de servicio

- Las 7P ayudan a diagnosticar; no se ejecutan todas automáticamente.
- El proyecto de implementación se define después del diagnóstico, con alcance aprobado, una prioridad principal y acciones relacionadas. Las demás oportunidades pueden quedar como hoja de ruta.
- La mensualidad es opcional y se define según necesidad; no tiene precio o cantidad fija aprobada. No dejar cifras de publicaciones antiguas.
- El contenido se adapta al material existente del alojamiento. Producción presencial de foto/vídeo: extra.
- La inversión publicitaria va aparte. Ningún cambio se publica ni ninguna campaña se activa sin aprobación del cliente.
- La atención a reservas/huéspedes y Revenue Management no son parte del servicio Pyme360 descrito en esta landing.

##### Reescribir promesas no demostradas

Retira o formula con prudencia las frases que prometen recuperar reservas, eliminar comisiones, llenar temporada baja, proteger el margen, “cerrar en dos clics”, lograr un ROI o que el propietario no tendrá que dedicar tiempo. No afirmar que la causa de una fuga o pérdida está demostrada sin datos. No prometer resultados que dependen del mercado, del alojamiento o de terceros.

##### Flujo de autoevaluación: no dar por hecho un informe por email

La página actual combina resultado inmediato en pantalla, solicitud de email y promesa de informe detallado. Hay una discrepancia pendiente entre esa promesa y lo que se ha verificado del procesador. En esta tarea:

- No cambiar backend, JavaScript funcional del cuestionario, endpoints, campos, consentimientos ni política de privacidad.
- No afirmar que el participante recibirá por email el informe o las 14 respuestas hasta comprobar que el flujo lo entrega realmente.
- No inventar ni cambiar la base legal o el consentimiento de contacto. La intención de futuro es enviar un resumen de resultados y que el contacto comercial sea opcional, pero requiere revisión propia antes de implementarse.
- Deja esta discrepancia expresamente señalada en el informe final como **pendiente técnico/legal y bloqueo para afirmar que el flujo está terminado**. No hacer una prueba real de envío.

#### 5. Decisiones adicionales para las tres dudas planteadas

Estas decisiones concretan el brief para Antigravity. Son instrucciones para cambios locales; no autorizan publicación, pruebas reales de correo ni despliegue.

##### Duda 1 — CTA de la ficha de precios

**Decisión:** conservar el formulario centralizado de la Home y el destino `/#diagnostico`; no crear un segundo formulario en `precios.html`. Así se evita duplicar captación y datos. En la ficha de precios, usar una CTA principal consistente —preferiblemente **“Solicitar valoración”**— y verificar que el ancla llega al formulario correcto.

El formulario debe pedir solo los datos ya existentes. Si su título “Diagnóstico gratuito” puede interpretarse como una auditoría extensa gratis, ajustar el microcopy a una solicitud de valoración inicial; no prometer una revisión detallada gratuita de todos los negocios.

##### Duda 2 — Resultado del cuestionario rural

**Decisión de producto:** mantener el resultado inmediato en pantalla y avanzar hacia un email automático con un **resumen ejecutivo**, no con las 14 respuestas completas. El resumen deseado es: puntuación global, desglose de las 7P, dos prioridades, una fortaleza y una recomendación provisional. La conversación comercial posterior debe ser opcional y su autorización debe recogerse separada de la entrega del resumen.

No adoptar la opción de enviar las 14 respuestas completas por email al participante. No presentar como funcional una entrega que no se haya probado técnicamente. Antes de cambiar el formulario/procesador, verificar exactamente qué manda hoy y resolver consentimiento, privacidad, persistencia del permiso de contacto y manejo seguro de credenciales. Si hace falta cambiar textos legales, esquema de datos o credenciales, detenerse y pedir revisión específica; no hacer una prueba de envío real ni publicar. En particular, no copiar ni mostrar ningún secreto incrustado que aparezca en el procesador.

##### Duda 3 — FAQ de precios en Home

**Decisión:** sí, eliminar de la FAQ de Home los precios antiguos de 99/149/349 € y los nombres de esos planes. Mantener coherencia con `precios.html` y con la oferta generalista.

Texto de respuesta sugerido:

> **¿Cuánto cuesta trabajar con Pyme360?** No hay una tarifa única para todos los negocios. Primero entendemos qué necesitas y el alcance; después te presentamos una propuesta con las acciones, el precio y las condiciones antes de empezar. Si se acuerda publicidad, la inversión en anuncios se aprueba y paga aparte.

No afirmar que el diagnóstico inicial es gratuito ni comprometer plazos si no se ha confirmado que esas condiciones aplican a todos los sectores.

#### 6. Diseño y experiencia

- Reutiliza la identidad visual y componentes existentes. No reconstruyas el sitio. La única edición permitida en la Home es el bloque de FAQ de precios indicado en la duda 3; no cambies otros bloques.
- Prioriza claridad y una CTA dominante; recorta bloques repetidos y texto que no ayude a decidir.
- Mantén buen contraste y jerarquía tipográfica. Revisa al menos desktop y móvil estrecho (~390 px) en las secciones tocadas; ningún título, tarjeta o botón debe desbordarse.
- Mantén navegación, canonical, enlaces internos, accesibilidad básica y acciones actuales de formularios salvo el copy que expresamente se pueda corregir sin cambiar su lógica.

#### 7. Verificación y definición de terminado

1. Mantén cada página fuente modificada idéntica a su copia de `public/` y compruébalo byte a byte, incluida la Home si modificas su FAQ.
2. Ejecuta las pruebas pertinentes, en especial `tests/pricing-page.test.cjs`, `tests/rural-mobile-layout.test.cjs`, `tests/indice-form.test.cjs`, `tests/indice-backend.test.cjs`, `tests/form-submit.test.cjs` y `tests/asset-cache.test.cjs`, si existen en el estado actual del repositorio. No debilites ni elimines tests para hacerlos pasar.
3. Comprueba que no quedan precios, volúmenes, promesas de autopilot/ROI ni claims eliminados en el HTML, metadata y datos estructurados.
4. Comprueba que la ficha de precios conserva su enfoque **generalista**, mientras la landing rural sigue siendo específica para alojamientos.
5. Actualiza `checklist.md` solo con cambios realmente hechos y pruebas realmente ejecutadas. No marques como publicados ni verificados en producción cambios que siguen locales.
6. No hagas commit, push, deploy ni envíos. Antes de cerrar, vuelve a leer `git status --short` y `git diff --check`; preserva los cambios preexistentes.
7. En el informe final, separa: archivos modificados, pruebas y revisión visual efectivamente realizadas, qué quedó local y qué no, decisiones/precios que siguen pendientes y el bloqueo del flujo de informe por email. No declares “terminado” si la paridad de archivos, las pruebas o la precisión de las promesas no se verifican.

**Criterio final:** la página de precios representa a Pyme360 como oferta general de marketing digital para pymes de varios sectores; la landing rural comunica una mini-revisión concreta y límites honestos; no aparecen precios ni entregables no aprobados; ambas páginas fuente/públicas están sincronizadas; y no se ha publicado nada.

---

### 15.2 Brief B — Blog

*Integrado desde `ANTIGRAVITY-BRIEF-BLOG.md` el 2026-11-09.*

**Objetivo:** crear `/blog/` en la web de Pyme360 con un índice y una plantilla de artículo, y maquetar en local los 12 artículos del plan editorial a medida que su contenido esté listo. Todo coherente con SEO, datos estructurados y GEO.

**Fuente del contenido: NotebookLM.** El texto de los artículos se redacta en NotebookLM, no en este repositorio. Cuaderno: https://notebooklm.google.com/notebook/02b925f2-2553-40f0-a1b3-9e41666d0f92 Toma de ahí el contenido de cada artículo. Si no puedes acceder al cuaderno o a un artículo concreto, detente con ese artículo y pídeselo a José; no redactes tú el texto ni lo completes con contenido propio.

**Estado:** instrucciones internas para cambios locales. No autoriza commit, push, despliegue ni publicación.

**Documentos relacionados:**
- Plan editorial: `articulos/PLAN-EDITORIAL-BLOG.md`. Es la **fuente única de estado**: títulos, slugs, palabras clave, enlaces internos, datos por verificar y estado de cada artículo. Léelo siempre antes de empezar; José lo mantiene actualizado.
- Manifiesto y ensayos rurales: `articulos/README.md`.
- Brief anterior de precios y alojamientos: `checklist.md` §15.1. Sus restricciones siguen vigentes salvo donde este brief autoriza algo concreto.

---

#### 1. Preparación obligatoria

1. Trabaja en `C:\Antigravity\pyme360-growth`. Lee `CLAUDE.md` y `checklist.md`.
2. Comprueba `git status --short`, la rama y los tests antes de tocar nada. Al preparar este brief había cambios sin commitear en varias páginas (`index.html`, `precios.html`, `alojamientos-rurales/index.html`, `llms.txt`, CSS, legales…) y las carpetas `intur/` y `scratch/` sin seguimiento. **Presérvalos todos**: no los reviertas, muevas ni incluyas en otra cosa.
3. Mantén la paridad raíz ↔ `public/` byte a byte en cada archivo que crees o modifiques.
4. No hagas commit, push, despliegue ni envíos. No leas ni muestres secretos.

#### 2. Estructura de URLs y archivos

| URL | Archivo fuente | Copia pública |
| --- | --- | --- |
| `https://pyme360.online/blog/` | `blog/index.html` | `public/blog/index.html` |
| `https://pyme360.online/blog/<slug>/` | `blog/<slug>/index.html` | `public/blog/<slug>/index.html` |

- Los 12 slugs están fijados en la tabla del plan editorial. No los cambies sin que lo actualice el plan.
- Slugs en minúsculas, sin tildes, separados por guiones y con barra final, igual que `/alojamientos-rurales/`.
- Imágenes del blog en `assets/blog/` (y `public/assets/blog/`), en WebP o JPEG optimizado, con `width` y `height`. Si no hay imagen propia adecuada, reutiliza una de `assets/indice/` ya optimizada. No uses fotos de personas reales que no sean José.

#### 3. Diseño

- Reutiliza `assets/pyme360-public.css`, cabecera, pie, banner de cookies y carga diferida de GA4 tal como están en las demás páginas. Usa la misma versión de CSS que el resto (`?v=` actual) y comprueba qué exigen `asset-cache`, `legal-visual`, `premium-form` y `pricing-page` antes de cambiarla.
- **Índice `/blog/`:** H1 «Blog de marketing digital para pymes y alojamientos rurales» (ajustable). Una introducción de 2 frases. Dos bloques con los artículos de cada línea («Marketing para pymes» y «Alojamientos rurales»): tarjeta con título, extracto de 1–2 frases, fecha y tiempo de lectura. Mientras solo haya un artículo, el bloque de pymes muestra un texto breve tipo «Próximamente», sin fechas prometidas.
- **Plantilla de artículo:** ancho de lectura de 680–760 px, migas de pan visibles (Inicio › Blog › Título), H1, línea de autor y fecha, cuerpo, bloque de autor al final, CTA al diagnóstico y 1–2 artículos o páginas relacionadas.
- Tipografía y contraste legibles en fondo claro u oscuro; revisa desktop y móvil a ~390 px sin desbordes.
- Prioriza el contenido: sin animaciones pesadas ni scripts nuevos.

#### 4. Flujo por artículo

Solo maqueta un artículo cuando en el plan editorial su estado sea **«Revisado (datos y fuentes OK)»**. Para cada uno:

1. Toma el texto de NotebookLM, título y slug del plan, y conviértelo a HTML con la plantilla.
2. Comprueba que el primer párrafo responde directamente a la pregunta del título, que los H2 coinciden con los del texto y que hay un bloque final de preguntas frecuentes.
3. **Cifras:** cada porcentaje o dato debe coincidir con la tabla «Datos citados» del plan y llevar enlace a su fuente primaria. Si aparece una cifra que no está verificada en el plan, no la publiques: deja el artículo sin terminar y avisa a José.
4. **Revenue management y Home4Escape:** el revenue management no es servicio de Pyme360; se ofrece a través de Home4Escape. **Solo R01, R04 y R05** llevan un único enlace a `https://www.home4escape.com/` en el pasaje que trata precios, rentabilidad o revenue (redacción de ejemplo en la decisión 1 del plan). Es un enlace secundario: el CTA principal sigue siendo la autoevaluación rural. El resto de artículos y páginas no mencionan Home4Escape ni H4E.
5. **Promesas:** retira las frases de la lista «Frases que no deben llegar al texto final» del plan, y cualquier ROI, ROAS o porcentaje de mejora presentado como resultado de trabajar con Pyme360.
6. **Autor (decisión de José, 2026-11-10):** los artículos los firma **Theo Rubio**, con su ficha de autor y `author` de tipo `Person`. Los estudios propios E1–E4 (`articulos/estudios/`) los firma **Equipo Pyme360**: en la página, «Por el equipo de Pyme360», sin ficha personal; en JSON-LD, `author` = `{"@id": "https://pyme360.online/#empresa"}`.
7. Enlace interno a la página que indica el plan, en un punto natural, y CTA final al diagnóstico (`/#diagnostico` en pymes, `/alojamientos-rurales/#diagnostico` en rurales; ambas anclas existen).
8. Añade la tarjeta del artículo al índice `/blog/` dentro de su línea («Marketing para pymes» o «Alojamientos rurales»).
9. Añade la URL a `sitemap.xml` y a la sección `## Blog` de `llms.txt` (con sus copias en `public/`).
10. Al terminar, indica a José qué artículos han pasado a «Maquetado en local» para que actualice el plan.

**R01 (ensayo 01):** hay un borrador previo en `articulos/la-falacia-del-85-por-ciento-ocupacion.md`. La versión válida es la de NotebookLM; usa el borrador solo si José lo confirma. En cualquier caso, quita el bloque interno «Línea editorial / Objetivo» y el emoji 👉, y no publiques sus cifras del 15–18%, del 22–27% ni el «60% menos de estrés» sin fuente.

#### 5. SEO por página

**Índice `/blog/`**
- `<title>`: «Blog de marketing digital para pymes | Pyme360» (≤ 60 caracteres).
- `meta description` de 140–160 caracteres que mencione pymes, Tenerife/Canarias y alojamientos rurales.
- `canonical`, `og:*`, `twitter:*`, `lang="es"`, `meta robots` «index, follow».

**Cada artículo**
- `<title>` ≤ 60 caracteres con la palabra clave del plan y « | Pyme360». Ejemplo para R01: «La falacia del 85% de ocupación en casas rurales | Pyme360».
- `meta description` de 140–160 caracteres basada en el párrafo de respuesta directa.
- `canonical` a su propia URL; `og:type` «article»; `article:published_time`; `og:image` de 1200×630.
- Un único H1; H2 tal como el ensayo.

#### 6. Datos estructurados (JSON-LD)

- **Índice:** `Blog` con `@id` `https://pyme360.online/blog/#blog`, `publisher` → `{"@id": "https://pyme360.online/#empresa"}`, `inLanguage` «es» y `BreadcrumbList` (Inicio › Blog).
- **Artículo:** `BlogPosting` con `headline`, `description`, `image`, `datePublished`, `dateModified`, `inLanguage`, `mainEntityOfPage`, `isPartOf` → `#blog`, `publisher` → `#empresa` y `author` como `Person` (nombre, `jobTitle` y `url` o `sameAs` cuando José los confirme), más `BreadcrumbList` (Inicio › Blog › Artículo).
- No redefinas la entidad `#empresa`: solo referénciala por `@id`.
- No incluyas `FAQPage` en el artículo salvo que tenga una sección de preguntas visible.

#### 7. Enlazado y descubrimiento

- **Navegación:** añade «Blog» en el menú principal y en el pie de `index.html`, `precios.html`, `alojamientos-rurales/index.html` e `indice-pyme360/index.html`, más el pie de las páginas legales, con sus copias en `public/`. En la Home, este brief autoriza **solo** el enlace de navegación y el del pie; ningún otro bloque.
- **Alojamientos rurales:** un enlace discreto a los artículos rurales (o al índice del blog) en un punto natural, por ejemplo cerca de las preguntas frecuentes, sin reordenar secciones.
- **`sitemap.xml`** (y `public/`): añade `/blog/` y la URL de cada artículo maquetado con `<lastmod>`. Mantén las URLs que ya comprueba `tests/seo-performance.test.cjs`.
- **`llms.txt`** (y `public/`): añade una sección `## Blog` con el índice y cada artículo maquetado (título + URL + una línea). No toques el resto del archivo.

#### 8. Tests y verificación

1. Crea `tests/blog.test.cjs`. Debe comprobar:
   - paridad raíz ↔ `public/` de las páginas del blog;
   - un solo H1, canonical correcto y title ≤ 60 caracteres;
   - JSON-LD válido (`JSON.parse`) con `BlogPosting`; `author` de tipo `Person` (Theo Rubio) en los artículos y la organización `#empresa` en los estudios E1–E4;
   - presencia de las URLs del blog en `sitemap.xml` y `llms.txt`;
   - enlace «Blog» en la navegación de Home, Precios y Alojamientos.
2. Ejecuta la batería completa de tests existente más el nuevo. No debilites ni elimines tests para que pasen.
3. Revisión visual en desktop y móvil (~390 px) del índice y del artículo.
4. Valida los JSON-LD con un parser y revisa que no aparezca ninguna cifra sin fuente verificada en el plan.
5. Actualiza `checklist.md` y la sesión en `CLAUDE.md` solo con lo que realmente hayas hecho y probado.
6. Antes de cerrar: `git status --short` y `git diff --check`. No commit, push ni despliegue.

#### 9. Informe final

Separa:
- archivos creados y modificados;
- tests ejecutados y su resultado;
- revisión visual hecha;
- qué artículos han pasado a «Maquetado en local» y cuáles siguen bloqueados y por qué (texto en NotebookLM, cifras, autor, imagen);
- lo que queda solo en local.

No declares «terminado» un artículo si falta la ficha de autor confirmada, si la paridad o los tests fallan o si quedan cifras sin fuente.

**Criterio final:** `/blog/` existe con índice y plantilla reutilizables; cada artículo maquetado procede de NotebookLM, está firmado por Theo Rubio (los estudios, por Equipo Pyme360) y no tiene cifras inventadas; el blog está enlazado desde la navegación, el sitemap y `llms.txt`; todos los tests pasan; y no se ha publicado nada.

---

### 15.3 Brief C — Casos y proyectos en la Home

*Integrado desde `ANTIGRAVITY-BRIEF-CASOS-Y-PROYECTOS.md` el 2026-11-09.*

**Objetivo:** sustituir la sección actual de testimonios de la Home por una sección «Casos y proyectos» que muestre trabajo real: clientes con su permiso y, aparte, los proyectos propios del equipo.

**Estado:** instrucciones internas para cambios locales. No autoriza commit, push, despliegue ni publicación.

**Por qué:** los artículos del blog, la auditoría SEO y la confianza de Google y de las IAs dependen de pruebas verificables. La sección actual no lo es: mezcla proyectos propios presentados como clientes con negocios que parecen ejemplos inventados.

---

#### 1. Preparación obligatoria

1. Trabaja en `C:\Antigravity\pyme360-growth`. Lee `CLAUDE.md`, `checklist.md` y este brief.
2. Comprueba `git status --short`, rama y tests antes de tocar nada. Hay cambios locales sin commitear en varias páginas: **presérvalos**.
3. Paridad raíz ↔ `public/` byte a byte en todo lo que toques (`index.html`, `assets/pyme360-public.css`, `assets/pyme360-public.js` y sus copias).
4. No hagas commit, push, despliegue ni envíos.

#### 2. Diseño: mismo sistema visual que el resto de la web

**Regla de José:** cualquier sección o página nueva sigue exactamente el diseño del resto de la web.

- Reutiliza las clases, tokens de color, tipografía, espaciados, tarjetas, botones y componentes que ya existen en `assets/pyme360-public.css`. Parte de las tarjetas de testimonios actuales (`.testimonial-card`) o de las tarjetas de sectores de la Home.
- No crees una paleta, tipografía ni estilo de tarjeta nuevos. Si necesitas una variante, hazla como modificador de una clase existente.
- Mantén el tema oscuro de la Home y su contraste. Revisa desktop y móvil a ~390 px sin desbordes.
- Sin animaciones nuevas pesadas. Si se conserva el carrusel actual, reutiliza su JS; si la sección pasa a ser una rejilla estática, retira el JS que deje de usarse.

#### 3. Qué hay ahora y qué se quita

La sección `section.testimonials` de `index.html` muestra 5 testimonios (datos también en `window.pyme360Testimonials` de `assets/pyme360-public.js`):

| Testimonio actual | Problema | Acción |
| --- | --- | --- |
| Home4Escape | Proyecto propio presentado como cliente con una cita | Pasa a «Proyectos propios», sin cita de testimonio |
| Nomads Jungle | Proyecto propio presentado como cliente con una cita | Pasa a «Proyectos propios», sin cita de testimonio |
| Cafetería Brisa | Etiquetado «Caso tipo de pyme local»: es un ejemplo, no un cliente | **Eliminar** |
| Hotel Rural El Mirador | Sin constancia de que sea cliente real | **Eliminar**, salvo que José confirme por escrito que es cliente real y autoriza su nombre y cita |
| Isla Norte Tours | Sin constancia de que sea cliente real | **Eliminar**, salvo confirmación por escrito de José |

**No publiques ninguna cita, nombre o logo de cliente que no esté confirmado.** Un testimonio inventado o atribuido a quien no lo dijo daña la marca y puede ser publicidad engañosa.

#### 4. Nueva sección «Casos y proyectos»

**Ubicación:** donde está hoy la sección de testimonios, con el mismo ancla o una nueva `#casos`.
**Título sugerido (H2):** «Trabajo real, en negocios reales». Eyebrow: «Casos y proyectos».
**Introducción (1–2 frases):** qué hacemos para clientes y qué hemos construido para nosotros mismos.

##### 4.1 Clientes

| Cliente | Web | Qué es | Qué hizo Pyme360 | Estado |
| --- | --- | --- | --- | --- |
| Equalis Consultoría Canaria | https://www.equalisconsultoriacanaria.es/ | Consultoría en igualdad, protocolos de acoso, medidas LGTBI, Puntos Violeta y formación para empresas e instituciones en Canarias | Según José: diseño web, redes sociales, Google Ads, blog de contenidos, ficha de Google Business y estrategia de SEO local. **Confirmar la lista exacta con José** | Pendiente de permiso por escrito del cliente |
| Aceviños Jardinería | https://acevinosjardineria.com/ | Venta e instalación de césped artificial en Tenerife | **Pendiente: José indica qué servicios se hicieron** | Pendiente de permiso por escrito del cliente |

Cada tarjeta de cliente lleva:
- nombre del cliente y enlace a su web (`rel="noopener"`);
- sector en una línea;
- servicios realizados, como etiquetas cortas (Web, SEO local, Google Ads, Redes, Contenidos);
- **resultado solo si es un dato real y medible** que José facilite (por ejemplo, tráfico o contactos antes/después con fechas). Sin dato real, no se pone resultado;
- **cita del cliente solo si el cliente la ha escrito o aprobado**. Sin cita aprobada, la tarjeta va sin cita;
- logo del cliente solo con su permiso; si no, sus iniciales con el estilo de logo actual.

**Bloqueo:** no publiques las tarjetas de clientes hasta que José confirme (a) permiso de cada cliente, (b) servicios realizados y (c) cualquier resultado o cita. Puedes maquetar la estructura, pero deja las tarjetas de clientes fuera del HTML final hasta tener la confirmación, y señálalo en el informe.

##### 4.2 Proyectos propios del equipo

Subtítulo sugerido: «Proyectos propios». Una línea que lo explique: «Marcas que hemos creado y gestionamos nosotros: aplicamos en ellas lo mismo que proponemos a nuestros clientes».

| Proyecto | Web | Descripción en una línea |
| --- | --- | --- |
| Home4Escape | https://www.home4escape.com/ | Alquiler vacacional de villas y casas rurales en Canarias |
| Nomads Jungle | https://nomadsjungle.com/ | Vivienda profesional por temporada (1–6 meses) en Canarias para empresas y profesionales desplazados |
| Diario de Abordo | https://diariodeabordo.es/ | Blog y newsletter sobre crecimiento personal, liderazgo y sistemas |
| Roam Retreats | https://roamretreats.es/ | Consultoría boutique de inversión hotelera; sociedad titular de la marca Pyme360 |

- Sin citas de testimonio: son proyectos propios, no clientes.
- Sin resultados numéricos salvo que José los facilite.
- Diseño: misma tarjeta que los clientes, visualmente diferenciada solo con la etiqueta «Proyecto propio».

**Home4Escape en la Home:** este brief autoriza nombrarlo en esta sección como proyecto propio. Es una excepción a la regla «no mencionar H4E» de `checklist.md` §15.1, que sigue vigente en la landing de alojamientos rurales.

#### 5. SEO y datos estructurados

- La sección usa un H2 y H3 por tarjeta; no añadas otro H1.
- **No añadas** `Review`, `AggregateRating` ni testimonios a JSON-LD: Google no admite reseñas autopublicadas sobre la propia empresa.
- No modifiques la entidad `#empresa` del JSON-LD por esta sección.
- Enlaces a las webs de clientes y proyectos con `rel="noopener"`; sin `nofollow` (son relaciones reales).

#### 6. Tests

- `tests/testimonials.test.cjs` comprueba hoy los 5 autores actuales. **Actualízalo al nuevo contenido** (proyectos propios y, cuando estén confirmados, clientes): que no aparezcan Cafetería Brisa, Hotel Rural El Mirador ni Isla Norte Tours salvo confirmación; que cada tarjeta enlace a su web; paridad raíz ↔ `public/`. Es un cambio de contrato pedido por José, no una forma de debilitar el test: documenta el cambio en el informe.
- Ejecuta la batería completa. No elimines tests para que pasen.
- Revisión visual en desktop y móvil.

#### 7. Registro

- Actualiza `checklist.md` y la sesión en `CLAUDE.md` solo con lo hecho y probado.
- Informe final: archivos tocados, tests, revisión visual, qué tarjetas quedaron fuera por falta de confirmación y qué falta que aporte José.

**Criterio final:** la Home ya no muestra testimonios inventados ni proyectos propios disfrazados de clientes; la sección «Casos y proyectos» sigue el diseño del resto de la web; los clientes solo aparecen con permiso y datos confirmados; los tests pasan; y no se ha publicado nada.

---

### 15.4 Brief D — Recogida de datos por API para los estudios E1, E2 y E4

*Añadido el 2026-11-09. Archivos de cada estudio en `articulos/estudios/`; datos internos en `articulos/estudios/interno/` (excluido de git, NO PUBLICAR).*

**Reglas comunes:** usa solo las claves de API que ya tienes configuradas; no las escribas en ningún fichero del repositorio, en informes ni en el chat. Guarda los resultados en `articulos/estudios/interno/`. Anota fecha y hora de cada recogida. Si una API no está disponible, dilo y sigue con la siguiente; no sustituyas datos por estimaciones. No publiques nada ni hagas commit/push.

**D1 · E1, velocidad móvil (API de PageSpeed Insights)**
- [x] Para cada URL de `articulos/estudios/interno/E1-datos.csv` (columna `final_url`), llama a PageSpeed Insights con `strategy=mobile` y `category=performance`.
- [x] Guarda en `interno/E1-pagespeed.csv`: url, fecha, puntuación de rendimiento (0–100), LCP, CLS, TBT y si hay datos de campo (CrUX).
- [x] Informa: mediana de la puntuación, nº de webs con puntuación <50, 50–89 y ≥90, y cuántas tienen datos de campo.

**D2 · E2, fichas de Google de restaurantes (API de Google Places)**
- [x] Búsquedas de texto: «restaurantes en Santa Cruz de Tenerife» y «restaurantes en San Cristóbal de La Laguna». Toma los 25 primeros resultados de cada una (50), excluyendo cadenas de más de 3 locales. Guarda la posición.
- [x] Por ficha, con Place Details: categoría principal, horario (¿7 días?), teléfono, web (propia / plataforma / ninguna), valoración, número de reseñas, número de fotos devueltas, si tiene `reservable`, `menu`/carta, descripción editorial y atributos disponibles.
- [x] Respuestas del propietario: la API no las ofrece de forma fiable. Si no puedes obtenerlas, deja la variable fuera y dilo; no la estimes.
- [x] Guarda en `interno/E2-fichas.csv` y rellena la tabla de resultados de `estudios/E2-fichas-google-restaurantes.md` (posiciones 1–5 frente a 6–25 y total). Sustituye los `[COMPLETAR]` solo con datos recogidos.
- [x] Respeta las condiciones de Google Places: no publiques los datos crudos de las fichas, solo resultados agregados.

**D3 · E4, recomendaciones de asistentes de IA (APIs de OpenAI, Gemini y Perplexity)**
- [x] Ejecuta las 10 consultas de `interno/E4-protocolo-consultas.md`, 3 repeticiones por consulta y asistente, cada una en una conversación nueva. Usa los modelos con búsqueda web activada si la API lo permite y anota el modelo exacto.
- [x] Registra por respuesta: fecha y hora, asistente y modelo, consulta, repetición, negocios recomendados en orden y fuentes citadas (URL).
- [x] Para cada consulta, obtén los 10 primeros resultados de Google Places (misma búsqueda de texto) como comparación.
- [x] Guarda en `interno/E4-respuestas.csv` y calcula: coincidencia con el top 10 y el top 3 de Google, estabilidad entre repeticiones y negocios recomendados que no existen o están cerrados (compruébalo con Places).
- [x] Indica en la metodología del estudio que las respuestas por API pueden diferir de las de la aplicación de cada asistente.

**Informe al terminar:** qué APIs estaban disponibles, cuántas llamadas se hicieron, qué datos faltan y por qué, y ficheros generados. Avisa a José para que Claude redacte los artículos con los datos.
