# Campaña A/B — Rural Tenerife 01

**Proyecto:** Pyme360 Growth — piloto alojamientos rurales  
**Landing de apoyo:** https://pyme360.online/alojamientos-rurales/  
**Objetivo:** validar qué CTA genera más respuesta/interés para la mini-revisión de reservas directas.  
**Estado:** preparado para aprobación antes de nuevos envíos. No enviar automáticamente.

---

## Hipótesis

En cold outreach para alojamientos rurales e independientes, una petición simple de permiso puede generar más respuestas que llevar al usuario directamente a una landing.

- **Variante A — Responder “sí”:** maximiza respuesta humana y conversación.
- **Variante B — Responder “sí” + landing:** puede captar a quien prefiere ordenar la solicitud en formulario, pero podría parecer más campaña y bajar respuestas.

---

## Diseño del test

| Elemento | Decisión |
|---|---|
| Campaña | `rural_tenerife_01_ab` |
| Tamaño inicial | 10 leads nuevos, después de los 2 ya contactados |
| Distribución | 5 Variante A / 5 Variante B |
| Nicho | casas rurales, hoteles rurales, apartamentos rurales, viviendas vacacionales rurales, fincas turísticas y alojamientos independientes |
| Canal inicial | email manual/asistido desde `info@pyme360.online` o cuenta confirmada |
| Personalización mínima | 2 observaciones reales por lead |
| Envío | solo tras aprobación explícita de José |
| Duración medición | 21–25 días |
| Parada | rebote, respuesta, baja/no contactar, objeción clara |

> Nota: P001 y P002 ya fueron contactados con una versión que incluía landing en la firma. Para no contaminar el test, marcarlos como `pretest` y usar el A/B con leads nuevos.

---

## Métrica principal

**Respuesta positiva por lead contactado.**

Respuesta positiva = responde “sí”, “pásamelo”, pide más información, completa formulario o acepta recibir mini-revisión.

## Métricas secundarias

| Métrica | Interpretación |
|---|---|
| Respuestas totales | Interés o fricción del mensaje |
| Formularios completados | Utilidad real de la landing como conversión |
| Mini-revisiones entregadas | Capacidad operativa de seguimiento |
| Llamadas generadas | Señal comercial fuerte |
| Rebotes | Calidad de base/contactos |
| Bajas/no contactar | Riesgo reputacional |

## Criterio de decisión

Con 10 leads no se busca significancia estadística. Se busca señal práctica.

| Resultado | Decisión |
|---|---|
| A genera más respuestas positivas | Mantener CTA “respóndeme con sí”; usar landing solo después de respuesta |
| B genera formularios sin bajar respuestas | Incluir landing como CTA secundario en emails 2–4 |
| Ninguna variante responde | Revisar segmento, asunto, observaciones o remitente antes de escalar |
| Rebotes/quejas altos | Detener, limpiar base y revisar fuente de contactos |

---

# Variante A — CTA conversación

## Email 1 — Día 1

**Asunto:** `detalle rápido en [alojamiento]`

```text
Hola, [nombre].

Soy José María, de Pyme360 Growth.

He estado revisando cómo aparece [alojamiento] online y he visto 2 cosas concretas que podrían estar frenando reservas directas o confianza antes de reservar:

1. [observación real 1]
2. [observación real 2]

Te lo digo porque en alojamientos rurales la decisión se toma muy rápido desde Google, Maps, la web o Booking. Si algo no transmite confianza o no deja claro cómo contactar/reservar, el huésped compara y se va a otro canal.

He visto algún punto más, pero no quería enviarte un informe largo sin permiso.

Si te interesa, respóndeme con un “sí” y te paso una mini-revisión con 3–5 observaciones claras.

Un saludo,
José María
Pyme360 Growth
```

## Email 2 — Día 4/5 si no responde

**Asunto:** `por si te sirve`

```text
Hola, [nombre].

Te dejo igualmente una de las observaciones, por si te sirve:

[observación útil concreta, con contexto y sin vender]

Puede que ya lo tengáis controlado, pero lo vi así desde móvil/Google.

Si quieres que te pase el resto de puntos, dime “sí” y te envío la mini-revisión.

Un saludo,
José María
```

## Email 3 — Día 10/12 si no responde

**Asunto:** `reservas directas en [alojamiento]`

```text
Hola, [nombre].

Te resumo rápido cómo veo la presencia digital de [alojamiento]:

- Visibilidad: [observación breve]
- Confianza: [observación breve]
- Reserva/contacto desde móvil: [observación breve]
- Comparación con Booking/Airbnb: [observación breve]

Mi sensación es que puede haber demanda interesada, pero parte del recorrido podría estar empujando al viajero hacia la comparación o hacia una OTA, en vez de facilitar el contacto directo.

Si quieres, te paso 3–5 observaciones ordenadas por prioridad.

Un saludo,
José María
```

## Email 4 — Día 21/25 si no responde

**Asunto:** `cierro esto`

```text
Hola, [nombre].

Cierro por aquí para no molestarte más.

Te escribí porque vi algunos detalles concretos en la presencia digital de [alojamiento] que podrían estar afectando a reservas directas, confianza o contacto desde móvil.

Puede que ya lo tengáis controlado.

Si más adelante quieres que te pase esas observaciones, puedes responder a este correo y te las preparo.

Un saludo,
José María
```

---

# Variante B — CTA conversación + landing

## Email 1 — Día 1

**Asunto:** `detalle rápido en [alojamiento]`

```text
Hola, [nombre].

Soy José María, de Pyme360 Growth.

He estado revisando cómo aparece [alojamiento] online y he visto 2 cosas concretas que podrían estar frenando reservas directas o confianza antes de reservar:

1. [observación real 1]
2. [observación real 2]

Te lo digo porque en alojamientos rurales la decisión se toma muy rápido desde Google, Maps, la web o Booking. Si algo no transmite confianza o no deja claro cómo contactar/reservar, el huésped compara y se va a otro canal.

He visto algún punto más, pero no quería enviarte un informe largo sin permiso.

Si te interesa, puedes responderme con un “sí” o pedir la mini-revisión desde aquí:
https://pyme360.online/alojamientos-rurales/

Un saludo,
José María
Pyme360 Growth
```

## Email 2 — Día 4/5 si no responde

**Asunto:** `por si te sirve`

```text
Hola, [nombre].

Te dejo igualmente una de las observaciones, por si te sirve:

[observación útil concreta, con contexto y sin vender]

Puede que ya lo tengáis controlado, pero lo vi así desde móvil/Google.

Si quieres que te pase el resto de puntos, puedes responderme con “sí” o pedir la mini-revisión aquí:
https://pyme360.online/alojamientos-rurales/

Un saludo,
José María
```

## Email 3 — Día 10/12 si no responde

**Asunto:** `reservas directas en [alojamiento]`

```text
Hola, [nombre].

Te resumo rápido cómo veo la presencia digital de [alojamiento]:

- Visibilidad: [observación breve]
- Confianza: [observación breve]
- Reserva/contacto desde móvil: [observación breve]
- Comparación con Booking/Airbnb: [observación breve]

Mi sensación es que puede haber demanda interesada, pero parte del recorrido podría estar empujando al viajero hacia la comparación o hacia una OTA, en vez de facilitar el contacto directo.

Si quieres, te paso 3–5 observaciones ordenadas por prioridad. También puedes pedirlo desde aquí:
https://pyme360.online/alojamientos-rurales/

Un saludo,
José María
```

## Email 4 — Día 21/25 si no responde

**Asunto:** `cierro esto`

```text
Hola, [nombre].

Cierro por aquí para no molestarte más.

Te escribí porque vi algunos detalles concretos en la presencia digital de [alojamiento] que podrían estar afectando a reservas directas, confianza o contacto desde móvil.

Puede que ya lo tengáis controlado.

Si más adelante quieres que te pase esas observaciones, puedes responder a este correo o pedir la mini-revisión aquí:
https://pyme360.online/alojamientos-rurales/

Un saludo,
José María
```

---

# Reglas CQC antes de enviar

No enviar ningún correo si falla una de estas reglas:

- [ ] Hay email/contacto validado.
- [ ] El lead no es cadena grande/corporativo sin decisión cercana.
- [ ] Hay 2 observaciones reales, no genéricas.
- [ ] No se usa “pequeños alojamientos” ni jerga interna.
- [ ] No se prometen resultados numéricos.
- [ ] El email pide permiso antes de vender.
- [ ] El asunto no parece newsletter, promoción ni automatización masiva.
- [ ] El lead no está en `no_contactar`, `rebote`, `respondio`, `baja` o similar.
- [ ] El envío está aprobado por José.

---

# Respuesta si contestan “sí”

```text
Perfecto, gracias.

Para prepararte algo útil y no darte una respuesta genérica, puedo hacerlo de dos formas:

1. Si ya tengo localizada vuestra web/ficha pública, preparo directamente 3–5 observaciones.
2. Si prefieres orientarlo mejor, puedes completar este formulario breve:
https://pyme360.online/alojamientos-rurales/

Si hay algo concreto que quieras que mire —Booking, Google, WhatsApp, reservas directas o la web— dímelo y lo incluyo.

Un saludo,
José María
```

---

# Informe que debe generar el agente

Al cerrar la campaña:

```text
Campaña: rural_tenerife_01_ab
Periodo: [fecha inicio] – [fecha cierre]

Variante A — responder sí:
- Leads contactados:
- Respuestas totales:
- Respuestas positivas:
- Mini-revisiones solicitadas:
- Formularios completados:
- Llamadas:
- Rebotes/bajas:

Variante B — sí + landing:
- Leads contactados:
- Respuestas totales:
- Respuestas positivas:
- Mini-revisiones solicitadas:
- Formularios completados:
- Llamadas:
- Rebotes/bajas:

Lectura:
[qué variante funcionó mejor y por qué]

Aprendizaje:
[segmento/mensaje/observación/CTA que conviene mantener]

Siguiente decisión:
[escalar, corregir, pausar o cambiar segmento]
```
