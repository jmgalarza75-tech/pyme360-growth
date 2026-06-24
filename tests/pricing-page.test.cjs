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
  assert.match(html, /pyme360-public\.css\?v=20260624-3/);
  assert.match(html, /pyme360-public\.js\?v=20260624-3/);
}

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<main id="top" class="modern-pricing">/);
  assert.match(html, /<div class="pricing-orbit" aria-hidden="true"><\/div>/);
  assert.match(html, /class="modern-pricing-grid"/);
  assert.match(html, /class="modern-price-card is-popular"/);
  assert.match(html, /Mas elegido/);
  assert.match(html, /149<\/span><small>euros\/mes/);
  assert.match(html, /249<\/span><small>euros\/mes/);
  assert.match(html, /399<\/span><small>euros\/mes/);
  assert.match(html, /A medida/);
  assert.match(html, /Gestion de ayudas y subvenciones/);
  assert.match(html, /Redes Base/);
  assert.match(html, /Redes Pro/);
  assert.match(html, /Redes Premium/);
  assert.match(html, /Publicidad online/);
  assert.match(html, /Branding y diseno/);
  assert.match(html, /Servicios extra para completar tu sistema/);
  assert.doesNotMatch(html, /\banade\b|\bAnade\b/);
  assert.doesNotMatch(html, /&euro;|\u00c3|\u00e2|\u20ac|dashboard\.html|buscador\.html|pipeline\.html|newsletter\.html|\.env/);
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
