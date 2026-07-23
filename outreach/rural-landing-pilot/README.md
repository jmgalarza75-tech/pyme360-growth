# Piloto comercial — Landing alojamientos rurales

Landing: https://pyme360.online/alojamientos-rurales/

## Objetivo

Validar si la oferta de **mini-revisión de reservas directas** genera respuestas reales en alojamientos rurales e independientes.

No buscamos volumen. Buscamos señales de mercado.

## Oferta que se prueba

> Miramos web, Google, fotos, reseñas, contacto y canales como Booking. Enviamos 3–5 observaciones claras sobre qué puede estar frenando reservas directas, confianza o contacto.

## Criterios de candidatos

Priorizar alojamientos que cumplan 2+ criterios:

- casa rural, hotel rural, finca turística, apartamento rural o vivienda vacacional rural;
- gestionado de forma independiente o con pinta de decisión cercana;
- aparece en Google Maps;
- tiene web propia o al menos un canal visible;
- usa OTA o parece depender de intermediarios;
- hay una observación visible y real antes de escribir.

Evitar en primera tanda:

- grandes cadenas;
- hoteles muy corporativos;
- alojamientos sin identidad verificable;
- contactos donde no podamos personalizar al menos 2 observaciones.

## Métricas del piloto

| Métrica | Objetivo inicial |
|---|---:|
| Contactados | 20 |
| Respuestas | 3–5 |
| Mini-revisiones solicitadas | 2–3 |
| Llamadas generadas | 1 |
| Propuesta comercial | 1 |

## Proceso recomendado

1. Elegir 10 candidatos de prioridad alta/media-alta del CSV.
2. Investigar web + Google de cada uno.
3. Escribir 2 observaciones reales por candidato.
4. Enviar mensaje de permiso, no venta.
5. Si responde “sí”, preparar mini-revisión con la plantilla.
6. Registrar resultado en el CSV.
7. Ajustar mensaje antes de enviar los siguientes 10.

## Estados sugeridos

- `pendiente_investigar`
- `descartar_o_segunda_tanda`
- `observaciones_preparadas`
- `contactado_d1`
- `respondio_si`
- `mini_revision_enviada`
- `llamada_agendada`
- `propuesta_enviada`
- `no_interes`
- `sin_respuesta_cierre`

## Archivos

- `prospectos-piloto.csv`: lista inicial de 20 candidatos.
- `mensajes-frio.md`: mensajes para WhatsApp, email, LinkedIn/contacto web y follow-ups.
- `plantilla-mini-revision.md`: estructura para entregar la mini-revisión.

## Nota importante

La lista inicial se ha construido con datos públicos de OpenStreetMap/Maps. Antes de contactar hay que validar identidad, web oficial y canal correcto. No enviar mensajes masivos sin revisar cada caso.
