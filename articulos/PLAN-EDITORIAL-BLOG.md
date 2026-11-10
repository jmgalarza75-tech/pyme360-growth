# Plan editorial del blog de Pyme360 — 12 artículos

**Fuente única de estado del blog.** José avisa a Claude cuando una entrada cambia de estado y Claude actualiza este archivo. Antigravity lo lee para saber qué maquetar.

**Decisión de producción:** los 12 artículos se crean ya, no mes a mes. La columna «Bloque» solo indica el orden de prioridad.
**Contenido:** se redacta en **NotebookLM**, en el cuaderno https://notebooklm.google.com/notebook/02b925f2-2553-40f0-a1b3-9e41666d0f92. Antigravity toma de ahí el texto de cada artículo (ver `checklist.md` §15.2).
**Firma (decisión de José, 2026-11-10):** los artículos del blog los firma **Theo Rubio** (ficha de autor y schema `Person`). Los estudios propios E1–E4 los firma **Equipo Pyme360** (schema `author` = organización `#empresa`). José no firma ningún artículo.
**Última actualización:** 2026-11-09.

---

## Estados

`Pendiente` → `Redactado en NotebookLM` → `Revisado (datos y fuentes OK)` → `Maquetado en local` → `Publicado`

Ningún artículo pasa a «Maquetado en local» sin estar «Revisado».

---

## Las 12 entradas

| # | Bloque | Línea | Título | Slug (`/blog/<slug>/`) | Palabra clave (hipótesis) | Intención | Enlace interno | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | 1 | Pymes | Por qué tu web en Tenerife tiene visitas pero no genera contactos | `web-visitas-sin-contactos-tenerife` | web no genera contactos Tenerife | Comercial / local | `/#diagnostico` | Maquetado en local |
| R01 | 1 | Rural | La falacia del 85% de ocupación: el coste real de tu casa rural | `la-falacia-del-85-por-ciento-ocupacion` | rentabilidad casa rural | Informativa | `/alojamientos-rurales/` + Home4Escape | Maquetado en local |
| P02 | 2 | Pymes | SEO local en Canarias: cómo dominar Google Maps frente a tu competencia | `seo-local-canarias-google-maps` | seo local canarias | Local / comercial | `/#diagnostico` | Maquetado en local |
| R02 | 2 | Rural | Tus huéspedes no son tuyos: el riesgo de depender solo de Booking | `tus-huespedes-no-son-tuyos` | venta directa hotel rural | Informativa | `/alojamientos-rurales/` | Maquetado en local |
| P03 | 3 | Pymes | Errores en Google Ads que están quemando el presupuesto de tu pyme | `errores-google-ads-pymes` | google ads pymes tenerife | Informativa / comercial | `/precios.html` | Maquetado en local |
| R03 | 3 | Rural | La fricción invisible: por qué abandonan reservas en tu web móvil | `friccion-invisible-reservas-web-movil` | motor de reservas casa rural | Comercial | `/alojamientos-rurales/` | Maquetado en local |
| P04 | 4 | Pymes | Marketing GEO: cómo aparecer en las respuestas de IA (ChatGPT, Gemini) | `geo-aparecer-en-respuestas-ia` | posicionamiento en inteligencia artificial | Informativa | `/#diagnostico` | Maquetado en local |
| R04 | 4 | Rural | La trampa de bajar precios en temporada baja en tu alojamiento rural | `trampa-bajar-precios-temporada-baja` | temporada baja casa rural | Informativa / comercial | `/alojamientos-rurales/` + Home4Escape | Maquetado en local |
| P05 | 5 | Pymes | El valor de las reseñas en Google para negocios locales en Tenerife | `resenas-google-negocios-tenerife` | mejorar reseñas google | Informativa | `/#diagnostico` | Maquetado en local |
| R05 | 5 | Rural | Radiografía de rentabilidad: control de costes para hoteles rurales e independientes | `control-costes-hotel-rural` | control de costes hotel rural | Informativa | `/alojamientos-rurales/` + Home4Escape | Maquetado en local |
| P06 | 6 | Pymes | Fidelización local: estrategias rentables más allá de captar clientes | `fidelizacion-clientes-pymes-canarias` | fidelización clientes pymes | Informativa | `/#diagnostico` | Pendiente |
| P07 | 6 | Pymes | Cuánto debería invertir una pyme canaria en marketing en 2027 | `presupuesto-marketing-pyme-canaria-2027` | presupuesto marketing digital pymes | Comercial | `/precios.html` | Pendiente |

**Cambios respecto a la propuesta original:**
- P01: la palabra clave propuesta («agencia marketing digital tenerife») no corresponde al tema del artículo. Se usa una del propio tema y «agencia marketing digital Tenerife» se reserva para la Home.
- R04: «revenue management rural» se cambia por «temporada baja casa rural», porque el revenue management no es servicio de Pyme360 (decisión 1).
- R05: «pequeños hoteles» se cambia por «hoteles rurales e independientes», según la regla de no usar «pequeños alojamientos».

---

## Segunda ola (después de las 12 entradas)

Comparativas, problemas urgentes y nichos. Mismas reglas y estados que las 12 primeras. Los slugs se fijan cuando cada artículo entre en producción. Empieza por O2-10, la radiografía de la pyme canaria: es el artículo de referencia, pero solo se redacta cuando sus datos estén verificados en fuente oficial.

| # | Tipo de intención | Línea | Título | Palabra clave (hipótesis) | Enlace interno | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| O2-10 | Referencia / autoridad | Pymes | Radiografía digital de la pyme en Canarias: dónde se pierde el presupuesto | digitalización pymes Canarias | `/#diagnostico` | Pendiente (requiere datos ISTAC / INE / ONTSI verificados) |
| O2-11 | Informativa | Pymes | Email marketing para negocios de proximidad: el canal rentable que nadie cuida | email marketing pymes | `/#diagnostico` | Pendiente |
| O2-12 | Informativa / comercial | Pymes | Plan de marketing semestral para directivos canarios: plantilla de prioridades | plan de marketing pyme | `/precios.html` | Pendiente |
| O2-13 | Investigación comercial | Pymes | ¿Cuánto cuesta una página web profesional para una pyme en Canarias? | precio página web pyme Canarias | Página de servicio Web | Pendiente |
| O2-14 | Investigación comercial | Pymes | Agencia de marketing digital o freelance: cuándo elegir cada uno | agencia o freelance marketing | `/precios.html` | Pendiente |
| O2-15 | Investigación comercial | Pymes | Google Ads o Meta Ads: dónde poner el primer euro de tu negocio local | Google Ads o Meta Ads | Página de servicio Publicidad | Pendiente |
| O2-16 | Investigación comercial | Pymes | WordPress o constructores cerrados (Wix, Shopify, Squarespace): cuál conviene a tu pyme | WordPress o Wix pyme | Página de servicio Web | Pendiente |
| O2-17 | Problema urgente | Pymes | Ficha de Google suspendida: motivos habituales y cómo pedir el restablecimiento | ficha Google suspendida | Página de servicio SEO local | Pendiente |
| O2-18 | Problema urgente | Pymes | Por qué se han desplomado las visitas de tu web: guía de diagnóstico rápido | bajada de visitas web | `/#diagnostico` | Pendiente |
| O2-19 | Problema urgente | Pymes | Cómo responder a una reseña negativa injusta sin dañar tu reputación | responder reseña negativa | Página de servicio SEO local | Pendiente |
| O2-20 | Atracción temprana | Rural | Cómo abrir una casa rural en Canarias y tener visibilidad digital desde el primer día | abrir casa rural Canarias | `/alojamientos-rurales/` | Pendiente |
| O2-21 | Investigación comercial | Rural | Booking y Airbnb en turismo rural: cómo gestionar los canales sin perder margen | Booking o Airbnb casa rural | `/alojamientos-rurales/` (+ Home4Escape si trata revenue) | Pendiente |

**Sectores y localidades** (restaurantes, clínicas privadas, talleres y servicios del hogar, inmobiliarias; Santa Cruz, La Laguna, Puerto de la Cruz, sur de Tenerife, Las Palmas): solo cuando haya proyectos y datos reales de Pyme360 que mostrar.

**Notas:**
- O2-19 se solapa en parte con P05 (reseñas). P05 trata la estrategia de reseñas; O2-19 solo la respuesta a una reseña negativa. Enlazar entre ellos.
- O2-17 y O2-18 tocan servicios técnicos: no prometer plazos de restablecimiento ni recuperación de tráfico.

---

## Estudios propios (autoridad)

Contenido con datos recogidos por Pyme360. Cada estudio tiene su archivo en `articulos/estudios/`; los datos por negocio están en `articulos/estudios/interno/` (excluido de git, **no publicar**). Resultados siempre agregados, sin nombrar negocios.

| # | Estudio | Archivo | Estado | Qué falta |
| --- | --- | --- | --- | --- |
| E4 | ¿A qué negocios locales recomiendan ChatGPT, Gemini y Perplexity? | `estudios/E4-recomendaciones-ia-negocios-locales.md` | **Publicable** como revisión de estudios + protocolo | 30 consultas por API (checklist §15.4 D3) para la versión definitiva |
| E1 | Analizamos 90 webs de pymes de Tenerife | `estudios/E1-webs-pymes-tenerife.md` | **Publicable** (90 webs medidas el 9/11/2026) | Opcional: velocidad móvil (checklist §15.4 D1) |
| E3 | ¿Cuántos alojamientos rurales permiten reservar directamente? | `estudios/E3-reserva-directa-alojamientos-rurales.md` | Piloto (5 alojamientos de Tenerife) | 95 alojamientos de toda España, precio web vs OTA, datos INE de Canarias |
| E2 | Fichas de Google de restaurantes de Santa Cruz y La Laguna | `estudios/E2-fichas-google-restaurantes.md` | Protocolo, 0 fichas | Recogida por API de Google Places (checklist §15.4 D2) |

Regla: no publicar titulares con «100» ni porcentajes hasta completar cada muestra.

---

## Páginas de servicio (fuera del blog)

Las búsquedas de contratación («agencia de marketing digital Tenerife», «diseño web Tenerife», «SEO Tenerife») no se ganan con artículos: Google muestra páginas de servicio y fichas de Maps. Son la prioridad comercial del sitio y los artículos les pasan autoridad con enlaces internos. Se tratarán en un brief propio para Antigravity.

| Página | Búsquedas objetivo (hipótesis) | Enfoque |
| --- | --- | --- |
| Diseño web orientado a conversión | diseño web Tenerife, página web para pymes Tenerife | Velocidad móvil, recorrido de contacto y webs que generan consultas |
| SEO local y Google Maps | SEO Tenerife, SEO local Canarias, posicionamiento Google Maps | Ficha de Google, categorías, reseñas y presencia en el Map Pack |
| Publicidad digital (Google Ads y Meta Ads) | agencia Google Ads Tenerife, publicidad en redes Tenerife | Control del coste por contacto; la inversión se paga aparte. Sin prometer ROAS |
| Redes sociales y contenidos | gestión de redes sociales Tenerife | Contenido con objetivo comercial, no métricas de vanidad |
| Identidad y mensaje de marca | branding Tenerife, identidad de marca pymes | Propuesta de valor y diferenciación frente a la competencia local |

Mientras no existan estas páginas, los artículos enlazan a `/precios.html` o `/#diagnostico`.

---

## Decisiones pendientes de José antes de redactar

1. **Revenue management — resuelto (2026-11-09).** El revenue management se ofrece a través de Home4Escape (https://www.home4escape.com/), no como servicio de Pyme360. En consecuencia:
   - **Solo los artículos que tratan revenue management enlazan a Home4Escape:** R01, R04 y R05. El resto no lo menciona.
   - En esos tres, un único enlace natural en el pasaje que habla de precios, rentabilidad o revenue. Ejemplo de redacción: «Si quieres trabajar la estrategia de precios y rentabilidad de tu alojamiento, lo hacemos a través de [Home4Escape](https://www.home4escape.com/)». Sin presentar el revenue como servicio de Pyme360.
   - El CTA principal de los artículos rurales sigue siendo la autoevaluación de `/alojamientos-rurales/#diagnostico`. El enlace a Home4Escape es secundario.
   - Fuera de estos artículos (y de la sección «Casos y proyectos» de la Home, donde aparece como proyecto propio) sigue vigente la regla de no mencionar Home4Escape (H4E) en el texto público de Pyme360.
2. **Primera ola — resuelto (2026-11-09).** Mandan las 12 entradas de esta tabla. De la versión de NotebookLM se incorporan a la segunda ola la radiografía de la pyme canaria (O2-10), email marketing (O2-11) y el plan semestral (O2-12). NotebookLM debe alinear su lista con este plan.
3. **Autor — resuelto (2026-11-10).** Theo Rubio firma los artículos; los estudios, Equipo Pyme360.

---

## Datos citados: estado de verificación

Regla: **cero cifras inventadas.** Una cifra solo se publica si su fuente primaria se ha abierto y dice exactamente eso. Los agregadores de estadísticas (blogs de agencias, listas de «40 datos») no valen como fuente: hay que llegar al estudio original o retirar la cifra.

| Artículo | Dato propuesto | Fuente propuesta | Estado |
| --- | --- | --- | --- |
| P01 | El 97% de los consumidores investiga la presencia online antes de comprar | Web Tonic / Digital Reach Benchmarks (agregadores) | Buscar estudio original o retirar |
| R01 | Coste medio operativo por pernoctación rural en España | INE / Hosteltur | Pendiente de fuente |
| P02 | El 46% de las búsquedas en Google tiene intención local | Thunderbit (agregador) | Cifra muy citada sin estudio público de Google: retirar salvo fuente primaria |
| R02 | Cuota de OTAs frente a venta directa en el sector rural español | Mirai / SiteMinder | Pendiente de fuente |
| P03 | ~80% del presupuesto publicitario de la pyme va a Google y Meta | Digitalvar 2026 | Abrir el informe y comprobar metodología |
| P04 | ChatGPT recomendó el 1,2% de ~350.000 ubicaciones frente al 35,9% del Map Pack | SOCi Local Visibility Index 2026 | Abrir el informe de SOCi y comprobar cifras |
| R03 | El primer resultado orgánico capta el 27,6% de los clics | Backlinko | Abrir el estudio original de Backlinko y comprobar año y cifra |
| P05 | El 47% no contrataría empresas con menos de 20 reseñas | Digital Reach / Web Tonic (agregadores) | Buscar estudio original o retirar |
| R04 | Incremento del RevPAR manteniendo ADR y mejorando el paquete | STR / Cornell | Pendiente de fuente (usar como explicación, no como resultado prometido) |
| P06 | Aumentar la retención un 5% eleva beneficios un 25–95% | O8 Agency (agregador) | Atribuido a Bain & Company / Reichheld: citar el original o retirar |
| P07 | Las pymes consolidadas invierten el 10–15% de ingresos en marketing (40% pago / 35% propio) | Sender (agregador) | Buscar estudio original o retirar |
| R05 | Impacto de costes laborales y energéticos en el GOPPAR rural | CEHAT | Pendiente de fuente (usar como explicación, no como resultado prometido) |

---

## Frases de la propuesta que no deben llegar al texto final

Chocan con la regla de no prometer resultados del brief de precios y alojamientos:

- P03: «multiplica el ROAS de forma predecible».
- R03: «reducir el proceso de reserva a tres clics… dispara las conversiones directas».
- P06: «eleva los beneficios netos entre un 25% y un 95%» (salvo cita exacta y atribuida).
- En general: ROI, ROAS o porcentajes de mejora presentados como resultado esperable de trabajar con Pyme360.

---

## Reglas comunes a todos los artículos

1. Artículos firmados por Theo Rubio con ficha de autor; estudios firmados por «Equipo Pyme360». Nunca «Pyme360 Growth».
2. Primer párrafo = respuesta directa (BLUF) en 2–3 frases.
3. H2 en forma de pregunta y bloque final de 3 preguntas frecuentes.
4. Sin cifras sin fuente primaria (tabla de arriba).
5. 1–2 enlaces internos a la página indicada y CTA final al diagnóstico.
6. No mencionar H4E (Home4Escape), FARO ni IA como herramienta interna de Pyme360. Excepción: R01, R04 y R05 enlazan a Home4Escape para el revenue management (decisión 1). Hablar de buscadores con IA como tema sí está permitido (P04).
7. Extensión orientativa: 900–1.500 palabras.
8. No usar «pequeños alojamientos» ni «alojamientos pequeños».

---

## Distribución de cada artículo

1. **Semana 1:** publicación en el blog y solicitud de indexación en Search Console. Newsletter en texto plano: dolor de cliente, resumen de los H2 y CTA al diagnóstico. Los artículos rurales van también a AlojaMente.
2. **Semana 2:** tres posts de LinkedIn desde el perfil de José, uno por cada H2 más comercial.
3. **Semana 3:** guion de vídeo corto de unos 45 segundos (gancho con la pregunta del H2 principal, dato, explicación y CTA).

## Métricas (Search Console y GA4)

1. Impresiones y clics en búsquedas locales y de marca: «agencia de marketing Tenerife», «SEO local Canarias», etc.
2. Interacción por artículo: tiempo de lectura y scroll.
3. Usuarios que pasan del blog a `/#diagnostico` o `/precios.html` y envían el formulario.
4. Visitas referidas desde `chatgpt.com`, `perplexity.ai` y similares.

## Riesgo operativo

Si la línea de pymes genera un pico de diagnósticos, confirmar que hay capacidad para responder y presupuestar sin alargar los plazos.

---

## Registro de cambios

- 2026-11-10: firma decidida por José: Theo Rubio en los artículos, Equipo Pyme360 en los estudios E1–E4.
- 2026-11-09: E1 completado con 90 webs medidas; E2 y E4 pasan a recogida por API (checklist §15.4).
- 2026-11-09: añadidos los 4 estudios propios (E1–E4) con su archivo en `articulos/estudios/`; E4 publicable, E1 y E3 en piloto, E2 en protocolo.
- 2026-11-09: decidido mantener las 12 entradas de la primera ola; añadidos a la segunda ola O2-10 (radiografía pyme canaria), O2-11 (email marketing) y O2-12 (plan semestral).
- 2026-11-09: añadidas la segunda ola (9 artículos más sectores y localidades) y las 5 páginas de servicio, a partir del plan consolidado de NotebookLM. 
- 2026-11-09: los artículos que tratan revenue management (R01, R04, R05) enlazan a Home4Escape; el resto no lo menciona.
- 2026-11-09: añadido el enlace al cuaderno de NotebookLM; resuelta la decisión de revenue management (se ofrece vía Home4Escape, fuera del texto de Pyme360).
- 2026-11-09: sustituida la primera versión del plan por el programa de 12 entradas; los 12 artículos se crean de inmediato y el contenido se redacta en NotebookLM.
