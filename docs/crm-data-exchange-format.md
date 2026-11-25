# Formato de Intercambio de Datos · Cualificación y Diagnóstico PMV
**PYME360 Growth → Futuro CRM Centralizado (Especialista en Marketing / Codex)**

Este documento especifica el esquema normalizado de intercambio de datos JSON para la integración desacoplada entre el embudo de captación de PYME360 y el futuro CRM centralizado, garantizando el principio de minimización de datos y el cumplimiento de RGPD.

---

## 1. Esquema JSON de Intercambio de Leads (`pyme360.lead.diagnostic.v1`)

```json
{
  "event_id": "lead_diag_20261125_a1b2c3d4",
  "event_type": "commercial_diagnostic_completed",
  "created_at": "2026-11-25T11:30:00Z",
  "source_app": "pyme360_growth",
  "environment": "production",
  "contact": {
    "name": "Carlos Rodríguez",
    "email": "carlos@ejemplo.com",
    "phone": "+34612345678",
    "privacy_consent": {
      "accepted": true,
      "timestamp": "2026-11-25T11:30:00Z",
      "policy_version": "2026-v2"
    },
    "commercial_consent": {
      "newsletter": true,
      "timestamp": "2026-11-25T11:30:00Z"
    }
  },
  "business": {
    "name": "Apartamentos Bahía Azul",
    "type": "apartamento",
    "type_label": "Apartamento turístico",
    "units": 4,
    "location": "Valencia, Comunidad Valenciana",
    "website": "https://bahiaazulvalencia.es"
  },
  "commercial_needs": {
    "selected": ["B", "C"],
    "primary_priority": "B",
    "primary_priority_label": "Mejorar mi página web y aumentar las reservas directas"
  },
  "diagnostic_results": {
    "global_score_100": 68,
    "global_score_10": 6.8,
    "maturity_level": "Buen Punto de Partida con Margen de Mejora",
    "pillars_7p": {
      "p1_producto": 8.0,
      "p2_precio": 6.5,
      "p3_canales": 5.0,
      "p4_promocion": 5.5,
      "p5_personas": 7.0,
      "p6_procesos": 8.0,
      "p7_evidencia": 7.5
    },
    "strengths": [
      {
        "pillar": "p1_producto",
        "score": 8.0,
        "summary": "Propuesta diferencial y público definido por temporada"
      }
    ],
    "priorities": [
      {
        "pillar": "p3_canales",
        "score": 5.0,
        "summary": "Dependencia excesiva de intermediarios y fricción en reserva directa"
      }
    ],
    "immediate_actions": [
      "Auditar el flujo de reserva web móvil",
      "Calcular el margen neto real tras comisiones OTA",
      "Crear incentivo de reserva directa en web"
    ]
  },
  "commercial_routing": {
    "recommended_brand": "PYME360",
    "complementary_brand": null,
    "advisory_meeting_offered": true,
    "booking_url": "https://pyme360.online/agenda",
    "booking_status": "unbooked"
  },
  "attribution": {
    "utm_source": "meta_ads",
    "utm_medium": "paid_social",
    "utm_campaign": "rural_turismo_espana_nov26",
    "utm_content": "ad_video_fuga_margen",
    "utm_term": "alojamiento_turistico"
  }
}
```

---

## 2. Tipos de Alojamiento Normalizados

| Código (`type`) | Etiqueta | Enfoque de Solución |
|---|---|---|
| `vivienda` | Vivienda vacacional | Captación directa, OTA margin protection |
| `apartamento` | Apartamento turístico | Motor web sin fricción, automatización |
| `casa_rural` | Casa rural | SEO local, reservas de fin de semana, delegación |
| `hotel` | Pequeño hotel independiente | Procesos, paridad, reputación |
| `otro` | Otro alojamiento turístico | Valoración personalizada |

---

## 3. Matriz Determinista de Enrutamiento Comercial

1. **Home4Escape:**
   - Detonante: Necesidad `E` (Delegar gestión operativa / huéspedes).
   - Cobertura: Canarias (equipo propio); Península/Baleares (valoración de alcance).
2. **FARO:**
   - Detonante: Necesidad `F` (Organización, procesos, ahorro de tiempo).
   - Cobertura: Consultoría de procesos a nivel nacional.
3. **PYME360 Growth:**
   - Detonante: Necesidades `A`, `B`, `C`, `D`, `G` (Comercialización, web, OTAs, fotos, precios) o `H` con foco comercial.
   - Cobertura: Nacional e internacional (servicios digitales).

---

## 4. Política de Tratamiento y Privacidad

- **Minimización:** Solo se solicitan datos de contacto al momento de pedir el informe completo.
- **Separación de consentimientos:** La solicitud de entrega del informe es independiente del consentimiento de comunicaciones comerciales posteriores (newsletter).
- **No transferencia no consentida:** Los datos no se transfieren a terceros sin base legal específica.
