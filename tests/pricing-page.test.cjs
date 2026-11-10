const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "precios.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "precios.html"), "utf8");
const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicIndexHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");

for (const html of [indexHtml, publicIndexHtml]) {
  assert.match(html, /<a href="precios\.html">Precios<\/a>/);
  assert.match(html, /pyme360-public\.css\?v=20261109-1/);
  assert.match(html, /pyme360-public\.js\?v=20261024-1/);
  assert.match(html, /890\s*€/);
  assert.match(html, /1\.500\s*€/);
  assert.match(html, /2\.500\s*€/);
}

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<main id="top" class="modern-pricing">/);
  assert.match(html, /<div class="pricing-orbit" aria-hidden="true"><\/div>/);
  assert.match(html, /class="modern-pricing-grid"/);
  assert.match(html, /class="modern-price-card is-popular"/);
  assert.match(html, /Marketing digital para tu negocio, con un plan claro antes de empezar/);
  
  // Tarifas de diseño web (§15.5)
  assert.match(html, /Esencial/);
  assert.match(html, /890\s*€/);
  assert.match(html, /Profesional/);
  assert.match(html, /1\.500\s*€/);
  assert.match(html, /La más elegida/);
  assert.match(html, /Premium/);
  assert.match(html, /2\.500\s*€/);
  assert.match(html, /desde/);
  assert.match(html, /\+\s*IGIC/);
  assert.match(html, /Pedir presupuesto/);
  
  // Mantenimiento web opcional (§15.6 A)
  assert.match(html, /40\s*€/);
  assert.match(html, /90\s*€/);
  assert.match(html, /El mantenimiento es opcional/);
  
  // SEO Local, Publicidad, Redes (§15.6 B, C, D)
  assert.match(html, /350\s*€/);
  assert.match(html, /250\s*€/);
  assert.match(html, /300\s*€/);
  assert.match(html, /La inversión en anuncios no está incluida/);
  
  // Hosting y Dominio (§15.6 E)
  assert.match(html, /Hosting y dominio/);
  assert.match(html, /El dominio se registra siempre a nombre del cliente/);
  
  // Proceso
  assert.match(html, /Qué ocurre cuando solicitas una valoración/);
  
  // Banned patterns y prevención de mojibake (contrato actualizado §15.5: se permite el símbolo euro € para las tarifas)
  assert.doesNotMatch(html, /\banade\b|\bAnade\b/);
  assert.doesNotMatch(html, /149<\/span><small>euros\/mes|249<\/span><small>euros\/mes|399<\/span><small>euros\/mes|Sprint 30|Growth OS|Captación Total|CRM Básico|piloto automático|autopilot|robar cuota/);
  assert.doesNotMatch(html, /&euro;|\u00c3|\u00e2|dashboard\.html|buscador\.html|pipeline\.html|newsletter\.html|\.env/);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.modern-pricing-hero/);
  assert.match(css, /\.pricing-orbit/);
  assert.match(css, /\.modern-price-card/);
  assert.match(css, /\.modern-price-card\.is-popular/);
  assert.match(css, /\.pricing-button::before/);
  assert.match(css, /@keyframes pricingOrbit/);
  assert.match(css, /\.addon-grid/);
  assert.match(css, /\.service-strip/);
  assert.match(css, /\.footer-mark/);
}

console.log("pricing page tests passed");
