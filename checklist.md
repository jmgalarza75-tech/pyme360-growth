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









