# E2 · Así están las fichas de Google de los restaurantes de Santa Cruz de Tenerife y La Laguna

**Estado:** 50 fichas recogidas vía Google Places API (New) el 10/11/2026. Datos internos en `articulos/estudios/interno/E2-fichas.csv`. **No publicar** (pendiente revisión editorial por José/Claude).
**Palabra clave (hipótesis):** ficha de Google restaurante · secundarias: Google Business Profile restaurantes Tenerife, posicionar restaurante Google Maps.
**Firma:** Equipo Pyme360 (en JSON-LD, `author` = organización `https://pyme360.online/#empresa`, no `Person`).
**Enlace interno / CTA:** `/#diagnostico`
**Plantilla de recogida:** `estudios/interno/E2-plantilla-recogida.md` (NO PUBLICAR).

---

## Respuesta directa (primer párrafo, a completar)

Según la ayuda oficial de Google, los resultados locales se basan principalmente en la relevancia, la distancia y la prominencia, y no se puede pagar por un mejor posicionamiento local. Hemos revisado [COMPLETAR: 50] fichas de restaurantes de Santa Cruz de Tenerife y La Laguna para ver cómo de completas están y qué comparten las que salen primero. [COMPLETAR: dato principal.]

## Metodología (protocolo)

- **Búsquedas fijas en Google Maps:** «restaurantes en Santa Cruz de Tenerife» y «restaurantes en San Cristóbal de La Laguna». Navegador en incógnito, sin sesión, en español, misma franja horaria y mismo día.
- **Muestra:** las 25 primeras fichas orgánicas de cada búsqueda, sin anuncios ni cadenas de más de 3 locales (50 en total). Anotar la posición (1–25).
- **Variables por ficha:**
  - categoría principal y descripción;
  - horario completo (7 días), teléfono, web (propia, de plataforma o ninguna);
  - fotos por rango (<50, 50–199, 200–999, ≥1.000) y si hay fotos del propietario de los últimos 90 días;
  - valoración media y número de reseñas;
  - respuestas del propietario a las 10 reseñas más recientes;
  - publicaciones en los últimos 30 días;
  - carta, reserva y número de atributos.
- **Limitaciones:** Maps ordena según la ubicación y el historial de quien busca. Comparar posiciones 1–5 con 6–25 muestra coincidencias, no causas.

## Resultados (datos recogidos vía API Google Places el 10/11/2026)

| Variable | Top 1–5 (n=10) | 6–25 (n=40) | Total (n=50) |
| --- | --- | --- | --- |
| Horario completo (7 días configurados) | 100% (10/10) | 98% (39/40) | 98% (49/50) |
| Web propia enlazada | 70% (7/10) | 68% (27/40) | 68% (34/50) |
| Web con enlace (propia o plataforma) | 90% (9/10) | 78% (31/40) | 80% (40/50) |
| Fotos devueltas por API (tope 10) | 100% (10/10) | 100% (40/40) | 100% (50/50) |
| Mediana de reseñas | 1.886 reseñas | 1.102 reseñas | 1.300 reseñas |
| Mediana de valoración (estrellas) | 4,7★ (media 4,66) | 4,5★ (media 4,52) | 4,6★ (media 4,55) |
| Botón / función de Reserva activa (`reservable`) | 90% (9/10) | 88% (35/40) | 88% (44/50) |
| Descripción editorial presente en Google | 40% (4/10) | 40% (16/40) | 40% (20/50) |

*Variables omitidas y motivo:*
- **Respuestas del propietario a las 10 últimas reseñas:** La API de Google Places no ofrece el ratio de respuestas del propietario ni el historial completo de reseñas (la API limita la entrega a un máximo de 5 reseñas sin desglose fiable de respuesta oficial). Para evitar estimaciones o datos no verificables, la variable queda excluida de la tabla cuantitativa según el protocolo de §15.4.
- **Publicaciones en los últimos 30 días:** La API pública de Places no expone las publicaciones o posts dinámicos de Google Business Profile.
- **Volumen total de fotos (>200):** La API limita las fotos devueltas a un array de 10 elementos por ficha; todas las fichas recogidas alcanzan dicho máximo en la respuesta.

## Lo que dice Google (verificado el 9/11/2026)

De «Consejos para mejorar el posicionamiento local en Google»:
- «Los resultados locales se basan principalmente en la relevancia, la distancia y la popularidad» (en la versión española, el apartado se titula «Prominencia»).
- «No se puede solicitar ni pagar por obtener un mejor posicionamiento local en Google.»
- Relevancia: «el grado de coincidencia de un Perfil de Empresa con lo que busca un usuario».
- Distancia: «la separación que hay entre cada empresa y el cliente que hace la búsqueda».
- Prominencia: «se basa en información como el número de sitios web que dirigen a tu empresa y el número de reseñas que tienes. Cuantas más reseñas y valoraciones positivas, mejor será el posicionamiento local de una empresa.»
- «Las empresas que proporcionan información completa y precisa tienen más probabilidades de aparecer en los resultados de búsqueda local.»

Google no publica cuánto pesa cada factor.

## Qué significa para un restaurante

- Completar el horario de los 7 días y los horarios especiales.
- Elegir la categoría principal más específica.
- Responder a las reseñas recientes.
- Enlazar la carta y la reserva, y subir fotos actuales.

## Borrador de artículo (publicar solo con datos completos)

**Por el equipo de Pyme360**

### Así están las fichas de Google de los restaurantes de Santa Cruz de Tenerife y La Laguna

Según su ayuda oficial, Google ordena los resultados locales principalmente por relevancia, distancia y prominencia, y no se puede pagar por aparecer más arriba. Hemos revisado [COMPLETAR: 50] fichas de restaurantes de Santa Cruz de Tenerife y La Laguna para ver cómo de completas están y qué comparten las que salen primero.

#### ¿Qué dice Google sobre cómo ordena los restaurantes en Maps?

La ayuda de Perfil de Empresa deja claras tres cosas. Primero, que los resultados dependen principalmente de la relevancia (cuánto encaja tu ficha con lo que busca la persona), la distancia (lo lejos que estás de quien busca) y la prominencia (lo conocido que es tu negocio). Segundo, que la prominencia se apoya, entre otras cosas, en los sitios web que enlazan a tu negocio y en las reseñas: «Cuantas más reseñas y valoraciones positivas, mejor será el posicionamiento local de una empresa». Tercero, que «no se puede solicitar ni pagar por obtener un mejor posicionamiento local en Google».

Google no publica cuánto pesa cada factor. Cualquier afirmación del tipo «el factor número uno es…» no sale de Google.

#### ¿Cómo hemos elegido las fichas?

Hicimos dos búsquedas fijas en Google Maps el mismo día, desde un navegador sin sesión: «restaurantes en Santa Cruz de Tenerife» y «restaurantes en San Cristóbal de La Laguna». De cada lista tomamos las 25 primeras fichas, sin anuncios ni cadenas, y anotamos categoría, horario, teléfono, web, fotos, valoración, reseñas y respuestas, publicaciones, carta, reserva, atributos y descripción. Maps ordena según la ubicación de quien busca: nuestra lista corresponde a ese día y a ese lugar.

#### ¿Cómo de completas están las fichas?

[COMPLETAR: % con horario completo, web propia, carta, reserva y descripción.]

#### ¿Responden los restaurantes a sus reseñas?

[COMPLETAR: % de las 10 reseñas más recientes con respuesta; diferencia entre las 10 primeras posiciones y el resto.] Google recomienda expresamente responder: «Cuando respondes a las reseñas de los clientes, demuestras que valoras su opinión».

#### ¿Qué tienen en común las fichas que salen primero?

[COMPLETAR: comparación de posiciones 1–5 con 6–25.] Que las fichas mejor situadas tengan más reseñas no demuestra que sean la causa: pueden llevar más años abiertos, estar más céntricos o tener más clientes. Medimos coincidencias, no causas.

#### ¿Qué puede hacer hoy un restaurante con su ficha?

1. Completar el horario de los 7 días y los horarios especiales de festivos.
2. Elegir la categoría principal más específica.
3. Enlazar la carta y la reserva.
4. Responder a las reseñas recientes.
5. Subir fotos actuales.

Son las acciones que enumera la propia ayuda de Google. No garantizan una posición: la distancia y la competencia no dependen de ti.

#### Preguntas frecuentes

**¿Puedo pagar a Google para salir primero en Maps?** En los resultados orgánicos, no. Los anuncios aparecen marcados como tales.

**¿Importa más el número de reseñas o la nota media?** Google dice que «cuantas más reseñas y valoraciones positivas, mejor», pero no publica cuánto pesa cada una.

**¿Por qué mi restaurante sale en otra posición cuando busca un amigo?** Porque la distancia es uno de los tres factores: el orden cambia según desde dónde se busque.

¿Quieres saber cómo está la ficha de tu restaurante comparada con estas? Pide el diagnóstico gratuito de Pyme360: https://pyme360.online/#diagnostico

## Fuentes (consultadas el 9/11/2026)

- Google. Consejos para mejorar el posicionamiento local: https://support.google.com/business/answer/7091?hl=es
- Google. Crear un Perfil de Empresa para tu restaurante: https://support.google.com/business/answer/14189260?hl=es
