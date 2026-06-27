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

La versión usada tras el último cambio de testimonios es `20260624-4`.

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

## Precaución Importante

El JavaScript público contiene una clave publicable de Supabase. Trátala como configuración pública de cliente, no como un secreto. Los permisos sensibles de la base de datos deben protegerse en Supabase mediante Row Level Security y políticas de API adecuadas.

## Sesión 2026-06-25: Sincronización y Tests (Project Memory)
- **Tareas realizadas:**
  - Resolución de fallos en la batería de tests locales (
ode tests/...).
  - Corrección de priceRange en JSON-LD de precios.html (reemplazo del símbolo de euro prohibido por $$).
  - Corrección de error de sintaxis en el archivo principal ssets/pyme360-public.js.
  - Actualización del test orm-submit.test.cjs para reflejar la inclusión de los campos objetivo y presupuesto en el payload.
  - Sincronización de los archivos modificados a la carpeta estática public/.
  - Subida (commit y push) de los cambios a GitHub en la rama main.
- **Errores y Soluciones:**
  - *Error:* Duplicidad de líneas al hacer multi-reemplazo en el test. *Solución:* Limpieza manual del sobrante y validación.
- **Estado final:** Todos los tests pasando, archivos en public/ sincronizados, rama main actualizada.

