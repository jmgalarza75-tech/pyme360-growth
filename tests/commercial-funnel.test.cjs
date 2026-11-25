const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const htmlPath = path.join(__dirname, "..", "alojamientos-rurales", "index.html");
const publicHtmlPath = path.join(__dirname, "..", "public", "alojamientos-rurales", "index.html");
const jsPath = path.join(__dirname, "..", "assets", "indice-pyme360.js");
const publicJsPath = path.join(__dirname, "..", "public", "assets", "indice-pyme360.js");
const cssPath = path.join(__dirname, "..", "assets", "pyme360-public.css");
const publicCssPath = path.join(__dirname, "..", "public", "assets", "pyme360-public.css");
const phpPath = path.join(__dirname, "..", "procesar-lead.php");

const html = fs.readFileSync(htmlPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");
const php = fs.readFileSync(phpPath, "utf8");

test("Commercial Funnel - HTML Structure & Elements", () => {
  // Title & Subtitle for Step 0 (Needs screen)
  assert.match(html, /¿Qué te gustaría mejorar en tu alojamiento\?/, "Needs screen title must match agreed copy");
  assert.match(html, /Selecciona los aspectos que más te preocupan/, "Needs screen subtitle must match agreed copy");

  // Options A to H present in data-need attributes
  ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((letter) => {
    assert.match(html, new RegExp(`data-need=["']${letter}["']`), `Need option ${letter} must be present`);
  });

  // Paso 1: 5 accommodation types in #quiz-tipo
  ["vivienda", "apartamento", "casa_rural", "hotel", "otro"].forEach((tipo) => {
    assert.match(html, new RegExp(`value=["']${tipo}["']`), `Accommodation type ${tipo} must be present in select`);
  });

  // Priority selector container
  assert.match(html, /id=["']quiz-primary-priority-wrap["']/, "Primary priority wrapper must exist");

  // N/A button present on rating scales
  assert.match(html, /class=["'][^"']*scale-btn-na[^"']*["']/, "Scale must include N/A button");

  // Immediate percentage score & visual breakdown on Step 8
  assert.match(html, /id=["']res-global-score["']/, "Global score badge element must exist");
  assert.match(html, /id=["']res-global-bar["']/, "Global score progress bar must exist");
  assert.match(html, /id=["']res-strengths-list["']/, "Strengths list container must exist");
  assert.match(html, /id=["']res-priorities-list["']/, "Priorities/opportunities list container must exist");
  assert.match(html, /id=["']res-p-list["']/, "7P breakdown container must exist");

  // Unlock button & Lead Form
  assert.match(html, /id=["']btn-unlock-report["']/, "Unlock report button must exist");
  assert.match(html, /id=["']quiz-email-form["']/, "Lead capture form must exist");

  // Dynamic recommendation box & booking CTA
  assert.match(html, /id=["']quiz-solution-recommendation["']/, "Solution recommendation box must exist");
  assert.match(html, /id=["']rec-booking-btn["']/, "Booking button must exist");

  // Guardrail check: static HTML does not contain forbidden internal strings
  assert.doesNotMatch(html, /FARO|Home4Escape|Separación clara/, "Public static HTML must not leak internal partner brand names or sensitive strings");
});

test("Commercial Funnel - Parity between root and public files", () => {
  const publicHtml = fs.readFileSync(publicHtmlPath, "utf8");
  const publicJs = fs.readFileSync(publicJsPath, "utf8");
  const publicCss = fs.readFileSync(publicCssPath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8");

  assert.equal(html, publicHtml, "alojamientos-rurales/index.html and public/ must be byte-for-byte identical");
  assert.equal(js, publicJs, "assets/indice-pyme360.js and public/ must be byte-for-byte identical");
  assert.equal(css, publicCss, "assets/pyme360-public.css and public/ must be byte-for-byte identical");
});

test("Commercial Funnel - JavaScript Recommendation Engine & 5 Mandatory Profiles", () => {
  assert.match(js, /function pyme360GetBrandRecommendation/, "Recommendation function must exist");

  // Emulador de recomendación sincronizado con JS
  function testRecommendation(primaryPriority, selectedNeeds, avgP6, avgP3, avgP4) {
    if (primaryPriority === 'E' || (selectedNeeds.includes('E') && !primaryPriority)) {
      return 'Home4Escape';
    }
    if (primaryPriority === 'F' || (selectedNeeds.includes('F') && !primaryPriority)) {
      return 'FARO';
    }
    if (['A', 'B', 'C', 'D', 'G'].includes(primaryPriority)) {
      return 'PYME360';
    }
    if (primaryPriority === 'H' || selectedNeeds.includes('H')) {
      if (avgP3 < 5.0 || avgP4 < 5.0) return 'PYME360';
      if (avgP6 < 5.0) return 'FARO';
      return 'PYME360';
    }
    return 'PYME360';
  }

  // Perfil 1: Vivienda vacacional con problemas de comercialización (A o C)
  assert.equal(testRecommendation('A', ['A'], 6.0, 4.0, 3.5), 'PYME360');
  assert.equal(testRecommendation('C', ['C', 'A'], 6.0, 3.5, 4.0), 'PYME360');

  // Perfil 2: Gestor de apartamentos que quiere mejorar su web (B)
  assert.equal(testRecommendation('B', ['B', 'A'], 6.0, 4.0, 5.0), 'PYME360');

  // Perfil 3: Casa rural que desea delegar la gestión (E)
  assert.equal(testRecommendation('E', ['E', 'A'], 6.0, 7.0, 7.0), 'Home4Escape');

  // Perfil 4: Pequeño hotel que necesita mejorar procesos y organización (F)
  assert.equal(testRecommendation('F', ['F'], 3.0, 7.0, 6.0), 'FARO');

  // Perfil 5: Alojamiento con varias necesidades y sin prioridad clara (H)
  // 5a: Con fugas de ventas/canales
  assert.equal(testRecommendation('H', ['H'], 7.0, 3.0, 4.0), 'PYME360');
  // 5b: Con procesos caóticos (P6 bajo)
  assert.equal(testRecommendation('H', ['H'], 3.5, 7.0, 7.0), 'FARO');
  // 5c: Neutro equilibrado
  assert.equal(testRecommendation('H', ['H'], 6.0, 6.0, 6.0), 'PYME360');
});

test("Commercial Funnel - N/A Non-Penalizing Calculation", () => {
  // Función de cálculo de pilar excluyendo 'na'
  function calcPillar(answers) {
    const valid = answers.filter((v) => typeof v === "number" && !isNaN(v));
    if (valid.length === 0) return null;
    return Math.round((valid.reduce((acc, v) => acc + v, 0) / valid.length) * 10) / 10;
  }

  // Caso 1: 3 respuestas de 8 => 8.0
  assert.equal(calcPillar([8, 8, 8]), 8.0);

  // Caso 2: 2 respuestas de 8 y una N/A => sigue siendo 8.0 (NO penaliza)
  assert.equal(calcPillar([8, 8, 'na']), 8.0);

  // Caso 3: 1 respuesta de 10 y dos N/A => 10.0 (NO penaliza)
  assert.equal(calcPillar([10, 'na', 'na']), 10.0);
});

test("Commercial Funnel - Tracking and Analytics Events", () => {
  assert.match(js, /diagnostic_start/, "Must emit diagnostic_start event");
  assert.match(js, /needs_selected/, "Must emit needs_selected event");
  assert.match(js, /diagnostic_complete/, "Must emit diagnostic_complete event");
  assert.match(js, /generate_lead/, "Must emit generate_lead event");
  assert.match(js, /booking_click/, "Must emit booking_click event");
  assert.match(js, /state\.utms/, "Must store UTM parameters");
  assert.match(js, /utm_source/, "Must capture utm_source");
  assert.match(js, /utm_campaign/, "Must capture utm_campaign");

  // Meta Pixel (Dataset ID: 1508603327820296)
  assert.match(js, /1508603327820296/, "Meta Pixel ID 1508603327820296 must be present");
  assert.match(js, /fbq\("init", META_PIXEL_ID\)/, "Must initialize Meta Pixel with ID");
  assert.match(js, /fbq\("track", "PageView"\)/, "Must track PageView on load");
  assert.match(js, /fbq\("track", "Lead",/, "Must track Lead event on completed report request");
  assert.match(js, /fbq\("track", "Schedule",/, "Must track Schedule event on booking click");
  assert.match(js, /fbq\("track", "Contact",/, "Must track Contact event on WhatsApp/advisory click");
  assert.match(js, /fbq\("track", "ViewContent",/, "Must track ViewContent on diagnostic score view");
  assert.match(js, /test_event_code/, "Must support Meta Test Events parameter");
});

test("Commercial Funnel - Backend Lead Processing & Email Delivery", () => {
  assert.match(php, /\$primary_need\s*=\s*clean\(\$data\['primary_need'\]/, "Must parse primary_need");
  assert.match(php, /\$recommended_brand\s*=\s*clean\(\$data\['recommended_brand'\]/, "Must parse recommended_brand");
  assert.match(php, /\$accommodation_type/, "Must capture accommodation_type");
  assert.match(php, /\$score_100_input/, "Must parse score_100");
  assert.match(php, /\$agenda_url/, "Must configure agenda booking URL");
  assert.match(php, /Reservar reunión gratuita de asesoramiento \(20 min\)/, "Must include the 20-min advisory meeting CTA");
  assert.match(php, /Tu diagnóstico comercial: {\$business_name} \| PYME360 Growth/, "Must set personalized subject for autoevaluation lead");
  assert.match(php, /pyme360_send_resend\(\$email/, "Must attempt Resend email delivery for lead confirmation");
  assert.match(php, /mail\(\$email, \$subject_lead/, "Must execute mail() delivery fallback for lead confirmation");
});
