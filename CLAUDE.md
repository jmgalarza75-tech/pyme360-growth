# Pyme360 Growth - Contexto del Proyecto

## Qué Es Este Proyecto

Este repositorio contiene la web pública de Pyme360, un servicio de marketing digital para pequeñas y medianas empresas locales en España.

La web explica el sistema de crecimiento de Pyme360, presenta los planes de precios y capta oportunidades mediante un formulario de diagnóstico gratuito.

## Publicación

El repositorio está conectado a GitHub:

- Remoto: `https://github.com/jmgalarza75-tech/pyme360-growth.git`
- Rama principal: `main`

La web pública se despliega mediante Hostinger.

Configuración esperada en Hostinger:

- Rama: `main`
- Carpeta pública: `public_html`
- Página de inicio: `index.html`
- Dominio público: `https://pyme360.online/`

Si el despliegue desde GitHub está activado en Hostinger, hacer `push` a `main` debería actualizar la web online automáticamente. Si no está activado, hay que subir manualmente los archivos públicos a `public_html`.

## Estructura del Sitio

Archivos públicos principales:

- `index.html` - página principal
- `alojamientos-rurales/index.html` - landing comercial/SEO para revisión digital de alojamientos rurales (`/alojamientos-rurales/`)
- `indice-pyme360/index.html` - landing interna/técnica vinculada al Índice Pyme360® (`/indice-pyme360/`)
- `precios.html` - página de precios
- `aviso-legal.html` - aviso legal
- `privacidad.html` - política de privacidad
- `cookies.html` - política de cookies
- `assets/pyme360-public.css` - estilos compartidos de la web pública
- `assets/pyme360-public.js` - interacciones públicas y envío del formulario
- `assets/pyme360-logo.svg` - logotipo principal
- `assets/pyme360-favicon.svg` - favicon
- `assets/pyme360-shield-mark.png` - marca tipo escudo usada como imagen social y en el pie de página
- `assets/pyme360-og-image.png` - imagen destacada para redes sociales
- `robots.txt`, `sitemap.xml`, `site.webmanifest` - SEO y metadatos del navegador

La carpeta `public/` contiene una copia preparada para producción, pensada para subirse a `public_html` en Hostinger. Cuando se cambien HTML, CSS, JS o imágenes públicas, hay que sincronizar también la copia equivalente dentro de `public/`.

## Funcionalidades Actuales

### Hero y SEO

- La página principal tiene meta título, meta descripción, Open Graph y Twitter Cards.
- La imagen destacada se sirve desde `assets/pyme360-og-image.png`.
- El favicon y manifest usan la identidad visual de Pyme360.

### Órbita del Proceso

La sección de etapas del sistema usa `assets/pyme360-public.js` para rotar automáticamente entre fases:

- Diagnóstico
- Fugas
- Prioridad
- Ejecución
- Medición

La rotación se pausa al pasar el ratón o al enfocar la sección, y respeta `prefers-reduced-motion`.

### Testimonios

La sección de testimonios usa tarjetas con efecto de baraja en escritorio y carrusel horizontal con `scroll-snap` en móvil.

Testimonios actuales:

- `Home4Escape`
- `Nomads Jungle`
- `Cafetería Brisa`
- `Hotel Rural El Mirador`
- `Isla Norte Tours`

Los datos de testimonios viven en `assets/pyme360-public.js`, dentro del array `testimonials`. El HTML inicial de `index.html` y `public/index.html` también incluye las tarjetas para que haya contenido visible antes de cargar JavaScript.

Cuando se modifiquen testimonios, revisar:

- `assets/pyme360-public.js`
- `assets/pyme360-public.css`
- `index.html`
- `public/assets/pyme360-public.js`
- `public/assets/pyme360-public.css`
- `public/index.html`
- `tests/testimonials.test.cjs`

### Pie de Página

El pie de página incluye la marca tipo escudo centrada y enlaces legales a:

- Aviso legal
- Privacidad
- Cookies

## Captación de Leads

El formulario de diagnóstico de `index.html` se gestiona desde `assets/pyme360-public.js`.

El formulario construye un lead y lo envía al backend PHP propio en Hostinger:

- Endpoint: `/procesar-lead.php`
- El script guarda el lead en MySQL y envía un email de aviso a `info@pyme360.online`
- Valor de origen: `web_publica`

**Credenciales de base de datos y SMTP:** Se almacenan exclusivamente en `config.php` en el servidor de Hostinger. Este archivo NUNCA debe subirse a GitHub. Ver plantilla en `config.example.php`.

Cuando se editen campos del formulario, hay que actualizar:

- El marcado del formulario en `index.html`
- El constructor del payload en `assets/pyme360-public.js`
- El script `procesar-lead.php` (columnas en la INSERT y campos del email de aviso)
- El schema `schema.sql` (si se añaden columnas a la tabla)
- La copia equivalente dentro de `public/`
- Los tests relacionados, especialmente `tests/form-submit.test.cjs`

## Versionado de Assets

La web no tiene build ni hash automático de archivos. Para evitar caché vieja en navegador/Hostinger, las referencias a CSS y JS usan query string de versión:

- `assets/pyme360-public.css?v=...`
- `assets/pyme360-public.js?v=...`

Cuando se cambie `assets/pyme360-public.css` o `assets/pyme360-public.js`, subir la versión en:

- `index.html`
- `precios.html` si aplica
- páginas legales si cargan el CSS compartido
- copias equivalentes dentro de `public/`
- tests de caché y páginas: `tests/asset-cache.test.cjs`, `tests/pricing-page.test.cjs`, `tests/legal-visual.test.cjs`

La versión activa tras la migración del formulario es `20260713-3`.

## Notas de Desarrollo

Es una web estática hecha con HTML, CSS y JavaScript. No hay sistema de build, framework ni configuración de gestor de paquetes en el repositorio.

Los cambios se pueden hacer directamente en los archivos HTML, CSS y JS.

Antes de hacer commit en cambios de la web pública, ejecutar como mínimo:

```powershell
node --check assets\pyme360-public.js
node tests\testimonials.test.cjs
node tests\form-submit.test.cjs
node tests\asset-cache.test.cjs
```

Para cambios que afecten a precios, legales o layout, ejecutar también:

```powershell
node tests\pricing-page.test.cjs
node tests\legal-visual.test.cjs
node tests\layout.test.cjs
```

## Flujo Git Recomendado

El flujo habitual para publicar cambios es:

```powershell
git status --short --branch
git add <archivos>
git commit -m "feat: descripción breve"
git push origin main
```

Después del push, si Hostinger tiene activo el despliegue desde GitHub, la web debería actualizarse automáticamente. Si no se actualiza, comprobar en Hostinger que el despliegue desde GitHub está conectado a `main` y apuntando a la carpeta pública correcta.

## Archivos Que No Deben Publicarse

No subas a Hostinger archivos privados de operación, credenciales, paneles internos ni scripts locales.

Ejemplos de archivos que deben quedarse fuera de la web pública:

- `.env`
- `config.php` (credenciales de BD y SMTP — solo en Hostinger vía Administrador de Archivos)
- paneles internos
- scripts locales de automatización
- herramientas privadas de CRM o mailing

Antes de subir cambios públicos, es útil revisar que no se han enlazado archivos internos:

```powershell
rg -n "dashboard\.html|buscador\.html|pipeline\.html|newsletter\.html|\.env|pravatar" index.html assets tests public
```

## Sesión 2026-06-25: Sincronización y Tests (Project Memory)
- **Tareas realizadas:**
  - Resolución de fallos en la batería de tests locales (
ode tests/...).
  - Corrección de priceRange en JSON-LD de precios.html (reemplazo del símbolo de euro prohibido por $$).
  - Corrección de error de sintaxis en el archivo principal  ssets/pyme360-public.js.
  - Actualización del test orm-submit.test.cjs para reflejar la inclusión de los campos objetivo y presupuesto en el payload.
  - Sincronización de los archivos modificados a la carpeta estática public/.
  - Subida (commit y push) de los cambios a GitHub en la rama main.
- **Errores y Soluciones:**
  - *Error:* Duplicidad de líneas al hacer multi-reemplazo en el test. *Solución:* Limpieza manual del sobrante y validación.
- **Estado final:** Todos los tests pasando, archivos en public/ sincronizados, rama main actualizada.

## Sesión 2026-06-27: Migración del Formulario de Supabase a PHP + MySQL en Hostinger

- **Tareas realizadas:**
  - Diagnóstico del fallo del formulario: el proyecto gratuito de Supabase estaba pausado por inactividad (el dominio `veqpsnxqecehdaygycmi.supabase.co` no resolvía DNS).
  - Evaluación comparativa de alternativas: Supabase, Web3Forms, PHP+SMTP, PHP+MySQL+Email. Elegida la opción PHP+MySQL+Email en Hostinger por ser la más robusta y sin dependencias externas.
  - Creación de `procesar-lead.php`: endpoint PHP con PDO (prepared statements), validación de campos y doble email de aviso (`info@pyme360.online` + `jmgalarza75@gmail.com`).
  - Creación de `schema.sql`: sentencia `CREATE TABLE leads` lista para ejecutar en phpMyAdmin.
  - Creación de `config.example.php`: plantilla pública sin credenciales reales, para Git.
  - Modificación de `assets/pyme360-public.js`: eliminadas constantes de Supabase, reemplazadas por `LEAD_ENDPOINT = '/procesar-lead.php'`. Payload simplificado a estructura plana.
  - Corrección del mensaje de error del formulario: cambiado `hola@home4escape.com` por `info@pyme360.online`.
  - Bump de versión del JS a `20260713-3` en `index.html`, `precios.html` y `public/index.html` para romper caché.
  - Actualización de `tests/form-submit.test.cjs` y `tests/asset-cache.test.cjs` para reflejar el nuevo payload y versión.
  - Sincronización a `public/assets/pyme360-public.js`.
  - Configuración manual en Hostinger vía navegador:
    - BD MySQL creada: `u807029315_pyme360lead` / usuario: `u807029315_infpyme360lead` / pass: `Nomads2014*`
    - Tabla `leads` creada vía phpMyAdmin ejecutando `schema.sql`.
    - `config.php` creado directamente en `public_html/` desde el Administrador de Archivos de Hostinger.
  - Configuración del buzón `info@pyme360.online` en Android (IMAP/SMTP: `imap.hostinger.com` / `smtp.hostinger.com`, puerto 993/465, SSL).
  - 3 commits y push a `main`.

- **Errores y Soluciones:**
  - *Error:* El test `form-submit.test.cjs` quedó con el encabezado duplicado tras un reemplazo fallido. *Solución:* Sobreescritura completa del archivo con `write_to_file`.
  - *Error:* `asset-cache.test.cjs` seguía validando la versión `20260713-3` tras el bump. *Solución:* Actualización de la versión esperada en el test.
  - *Error:* El comando `&&` no funciona en PowerShell. *Solución:* Usar `;` como separador de comandos encadenados en PowerShell.

- **Estado final:** Todos los tests pasan. Formulario operativo en producción con backend PHP propio. Supabase eliminado como dependencia. Base de datos `u807029315_pyme360lead` activa en Hostinger.

## Sesión 2026-07-13: Refinamiento de Formulario y Corrección de Despliegue en Hostinger

- **Tareas realizadas:**
  - Resolución de problemas visuales en el formulario (alineación de texto y diseño del checkbox de privacidad).
  - Corrección de error 500 iterativo (`Server configuration missing`) en el entorno de producción.
  - Implementación de `.gitignore` para prevenir que la sincronización automática de Hostinger elimine `config.php`.
  - Inyección de un correo de confirmación dinámico en formato `multipart/alternative` (HTML y Texto) desde `procesar-lead.php` con publicidad y enlaces.
  - Ajuste de los desplegables de "Objetivo" y "Sector" (`index.html` y `lead_magnet.html`) orientados a dolor/beneficio y priorizando al sector turístico.
  - Múltiples actualizaciones, commits y despliegues sincronizando a producción.

- **Errores y Soluciones:**
  - *Error:* Checkbox de privacidad se renderizaba como un bloque blanco gigante debido a los estilos de los inputs generales. *Solución:* Aplicar explícitamente `appearance: auto` y anular anchos forzados en CSS.
  - *Error:* El endpoint devolvía 500 tras cada push de código a `main`. *Causa descubierta:* Al estar configurado el autodeploy, Hostinger borraba el archivo local `config.php` por no existir en GitHub. *Solución Definitiva:* Creación y subida de `.gitignore` trackeando `config.php` para bloquear su sobreescritura remota.
  - *Error Potencial:* Fallo en `mail()` de PHP por caracteres UTF-8 en el encabezado `From:`. *Solución:* Usar `base64_encode()` en la cadena con caracteres especiales (`Teo · Pyme360 Growth`).

- **Estado final:** Formulario totalmente operativo y rediseñado, con respuesta automática por correo implementada. La configuración del servidor protegida contra sobreescrituras git.

## Sesión 2026-07-23/24: Landing alojamientos rurales y piloto comercial

### Disparador de continuidad

Si José escribe `/pyme360`, continuar este proyecto desde `C:\Antigravity\pyme360-growth` revisando primero:

- `checklist.md`
- `outreach/rural-landing-pilot/`
- estado de Git (`git status --short --branch`)

`C:\Antigravity\especialista en marketing` es legacy/histórico y no debe usarse como web pública principal salvo petición explícita.

### Landing activa

Ruta comercial publicada:

- `https://pyme360.online/alojamientos-rurales/`
- archivos raíz: `alojamientos-rurales/index.html`
- copia producción: `public/alojamientos-rurales/index.html`
- estilos: `assets/pyme360-public.css` y `public/assets/pyme360-public.css`

Posicionamiento actual:

- Oferta: **mini-revisión de reservas directas**.
- Promesa: revisar web, Google, fotos, reseñas, contacto y canales como Booking/Airbnb.
- Entregable: **3–5 observaciones claras** y prioridad de qué tocar primero.
- H1 aprobado por José: `Te decimos qué puede estar frenando reservas directas en tu alojamiento`.

Reglas de copy aprobadas:

- No usar `pequeños alojamientos`, `alojamientos pequeños` ni jerga interna.
- No mencionar FARO/Home4Escape/arquitectura interna en la landing rural.
- Usar nombres concretos y aspiracionales: casas rurales, hoteles rurales, apartamentos rurales, viviendas vacacionales, fincas turísticas y alojamientos independientes.
- El mensaje debe entenderse en 5 segundos por una propietaria real.

Verificaciones realizadas:

- Tests JS/backend/form/cache pasados tras los cambios.
- Formulario online probado con respuesta `201 {"ok":true}`.
- Fix móvil específico para evitar que títulos como `OTA que se llevan margen` se salgan del cuadro.
- Producción verificada con URL cache-busting y capturas locales/online.

### Piloto comercial activo

Carpeta operativa:

- `outreach/rural-landing-pilot/`

Archivos clave:

- `README.md` — plan del piloto, métricas y proceso.
- `prospectos-piloto.csv` — 20 candidatos iniciales desde OSM/Maps.
- `primeros-10.md` — candidatos priorizados.
- `primeros-3-observaciones-y-mensajes.md` — observaciones y mensajes personalizados.
- `mensajes-frio.md` — mensajes por canal y follow-ups.
- `plantilla-mini-revision.md` — plantilla de entrega.
- `cuestionario-mini-revision.md` — versión corta y completa del cuestionario.
- `cuestionario-campos.csv` — 18 campos estructurados para Tally/Google Forms/formulario propio.
- `envio-ejecutado-2026-07-23.md` — registro de envíos realizados.

Estado comercial:

- Enviados 2 correos desde Outlook local / `info@pyme360.online`:
  - Hotel Rural Senderos de Abona — `info@senderosdeabona.es`.
  - Hotel El Tejar & Spa — `eltejarhotelvilaflor@gmail.com`.
- Ambos verificados en `Elementos enviados`, hora aproximada `2026-07-23 23:04:41 UTC`.
- Estados CSV: `P001` y `P002` en `contactado_d1`.
- Casa Rural La Campiña (`P004`) queda pendiente de validar contacto correcto antes de enviar nada.

Seguimiento programado:

- Cron Hermes: `e3af288a709b` — `Pyme360 rural outreach follow-up check`.
- Próxima ejecución: `2026-07-28 09:30`.
- Objetivo: revisar Outlook en modo read-only para detectar respuestas y preparar follow-ups útiles si no hay respuesta. No envía nada automáticamente.

### Siguiente paso recomendado

1. Esperar respuestas de Senderos/El Tejar.
2. Si responden “sí”, enviar la versión corta del cuestionario de 6 preguntas.
3. Si no responden en 4–5 días, preparar follow-up útil con una observación concreta, no un “solo hago seguimiento”.
4. Antes de ampliar a más leads, validar contacto correcto de La Campiña o elegir otros candidatos de `primeros-10.md`.
