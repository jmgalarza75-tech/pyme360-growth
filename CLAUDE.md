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
### Sesión: 2026-11-01 — Corrección de Contraste, Integración Dark Mode en FAQ y Blindaje contra Caché de Navegador
- **Incidencia Visual Reportada**:
  - En la Home (index.html), el título <h2> de la nueva sección de FAQ ('Dudas habituales sobre el sistema de crecimiento Pyme360') era completamente invisible, apareciendo como un espacio vacío gigante sobre fondo crema claro (#f8f3e8), con el acordeón desplazado hacia abajo.
- **Causa Raíz Identificada**:
  - La regla .faq en pyme360-public.css tenía asignado un gradiente de fondo crema claro heredado de la landing rural (lojamientos-rurales/), mientras que en la Home los encabezados h2 heredan color blanco/marfil (ar(--cream) / #ffffff) por defecto del tema oscuro. Por tanto, el texto h2 quedaba blanco sobre fondo crema.
  - Al corregir el CSS inicialmente, los navegadores y servidores con políticas agresivas de caché (max-age=31536000 en .htaccess) continuaban sirviendo la versión CSS en disco cacheada con ?v=20260713-3.
- **Solución Implementada y Blindaje**:
  - **Aislamiento temático**: El gradiente claro se acotó estrictamente a .indice-page .faq.
  - **Integración Dark Mode**: Se rediseñó #faq y .trust-about para integrarse con la paleta oscura de la Home (#07120f / #050a09), con títulos blancos nítidos, textos de apoyo en #c4d4cc, acordeones con fondo translúcido esmeralda (
gba(14, 25, 21, 0.9)), bordes sutiles en #2fbf71 y badges de confianza física en Tenerife / Roam Retreats.
  - **Blindaje anti-caché**: Se añadieron estilos prioritarios directamente en las etiquetas del markup (index.html y public/index.html) para garantizar contraste visible 100% incluso ante cachés de navegador viejas o proxies intermedios, sin alterar la versión contractual ?v=20260713-3 requerida por legal-visual.test.cjs, premium-form.test.cjs y pricing-page.test.cjs.
- **Despliegue y Pruebas**:
  - 20 de 20 tests pasados al 100% en verde.
  - Commits 9440ea2 y c63049 subidos y verificados en origin/main.
### Sesión: 2026-11-08 — Actualización Estratégica de Precios y Alojamientos Rurales, Reajuste Visual y Flip-Cards 3D
- **Implementación del Brief Estratégico**:
  - **Precios (precios.html y public/precios.html)**: Transición a oferta generalista para pymes locales, eliminación de tarifas fijas no aprobadas y claims exagerados. Modelo honesto de presupuesto según alcance acordado. CTA unificado a «Contactar» (/#diagnostico).
  - **Alojamientos Rurales (/alojamientos-rurales/)**: Reorientación a mini-revisión de reservas directas (3–5 observaciones claras sobre elementos visibles). Eliminación de promesas desmesuradas (temporada baja, dos clics, envío de auditorías automáticas por email). Marco de autoevaluación 7P preservado. Retiradas flechas de los botones hero.
  - **FAQ de Precios en Home (index.html)**: Respuesta transparente sin tarifas inventadas, explicando que la propuesta se personaliza por alcance antes de empezar y que la inversión publicitaria se aprueba y paga aparte.
- **Perfeccionamiento Visual, Jerarquía y Flip-Cards 3D**:
  - **Jerarquía y Escala Tipográfica**: Ajuste proporcional de titulares H1 y H2 en Precios y Alojamientos Rurales, eliminando bloques macizos en mayúsculas forzadas y reduciendo titulares CTA desproporcionados a escalas armónicas.
  - **Centrado a 2/3 en Precios**: El contenedor principal y las tarjetas ocupan el 66.66% del ancho de pantalla en escritorio con centrado perfecto y balance simétrico.
  - **Tarjetas Giratorias 3D (lip-card)**: Integradas en la sección «Qué ocurre cuando solicitas una valoración» de Precios con efecto 3D hover/tap idéntico al de alojamientos rurales.
  - **Blindaje de Caché**: Actualización de hash de versión CSS en HTML para evitar bloqueos por caché de navegador.
- **Despliegue y Pruebas**:
  - 20 de 20 suites de tests superadas al 100% en verde.
  - Auditoría de términos prohibidos superada sin incidencias.
  - Paridad estricta 100% byte a byte entre raíz y /public/.

### Sesión: 2026-11-10 — Plan editorial, estudios propios y tarifas de diseño web (Claude)
- **Tareas para Antigravity:** todas en `checklist.md` §15 (resumen en §15.0). Nuevas: §15.4 (recogida por API para los estudios E1, E2 y E4), §15.5 (tarifas de diseño web) y §15.6 (resto de tarifas, landing de SEO local y condiciones).
- **Tarifas de diseño web (decisión de José):** se publican tres planes «desde» en `/precios.html`: Esencial 890 €, Profesional 1.500 € («La más elegida») y Premium 2.500 €, todos + IGIC. Extras: logotipo desde 300 € y desarrollo adicional a 50 €/h. Mantenimiento opcional: 40 €/mes (básico) y 90 €/mes (plus). Esto sustituye la regla de §15.1 de no publicar precios.
- **Resto de tarifas (§15.6):** SEO local, puesta a punto desde 350 € (pago único) con landing nueva `/seo-local/`; publicidad digital, configuración desde 350 € y gestión desde 250 €/mes (inversión en anuncios aparte); redes, desde 300 €/mes (8 publicaciones). Dominio a nombre del cliente; hosting de Pyme360, primer año incluido y después dentro del mantenimiento. Condiciones de contratación en la plantilla de presupuesto (https://claude.ai/artifact/QppQ8RjorxwxiDdQBTD7Jk), no en la web.
- **Blog:** firma de Theo Rubio en los artículos; los estudios propios E1–E4 (`articulos/estudios/`) los firma «Equipo Pyme360». Plan y estado en `articulos/PLAN-EDITORIAL-BLOG.md`. Home4Escape solo en artículos de revenue (R01, R04, R05) y en «Casos y proyectos».
- **Estudio E1:** 90 webs de pymes de Tenerife medidas el 9/11/2026; datos internos en `articulos/estudios/interno/` (excluido de git).
- **Contexto de marketing para agentes:** `.agents/product-marketing.md` (excluido de git). Las skills de `C:\Antigravity\skills marketing` lo leen antes de trabajar.
- **Clientes:** permiso de Equalis Consultoría Canaria y Aceviños Jardinería confirmado por José. El precio de Equalis fue de oferta y no se publica.

### Sesión: 2026-11-10 (Parte 2) — Despliegue de Estudios E1/E4, Optimización de Carga Móvil y Calibración Visual
- **Despliegue de Estudios de Investigación en el Blog**:
  - Maquetados y publicados en producción los dos primeros estudios: Estudio E1 (`/blog/webs-pymes-tenerife/`) con datos reales de 90 webs de pymes de Tenerife, PageSpeed móvil, brechas de contacto y casos de malware; y Estudio E4 (`/blog/recomendaciones-ia-negocios-locales/`) con hallazgos de SOCi y 90 consultas por API en OpenAI, Gemini y Perplexity.
  - Firma institucional «Equipo Pyme360» con Schema Organization, metadatos canónicos, FAQ estructurado y tarjetas 3D en `/blog/`.
- **Optimización Integral de Velocidad en Móvil**:
  - **Cuello de botella resuelto**: En `/blog/`, las 12 tarjetas descargaban simultáneamente más de 2,2 MB de imágenes al usar fondos CSS (`background-image`), incapaces de usar carga diferida en navegadores móviles.
  - **Lazy-loading nativo**: Reemplazado por etiquetas `<img>` con clase `.blog-flip-bg`, `loading="lazy"`, `decoding="async"` y `fetchpriority="high"` en la primera tarjeta visible.
  - **Compresión WebP**: Conversión y redimensión optimizada de las 12 imágenes del blog a formato `.webp`, reduciendo el peso medio un -68% y la descarga de imágenes en el primer pantallazo móvil de 2.150 KB a 28 KB (-98,7%).
  - **Caché estática en `.htaccess` y `public/.htaccess`**: Configuración de directivas `mod_expires` y `Cache-Control: public, max-age=31536000, immutable` para imágenes, CSS, JS y fuentes, con `must-revalidate` para HTML.
- **Calibración Visual del Titular de la Home**:
  - Reducción del H1 del héroe de la Home (`.hero-copy h1`) de `clamp(44px, 7vw, 92px)` a `clamp(32px, 3.6vw, 52px)` con `line-height: 1.08`.
  - El titular pasa de 6 líneas gigantescas que ocultaban los botones de acción a 4 líneas armónicas y legibles, alineadas con la tarjeta del test de diagnóstico en el primer viewport.
- **Verificación y Despliegue**:
  - 24 de 24 tests en verde. Paridad 100% byte a byte entre raíz y `/public/`.
  - Commits `5ecd6a7` y `a80e6c8` subidos y desplegados a producción en Hostinger vía `origin/main`.

### Sesión: 2026-11-11 — Optimización de Rendimiento y Neuro-Diseño Exclusivo para Formato Móvil
- **Auditoría Forense Móvil (Design Loop & Neuro-Design)**:
  - Bucle continuo de WebGL en el Hero Shader (`hero-shader`): `requestAnimationFrame` en GPU móvil consumía batería y provocaba microtirones de scroll.
  - Carga bloqueante de Google Fonts (`Inter` y `Outfit`) demorando el First Contentful Paint (FCP).
  - Mutaciones DOM innecesarias en `updateProblemGallery()` durante el scroll móvil (`<= 620px`).
  - Inputs de formulario inferiores a 16px en iOS Safari provocando auto-zoom indeseado.
- **Soluciones Implementadas (Escritorio 100% Intacto)**:
  - **Suspensión de GPU y rAF en Móvil (`assets/pyme360-public.js`)**: WebGL pausado en móviles (`<= 768px`) dejando el gradiente CSS atmosférico. Integrado `IntersectionObserver` para congelar el renderizado al salir del viewport del Hero en cualquier pantalla.
  - **Desbloqueo de Scroll**: Cancelación de mutaciones DOM en `problem-gallery` para móvil (`<= 620px`) y detención de bucle de animación orbital cuando no está visible (`<= 760px`).
  - **Carga Asíncrona de Fuentes (`index.html`)**: Patrón no bloqueante con `preload`, `media="print" onload="this.media='all'"` y fallback `<noscript>`.
  - **Ergonomía y Neuro-Diseño (`assets/pyme360-public.css`)**: `font-size: 16px` en inputs para frenar auto-zoom de iOS, áreas táctiles mínimas de 48px, y `aspect-ratio` para evitar CLS.
  - **Corrección de Responsividad en Servicios de la Home (`#sistema`)**: Se resolvió la fuga de especificidad CSS en `.system .module-grid`, que forzaba 2 columnas fijas de `minmax(280px, 1fr)` causando desborde horizontal en móvil. Ahora pasa fluidamente a 1 columna vertical en pantallas `<= 768px` con tarjetas legibles, alineadas a la izquierda y con altura adaptativa.
  - **Reducción de Peso de Imágenes y Fluidez en Scroll Móvil**: Redimensionadas las 10 fotos de la galería de problemas de 900px a 420px (`w=420&q=72`), reduciendo el consumo de red en un -75% (de ~1,6 MB a ~320 KB) y la memoria bitmap de GPU de 41,5 MB a 8,2 MB. En móvil (`<= 620px`), se neutralizaron los filtros CSS pesados (`filter: saturate/contrast`), transformaciones continuas y sombras de 110px de desenfoque, eliminando el tartamudeo (*jank*) durante el scroll táctil.
  - **Desactivación de Efectos de Movimiento en Móvil**: Eliminadas las animaciones CSS infinitas (`pricing-orbit`, `score-ring`) y transiciones de tarjetas en pantallas `<= 768px`, garantizando un scroll táctil instantáneo y a 60/120 fps sin sobrecarga de GPU.
- **Verificación**:
  - 24/24 tests superados al 100% en Node nativo.
  - Paridad estricta 100% byte a byte entre raíz y `/public/`.


