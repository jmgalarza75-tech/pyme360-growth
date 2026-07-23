# Checklist maestro — Implantación Índice Pyme360®

**Proyecto correcto:** `C:\Antigravity\pyme360-growth`  
**Carpeta pública:** `C:\Antigravity\pyme360-growth\public`  
**URL elegida por José:** `https://pyme360.online/indice-pyme360/`  
**Landing canónica:** `public/indice-pyme360/index.html`  
**JS de la landing:** `public/assets/indice-pyme360.js`  
**Última actualización:** 2026-07-23

---

## 0. Aviso crítico para cualquier modelo que continúe

- [ ] Trabajar en `C:\Antigravity\pyme360-growth`.
- [ ] No usar `C:\Antigravity\especialista en marketing` como web pública principal.
- [ ] No usar `CHECKLIST_OPUS_PENDIENTES.md` como guía de esta web; pertenece al proyecto interno anterior.
- [ ] No sustituir la home `public/index.html`.
- [ ] No hacer commit ni push sin confirmación expresa de José.
- [ ] No subir secretos, credenciales ni `config.php` a GitHub.
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
- [ ] Decidir si se enlaza desde la home o solo desde campañas/correos.
- [ ] Si se indexa, actualizar `public/sitemap.xml` con `/indice-pyme360/`.
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

- [ ] Validar sintaxis PHP en un entorno con PHP instalado o en Hostinger (`php -l procesar-lead.php`).
- [ ] Probar envío real desde Hostinger.
- [ ] Confirmar que `config.php` en Hostinger sigue presente y no se sube a Git.
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
- [ ] Revisar cookies/analítica.
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
