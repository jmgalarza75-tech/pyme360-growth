# Pyme360 Growth — Contexto de proyecto para cualquier modelo o agente

> **🤖 NOTA PARA ASISTENTES IA:** La gestión de tareas y pendientes de este proyecto NO se lleva en este archivo. Debes buscar y leer siempre el archivo `checklist.md` en la raíz del proyecto para conocer y actualizar el estado de las tareas.

> Aunque el archivo se llama `CLAUDE.md` por compatibilidad con algunas herramientas, su contenido es un contexto compartido para Claude, Gemini, Codex, Hermes, OpenCode y otros agentes.

## Orden de lectura

1. Leer el mapa maestro de Obsidian.
2. Leer este contexto del repositorio.
3. Comprobar el estado vivo del repositorio, la configuración de publicación y los tests antes de modificar o afirmar nada.
4. Tratar cualquier dato fechado o procedente de una memoria histórica como pendiente de verificación.

## Mapa maestro de referencia
- Leer primero: `C:\Antigravity\Obsidian_Jose_Maria\20 Proyectos\30 Objetivos y Operaciones\Sistema 4K\MAPA-MAESTRO-PYME360.md`
- Vista rápida HTML: `file:///C:/Antigravity/especialista%20en%20marketing/arquitectura.html`

## Qué Es Este Proyecto

Este repositorio contiene la web pública de Pyme360, un servicio de marketing digital para pequeñas y medianas empresas locales en España.

La web explica el sistema de crecimiento de Pyme360, presenta los planes de precios y capta oportunidades mediante un formulario de diagnóstico gratuito.

## Publicación

El repositorio está conectado a GitHub:

- Remoto: `https://github.com/jmgalarza75-tech/pyme360-growth.git`
- Rama principal: `main`

La web pública se despliega mediante Hostinger.

## Arquitectura de Alojamientos Rurales (`/alojamientos-rurales/`)
- **Hero Panorámico Full-Width**: Imagen panorámica rural de fondo a pantalla completa (`assets/indice/hero-rural-panoramica.jpg`) con gradiente oscuro atmosférico de alto contraste.
- **Entrada con animación Zoom In (`@keyframes heroZoomIn`)**: Titular editorial centrado (`analizamos qué falla y VENDEMOS MEJOR TU ALOJAMIENTO`), píldora kicker (`Tu acompañamiento comercial y digital`), texto explicativo y CTAs primarios.
- **Vitrina Interactiva "MODO ZOOM IN ZOOM OUT"**: 3 tarjetas de auditoría en horizontal (❌ Fuga en reservas directas, ⚠️ Propuesta de valor, ✅ Plan de mejora + Acompañamiento) con foco zoom interactivo rotativo (pausa al hover/click) y reescalado dinámico.
- **Cierre con Autoevaluación Gratuita**: Caja de llamada a la acción inferior con botón directo hacia la autoevaluación interactiva de las 7 P comerciales (`#diagnostico`).
- **Tests de Integridad**: `tests/rural-mobile-layout.test.cjs`, `tests/indice-form.test.cjs`, `tests/indice-backend.test.cjs`, `tests/form-submit.test.cjs` y `tests/asset-cache.test.cjs`.

## Registro de Sesiones

### Sesión: 2026-10-22 — Paridad de Diseño en Tarjetas de Flujo (Dock Cards) e Informe Completo de Autoevaluación 7P por Correo
- **Paridad Visual de Tarjetas (.quiz-flow-strip)**: Se unificó el diseño de las 4 tarjetas de flujo de autoevaluación (01 Completas, 02 Obtienes, 03 Detectamos, 04 Decides) con las 4 tarjetas superiores de `#como-funciona` (`.dock-card`), adoptando cabeceras degradadas (esmeralda, azul petróleo, terracota y oro/marrón), borde inferior de acento de 3px, badge frosted glass, títulos en mayúsculas blancas, subtítulos claros y cuerpo con viñetas coloreadas acordes a cada fase.
- **Corrección de Especificidad CSS**: Se neutralizó la sobreescritura de `.diagnosis-rural .diagnosis-copy p:not(.eyebrow)` que oscurecía los subtítulos dentro de las cabeceras de las tarjetas.
- **Informe Completo de Autoevaluación 7P**: Se reprogramó la compilación del diagnóstico en `assets/indice-pyme360.js` para enviar la nota global (/10), desglose de las 7 P, las 2 prioridades críticas de mejora con recomendaciones de acción, fortaleza principal y las 14 respuestas detalladas (1 al 10).
- **Entrega de Correos Infalible**: Integración en `procesar-lead.php` de la API de Resend para entrega ejecutiva en bandeja de entrada de `jmgalarza75@gmail.com` con enlace directo de WhatsApp al lead, manteniendo `mail()` secundario con flag `-f` a `info@pyme360.online`.
- **Despliegue y Pruebas**: Suite completa de 8 tests pasada (`rural-mobile-layout`, `indice-form`, `asset-cache`, `form-submit`, `indice-backend`, `legal-visual`, `layout`, `logo`), envío de prueba en vivo verificado con éxito y cambios desplegados a producción en Hostinger vía `origin/main`.

### Sesión: 2026-10-22 (Parte 2) — Línea Editorial de Alto Prestigio y Ensayo 01
- **Estrategia y Posicionamiento de Autoridad**: Se definió el manifiesto editorial de Pyme360 Growth basado en el principio de consultoría ejecutiva: destapar la patología y las fugas de rentabilidad del negocio con rigor y números reales, evitando tutoriales genéricos "hazlo tú mismo" que atraen a perfiles sin presupuesto y devalúan la marca.
- **Creación de Carpeta `articulos/`**: Documento [`articulos/README.md`](./articulos/README.md) con el manifiesto editorial y la hoja de ruta de los 4 ensayos de dirección comercial.
- **Ensayo 01 Completado**: [`articulos/la-falacia-del-85-por-ciento-ocupacion.md`](./articulos/la-falacia-del-85-por-ciento-ocupacion.md) (*La falacia del 85% de ocupación: por qué colgar el cartel de lleno no se nota en la cuenta bancaria*), analizando el desfase entre facturación bruta y margen neto, cancelaciones de OTAs a 48h, rotación perversa y la ausencia de soberanía comercial, con cierre hacia la autoevaluación 7P.

### Sesión: 2026-10-24 — Integración Global de Google Analytics 4 (GA4) y Saneamiento de Credenciales
- **Tareas Realizadas**:
  - Integración del snippet oficial de Google tag (gtag.js) con ID `G-TV5EY510HZ` en el `<head>` de todas las 9 páginas web públicas del proyecto, manteniendo sincronía 100% entre raíz y `public/` (18 archivos modificados: `index.html`, `alojamientos-rurales/index.html`, `indice-pyme360/index.html`, `precios.html`, `propuesta.html`, `lead_magnet.html`, `aviso-legal.html`, `privacidad.html` y `cookies.html`).
  - Purga y sustitución del identificador provisional `G-PYME360G` en `propuesta.html` y `lead_magnet.html`.
- **Incidencia / Error Detectado**:
  - Al ejecutar `git push origin main`, GitHub Push Protection bloqueó la subida debido a una clave heredada de Resend (`re_...`) presente en `public/propuesta.html` (desfase histórico donde `propuesta.html` de raíz ya usaba el endpoint seguro `/api/inbound-lead.php`, pero `public/` conservaba la versión antigua cliente).
- **Causa y Solución Implementada**:
  - Causa: Falta de paridad entre la raíz y la carpeta `public/` en versiones previas de `propuesta.html`.
  - Solución: Se sobrescribió `public/propuesta.html` con la versión limpia y refactorizada de `propuesta.html`. Se enmendó el commit (`git commit --amend`) para erradicar el secreto del árbol de commits y se completó el push a `origin/main` con éxito total.
- **Eventos de Conversión GA4 sin PII**: Se implementó en `assets/pyme360-public.js` (y `public/`) la medición de conversiones de leads (`generate_lead`) preservando la privacidad al no enviar datos personales (PII), y se actualizó la suite de tests (`analytics-events.test.cjs`), logrando que el 100% de los 20 tests del proyecto pasen en verde.
- **Verificación**: Batería completa de 20 tests superada al 100% (`analytics-events`, `indice-form`, `indice-backend`, `form-submit`, `asset-cache`, `rural-mobile-layout`, `legal-visual`, `layout`, `logo`, `webhook-resend-contract`, `testimonials`, `premium-form`, `pricing-page`, `problem-gallery`, `seo-performance`, etc.).

### Sesión: 2026-10-31 — Auditoría SEO Integral, Optimización de Rendimiento, Señales Locales y Cumplimiento RGPD
- **Diagnóstico Inicial de Auditoría SEO**: Puntuación de partida 56/100 (página de alojamientos rurales huérfana de 8,9 MB, sin mención a Tenerife en texto visible, logo pesado de 523 KB, falta de 301 www, enlaces a /index.html y GA4 ejecutándose sin banner de consentimiento).
- **Bloque 1 · Rendimiento, Enlazado Interno y SEO Técnico**:
  - Enlazada la landing sectorial `/alojamientos-rurales/` desde navegación principal, tarjeta `#sectores` y footer de Home y Precios.
  - Normalización de enlaces internos sustituyendo `/index.html` por rutas canónicas limpias (`/`).
  - Reducción drástica de activos gráficos: Logo `lgo.png` (522,8 KB → 9,9 KB, -98,1%), Favicon (136 KB → 2,0 KB, -98,5%) y 14 imágenes en `assets/indice/` optimizadas a WebP/JPEG progresivo (de ~1 MB c/u a ~90-170 KB, reduciendo el peso de la landing rural de 13,7 MB a 1,7 MB).
  - Añadidos atributos `width` y `height` en imágenes del carrusel de alojamientos rurales para asegurar CLS 0.
  - Configurado `.htaccess` con redirección 301 de `www` a sin `www`, `AddDefaultCharset UTF-8` y cabeceras de seguridad (`HSTS`, `X-Content-Type-Options`, `Referrer-Policy`).
  - Páginas legales (`aviso-legal`, `privacidad`, `cookies`) marcadas con `noindex, follow` y retiradas de `sitemap.xml`, incorporando etiquetas `<lastmod>` para URLs indexables.
  - Corrección de solapamiento en cabecera móvil de `/alojamientos-rurales/` (píldora metodológica y texto de hero).
- **Bloque 2 · On-Page, Señales Locales (Tenerife / Canarias) y Búsqueda con IA**:
  - Titles optimizados: Home a 50 caracteres (`Marketing digital para pymes en Tenerife | Pyme360`), Alojamientos Rurales a 58 caracteres (`Marketing para casas rurales y reservas directas | Pyme360`), Precios con H1 orientado a intención de búsqueda.
  - Incorporadas menciones visibles a Tenerife y Canarias en el hero y propuesta de valor.
  - Corrección ortográfica exhaustiva de tildes en `precios.html`, `index.html` y textos legales.
  - Datos estructurados (Schema.org JSON-LD): unificación de entidad `@id: "https://pyme360.online/#empresa"` con `Organization` + `ProfessionalService`, `areaServed` Tenerife/Canarias, teléfono, email, `OfferCatalog` en precios y `Service` conectado a `provider` en alojamientos rurales.
  - Creado `/llms.txt` estructurado para indexación en motores de IA (ChatGPT, Perplexity, Claude, AI Overviews).
- **Bloque 3 · Cumplimiento de Cookies RGPD/AEPD y Señales de Confianza**:
  - Creado banner de consentimiento de cookies no invasivo conforme a normativa AEPD/RGPD.
  - Carga diferida de Google Analytics 4 (`G-TV5EY510HZ`): el script de terceros (178 KB) solo se descarga e inicializa si el usuario consiente expresamente ("Aceptar todas").
  - Incorporadas secciones "Quién está detrás" (atribución a Roam Retreats con CIF y sede en Tenerife) y FAQ estructurado en la Home con respuestas directas citables por motores de IA.
- **Verificación**: 100% de la batería de 20 tests superada en verde en cada fase. Paridad rigurosa entre raíz y `/public/`.

