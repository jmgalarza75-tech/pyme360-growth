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
- `precios.html` - página de precios
- `aviso-legal.html` - aviso legal
- `privacidad.html` - política de privacidad
- `cookies.html` - política de cookies
- `assets/pyme360-public.css` - estilos compartidos de la web pública
- `assets/pyme360-public.js` - interacciones públicas y envío del formulario
- `assets/pyme360-logo.svg` - logotipo
- `assets/pyme360-favicon.svg` - favicon
- `robots.txt`, `sitemap.xml`, `site.webmanifest` - SEO y metadatos del navegador

La carpeta `public/` contiene una copia preparada para producción, pensada para subirse a `public_html` en Hostinger.

## Captación de Leads

El formulario de diagnóstico de `index.html` se gestiona desde `assets/pyme360-public.js`.

El formulario construye un lead y lo envía a Supabase:

- API base: `https://veqpsnxqecehdaygycmi.supabase.co`
- Endpoint de tabla: `/rest/v1/leads`
- Valor de origen: `web_publica`

Cuando se editen campos del formulario, hay que actualizar:

- El marcado del formulario en `index.html`
- El constructor del payload en `assets/pyme360-public.js`

También hay que reflejar los cambios en `public/` cuando esa carpeta sea la fuente usada para subir a producción.

## Notas de Desarrollo

Es una web estática hecha con HTML, CSS y JavaScript. No hay sistema de build, framework ni configuración de gestor de paquetes en el repositorio.

Los cambios se pueden hacer directamente en los archivos HTML, CSS y JS.

Cuando se cambie comportamiento, conviene ejecutar los tests existentes en la carpeta `tests/`.

## Archivos Que No Deben Publicarse

No subas a Hostinger archivos privados de operación, credenciales, paneles internos ni scripts locales.

Ejemplos de archivos que deben quedarse fuera de la web pública:

- `.env`
- paneles internos
- scripts locales de automatización
- credenciales de API
- herramientas privadas de CRM o mailing

## Precaución Importante

El JavaScript público contiene una clave publicable de Supabase. Trátala como configuración pública de cliente, no como un secreto. Los permisos sensibles de la base de datos deben protegerse en Supabase mediante Row Level Security y políticas de API adecuadas.
