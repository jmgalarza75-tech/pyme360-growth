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

