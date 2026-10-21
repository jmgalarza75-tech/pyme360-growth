# Pyme360 Growth — Contexto de proyecto para cualquier modelo o agente

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

