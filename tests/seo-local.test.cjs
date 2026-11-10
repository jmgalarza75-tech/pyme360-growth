const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const rootHtml = fs.readFileSync(path.join(root, "seo-local", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(root, "public", "seo-local", "index.html"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const publicSitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
const publicLlms = fs.readFileSync(path.join(root, "public", "llms.txt"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const publicIndexHtml = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const preciosHtml = fs.readFileSync(path.join(root, "precios.html"), "utf8");
const publicPreciosHtml = fs.readFileSync(path.join(root, "public", "precios.html"), "utf8");

// 1. Paridad raíz <-> public/ byte a byte
assert.equal(rootHtml, publicHtml, "seo-local/index.html and public/seo-local/index.html must match byte for byte");
assert.equal(sitemap, publicSitemap, "sitemap.xml and public/sitemap.xml must match byte for byte");
assert.equal(llms, publicLlms, "llms.txt and public/llms.txt must match byte for byte");

for (const html of [rootHtml, publicHtml]) {
  // 2. Un único H1
  const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
  assert.equal(h1Matches.length, 1, "Must contain exactly one <h1> element");
  assert.match(h1Matches[0], /Posiciona tu negocio en Google Maps en Tenerife/i);

  // 3. Title <= 60 caracteres y con 'SEO local' y 'Tenerife'
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert.ok(titleMatch, "Must contain a <title> tag");
  const titleText = titleMatch[1].trim();
  assert.ok(titleText.length <= 60, `Title length (${titleText.length}) must be <= 60 characters: "${titleText}"`);
  assert.match(titleText, /SEO local/i, "Title must contain 'SEO local'");
  assert.match(titleText, /Tenerife/i, "Title must contain 'Tenerife'");

  // Meta description entre 140 y 160 caracteres
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  assert.ok(descMatch, "Must contain a meta description");
  const descText = descMatch[1].trim();
  assert.ok(descText.length >= 140 && descText.length <= 160, `Meta description (${descText.length}) should be between 140 and 160 chars`);

  // 4. Canonical
  assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/pyme360\.online\/seo-local\/"/i);

  // 5. Cita oficial de Google con relevancia, distancia y prominencia
  assert.match(html, /https:\/\/support\.google\.com\/business\/answer\/7091\?hl=es/);
  assert.match(html, /Relevancia/i);
  assert.match(html, /Distancia/i);
  assert.match(html, /Prominencia/i);

  // 6. Cita datos del Estudio E1 (50% y 36%)
  assert.match(html, /50%/);
  assert.match(html, /36%/);
  assert.match(html, /90 webs/i);

  // 7. Puesta a punto desde 350 € + IGIC
  assert.match(html, /350\s*€/);
  assert.match(html, /desde/i);
  assert.match(html, /\+\s*IGIC/i);
  assert.match(html, /pago único/i);

  // Qué incluye
  assert.match(html, /Revisión inicial/i);
  assert.match(html, /Ficha de Google/i);
  assert.match(html, /Consistencia NAP/i);
  assert.match(html, /Datos estructurados/i);
  assert.match(html, /reseñas/i);

  // Metodología: diagnóstico -> propuesta -> puesta a punto
  assert.match(html, /Diagnóstico previo/i);
  assert.match(html, /Propuesta/i);
  assert.match(html, /Puesta a punto/i);

  // Preguntas frecuentes
  assert.match(html, /Preguntas frecuentes/i);
  assert.match(html, /faq-accordion-item/);

  // CTA al diagnóstico
  assert.match(html, /href="\/#diagnostico"/);

  // Migas de pan
  assert.match(html, /<nav class="seo-breadcrumb" aria-label="Migas de pan">/);

  // JSON-LD válido con Service, FAQPage y BreadcrumbList
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "Must contain JSON-LD block");
  const schema = JSON.parse(jsonLdMatch[1]);
  assert.ok(schema["@graph"], "Schema must have @graph array");

  const service = schema["@graph"].find((item) => item["@type"] === "Service");
  assert.ok(service, "Schema must include Service");
  assert.equal(service.serviceType, "SEO local");
  assert.equal(service.provider["@id"], "https://pyme360.online/#empresa");
  assert.equal(service.offers.price, "350");
  assert.equal(service.offers.priceCurrency, "EUR");
  assert.equal(service.offers.valueAddedTaxIncluded, false);

  const breadcrumb = schema["@graph"].find((item) => item["@type"] === "BreadcrumbList");
  assert.ok(breadcrumb, "Schema must include BreadcrumbList");

  const faqPage = schema["@graph"].find((item) => item["@type"] === "FAQPage");
  assert.ok(faqPage, "Schema must include FAQPage");
  assert.ok(faqPage.mainEntity.length >= 3, "FAQPage must have at least 3 questions");

  // Anti mojibake
  assert.doesNotMatch(html, /\u00c3|\u00e2/);
}

// 8. Presencia en sitemap.xml
assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/seo-local\/<\/loc>/);
assert.match(publicSitemap, /<loc>https:\/\/pyme360\.online\/seo-local\/<\/loc>/);

// 9. Presencia en llms.txt
assert.match(llms, /https:\/\/pyme360\.online\/seo-local\//);
assert.match(publicLlms, /https:\/\/pyme360\.online\/seo-local\//);

// 10. Enlaces desde navegación y pie
for (const html of [indexHtml, publicIndexHtml]) {
  assert.match(html, /<a href="seo-local\/">SEO Local<\/a>/);
}
for (const html of [preciosHtml, publicPreciosHtml]) {
  assert.match(html, /<a href="seo-local\/">SEO Local<\/a>/);
}

console.log("seo-local landing tests passed");

