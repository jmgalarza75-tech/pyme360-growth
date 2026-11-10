# E1 · Analizamos 90 webs de pymes de Tenerife

**Estado:** datos recogidos (90 webs medidas, 9/11/2026). **Publicable** tras revisión de José y, si se quiere, tras añadir la velocidad móvil con PageSpeed (tarea de Antigravity, checklist §15.4).
**Palabra clave (hipótesis):** webs de pymes en Tenerife · secundarias: diseño web Tenerife pymes, auditoría web negocio local Tenerife.
**Firma:** Equipo Pyme360 (en JSON-LD, `author` = organización `https://pyme360.online/#empresa`, no `Person`).
**Enlace interno / CTA:** `/#diagnostico`
**Datos por web:** `estudios/interno/E1-anexo.md`, `E1-datos.csv` y `E1-muestra.csv` (NO PUBLICAR).

---

## Título

**Analizamos 90 webs de pymes de Tenerife: lo técnico está resuelto, el contacto no**

Alternativa: *Revisamos 90 webs de negocios de Tenerife desde el móvil: esto es lo que encontramos*

## Respuesta directa (primer párrafo)

El 9 de noviembre de 2026 revisamos desde un móvil las webs de 90 pymes de Tenerife. Casi todas cumplen lo técnico: el 100% usa HTTPS y el 97% se adapta al móvil. Pero solo el 41% muestra un teléfono pulsable en la primera pantalla, el 42% ofrece WhatsApp y una de cada cinco no tiene ni teléfono pulsable ni WhatsApp. Además, 3 webs estaban comprometidas con publicidad de casinos.

## Metodología

- **Fechas:** 9 de noviembre de 2026 (dos pasadas el mismo día).
- **Selección:** 98 webs propias de pymes localizadas con búsquedas por sector y municipio, excluyendo directorios, portales, franquicias y cadenas nacionales. 6 sectores: salud y belleza (clínicas dentales, fisioterapia, peluquería y estética), restauración, comercio, servicios profesionales (gestorías y abogados), hogar y motor (instalaciones, reformas, talleres) y turismo y ocio.
- **Muestra final:** 90 webs medidas. 8 no se pudieron comprobar (error de conexión, bloqueo o error del servidor desde nuestro entorno) y **no se cuentan como fallo**.
- **Qué se analizó:** la página de inicio, abierta en un navegador Chromium real con tamaño de móvil (390 px de ancho), esperando a que cargue y desplazándose hasta el final. Cada web se midió dos veces; una característica cuenta como presente si apareció en cualquiera de las dos pasadas.
- **Variables:** HTTPS; adaptación a móvil (etiqueta viewport y ausencia de desplazamiento horizontal); title y meta description; municipio en el title o la description; enlace de teléfono (`tel:`) y si se ve en la primera pantalla del móvil; enlace de WhatsApp; formulario de contacto en la portada; enlace de email; botón de acción (pedir cita, reservar, presupuesto, contactar…); enlace a Google Maps o reseñas; datos estructurados y si declaran un tipo de negocio local; analítica; enlaces a aviso legal, privacidad o cookies; varios idiomas; contenido ajeno inyectado; texto visible sin JavaScript; peso de la página.
- **Spam:** las detecciones automáticas de contenido de casinos se revisaron a mano una a una. Solo se cuentan las confirmadas.
- **Limitaciones:**
  - La selección por buscador favorece a negocios que ya tienen web y posicionan. Las cifras reales del conjunto de pymes de Tenerife serán probablemente peores.
  - Solo se analiza la portada: muchos negocios tienen el formulario en la página de contacto. Por eso el dato es «formulario en la portada».
  - La muestra por sector es pequeña (10–23 webs): las cifras por sector son orientativas.
  - La velocidad de carga no se mide aquí, porque nuestro entorno añade retardo de red. Se añadirá con PageSpeed Insights.

## Resultados (n = 90)

| Variable | Webs | % |
| --- | --- | --- |
| HTTPS | 90 | 100,0% |
| Adaptada al móvil (viewport) | 87 | 96,7% |
| Title | 90 | 100,0% |
| Meta description | 78 | 86,7% |
| Municipio o isla en title/description | 74 | 82,2% |
| Enlace a aviso legal, privacidad o cookies | 81 | 90,0% |
| Botón de acción claro | 72 | 80,0% |
| Teléfono pulsable (`tel:`) en la portada | 67 | 74,4% |
| Teléfono pulsable visible en la primera pantalla del móvil | 37 | 41,1% |
| WhatsApp | 38 | 42,2% |
| Formulario en la portada | 31 | 34,4% |
| Email pulsable | 59 | 65,6% |
| **Ni teléfono pulsable ni WhatsApp** | **17** | **18,9%** |
| Ningún contacto pulsable en la portada (teléfono, WhatsApp, formulario ni email) | 8 | 8,9% |
| Enlace a Google Maps o reseñas | 47 | 52,2% |
| Datos estructurados (cualquiera) | 73 | 81,1% |
| Datos estructurados de negocio local | 32 | 35,6% |
| Analítica instalada | 56 | 62,2% |
| Más de un idioma | 25 | 27,8% |
| **Contenido de casinos inyectado (confirmado)** | **3** | **3,3%** |
| Sin texto visible sin JavaScript | 2 | 2,2% |
| Peso de la página (mediana) | 1,7 MB | — |
| Páginas de más de 3 MB | 22 | 24,4% |

**Por sector (número de webs con cada elemento):**

| Sector | n | Teléfono pulsable | Teléfono en 1ª pantalla | WhatsApp | Formulario en portada | Enlace a Maps/reseñas | Schema de negocio local | Varios idiomas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Salud y belleza | 23 | 16 | 10 | 15 | 8 | 12 | 8 | 2 |
| Restauración | 16 | 10 | 5 | 2 | 2 | 9 | 6 | 7 |
| Comercio | 14 | 9 | 1 | 4 | 5 | 5 | 1 | 2 |
| Servicios profesionales | 16 | 14 | 9 | 5 | 7 | 10 | 10 | 3 |
| Hogar y motor | 11 | 10 | 9 | 6 | 6 | 5 | 5 | 1 |
| Turismo y ocio | 10 | 8 | 3 | 6 | 3 | 6 | 2 | 10 |

**Contexto oficial (no es observación propia):**
- INE, Encuesta TIC en empresas 2025–1T 2026 (22/10/2026): el **36,15%** de las empresas de menos de 10 empleados con internet tiene web; las de 10 o más, el **82,92%**.
- OCTSI (edición anterior): **75%** de las empresas canarias de 10 o más empleados con web, frente al **84%** nacional.

## Hallazgos clave

1. **Lo técnico está resuelto.** HTTPS en el 100%, adaptación al móvil en el 97% y title en el 100%.
2. **El contacto desde el móvil, no.** Tres de cada cuatro webs tienen un teléfono pulsable, pero solo el 41% lo muestra en la primera pantalla. Una de cada cinco (18,9%) no tiene ni teléfono pulsable ni WhatsApp.
3. **WhatsApp es minoritario** (42%), y casi inexistente en restauración (2 de 16).
4. **Google y la web no se hablan:** solo la mitad enlaza a su ficha de Google o a sus reseñas, y solo el 36% marca sus datos como negocio local para los buscadores.
5. **Una isla turística con webs en un solo idioma:** el 28% tiene varios idiomas. Turismo y ocio lo cumple siempre (10 de 10); el resto de sectores, rara vez.
6. **3 webs de cada 90 están comprometidas** y muestran publicidad de casinos que sus dueños probablemente no conocen.
7. **Webs pesadas:** una de cada cuatro supera los 3 MB, mucho para una conexión móvil.

## Qué significa para una pyme

- Pon el teléfono pulsable y, si atiendes por WhatsApp, el enlace directo arriba del todo en la versión móvil.
- Enlaza tu ficha de Google y tus reseñas desde la web.
- Revisa tu web en modo incógnito: si ves contenido que no has puesto, cambia contraseñas y actualiza el gestor de contenidos y los plugins.
- Si recibes clientes extranjeros, ofrece al menos la información básica en inglés.
- Comprime las imágenes: una portada de más de 3 MB es lenta en el móvil.

## Borrador de artículo

**Por el equipo de Pyme360**

### Analizamos 90 webs de pymes de Tenerife: lo técnico está resuelto, el contacto no

El 9 de noviembre de 2026 revisamos desde un móvil las webs de 90 pymes de Tenerife. Casi todas cumplen lo técnico: el 100% usa HTTPS y el 97% se adapta al móvil. Pero solo el 41% muestra un teléfono pulsable en la primera pantalla, el 42% ofrece WhatsApp y una de cada cinco no tiene ni teléfono pulsable ni WhatsApp. Además, 3 webs estaban comprometidas con publicidad de casinos.

#### ¿Por qué hemos analizado webs de pymes de Tenerife?

Porque las estadísticas oficiales cuentan cuántas empresas tienen web, pero no si esa web sirve para algo. Según el INE, solo el 36,15% de las empresas españolas de menos de 10 empleados con internet tiene página web. Queríamos saber cómo son las que sí la tienen: si un cliente que llega desde el móvil puede llamar, escribir o encontrar el local sin esfuerzo.

#### ¿Cómo lo hemos hecho?

Elegimos 98 webs propias de pymes de seis sectores (salud y belleza, restauración, comercio, servicios profesionales, hogar y motor, y turismo y ocio) en distintos municipios de la isla, sin directorios ni cadenas. Pudimos medir 90. Abrimos cada portada en un navegador real con tamaño de móvil y comprobamos más de veinte elementos, del HTTPS al botón de WhatsApp. Cada web se revisó dos veces.

Hay un sesgo que preferimos explicar: las encontramos buscando en internet, así que son negocios que ya tienen web y aparecen en los buscadores. En el conjunto de pymes de la isla, las cifras serán probablemente peores. Y no publicamos nombres: los resultados son siempre agregados.

#### ¿Qué hacen bien?

Lo técnico. Todas las webs usan HTTPS, el 97% se adapta al móvil y todas tienen un título para Google. El 87% tiene descripción, el 82% menciona su municipio o la isla en ellos y el 90% enlaza a sus textos legales. Hace unos años esto no era tan habitual.

#### ¿Dónde pierden clientes?

En el paso más sencillo: contactar. Tres de cada cuatro webs tienen un teléfono que se puede pulsar para llamar, pero solo el 41% lo muestra en la primera pantalla del móvil. El resto obliga a buscarlo. Solo el 42% ofrece WhatsApp, y en restauración apenas 2 de 16 restaurantes. Una de cada cinco webs no tiene ni teléfono pulsable ni WhatsApp, y 8 no tienen en su portada ninguna forma de contacto que se pueda pulsar.

Para un negocio local, muchas visitas llegan desde el móvil y con prisa. Cada paso de más entre «te encontré» y «te llamo» es una oportunidad de que el cliente vuelva a Google y elija a otro.

#### ¿Conectan su web con Google?

A medias. Solo la mitad de las webs enlaza a su ficha de Google o a sus reseñas, aunque las reseñas son una de las cosas que más miran los clientes antes de decidirse. Y aunque el 81% tiene algún tipo de datos estructurados, solo el 36% le dice expresamente a los buscadores que es un negocio local, con su dirección, horario y teléfono.

#### ¿Hablan el idioma de sus clientes?

En una isla con tantos residentes y visitantes extranjeros, solo el 28% de las webs está en más de un idioma. Las empresas de turismo y ocio lo cumplen todas; en el resto de sectores es la excepción: 2 de 23 en salud y belleza, 2 de 14 en comercio, 1 de 11 en hogar y motor.

#### ¿Qué problema nos sorprendió?

Que 3 de las 90 webs estaban comprometidas: mostraban bloques de publicidad de casinos online, en algunos casos en otros idiomas, dentro de la web del negocio. Lo comprobamos una a una. Lo más probable es que sus dueños no lo sepan. Además de dañar la imagen del negocio, este tipo de contenido puede perjudicar cómo lo ven los buscadores.

También encontramos 2 webs que no muestran ningún texto si no se ejecuta JavaScript, algo que puede dificultar que algunas herramientas las lean, y que una de cada cuatro webs pesa más de 3 MB, mucho para una conexión móvil.

#### ¿Qué puede revisar hoy cualquier pyme en su web?

1. Abre tu web en el móvil: el teléfono debe verse arriba y abrir la llamada al pulsarlo.
2. Si atiendes por WhatsApp, añade un enlace directo visible.
3. Enlaza tu ficha de Google y tus reseñas.
4. Ábrela en modo incógnito y busca contenido que no hayas puesto tú. Si lo hay, cambia contraseñas y actualiza todo.
5. Si tienes clientes extranjeros, ofrece la información básica también en inglés.

Nada de esto garantiza más clientes, pero quita obstáculos a quien ya te ha encontrado.

#### Preguntas frecuentes

**¿Qué webs habéis analizado?**
90 webs propias de pymes de Tenerife de seis sectores, elegidas entre negocios que aparecen en los buscadores. No publicamos nombres: los resultados son agregados.

**¿Una web con HTTPS y adaptada al móvil ya está bien?**
Es el mínimo, y casi todas lo cumplen. Lo que más diferencia a una web local es que el cliente pueda llamar, escribir o reservar con un toque desde el móvil.

**¿Cómo sé si mi web tiene contenido ajeno?**
Ábrela en modo incógnito, recorre la portada hasta el final y busca textos o enlaces que no reconozcas. Si aparecen, pide ayuda a quien mantiene tu web.

¿Quieres saber cómo sale tu web en esta misma revisión? Pide el diagnóstico gratuito de Pyme360: https://pyme360.online/#diagnostico

*Equipo Pyme360*

## Fuentes

- Observación directa de 90 webs (9/11/2026). Datos en el anexo interno.
- INE. Encuesta TIC en empresas, 2025–1T 2026 (consultada el 9/11/2026): https://www.ine.es/dyngs/Prensa/ETICCE20251T2026.htm
- INE. Tabla de indicadores (36,15%): https://www.ine.es/uc/IpFWc4nE
- OCTSI. Resultados de Canarias: https://www.octsi.es/actualidad/noticias-del-octsi/resultados-canarias-encuesta-tic-empresas-2025-ine

## Pendiente opcional

- Velocidad móvil con la API de PageSpeed Insights para las 90 URLs (tarea de Antigravity, checklist §15.4). Si se añade, incorporar mediana y % por debajo de 50.
