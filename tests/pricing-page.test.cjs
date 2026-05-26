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
  assert.match(html, /pyme360-public\.css\?v=20260525-7/);
  assert.match(html, /pyme360-public\.js\?v=20260525-7/);
}

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<body class="pricing-page">/);
  assert.match(html, /aria-current="page">Precios<\/a>/);
  assert.match(html, /Presencia/);
  assert.match(html, /desde 149 â‚¬\/mes/);
  assert.match(html, /Crecimiento/);
  assert.match(html, /desde 249 â‚¬\/mes/);
  assert.match(html, /Maquina Comercial/);
  assert.match(html, /desde 399 â‚¬\/mes/);
  assert.match(html, /Personalizado/);
  assert.match(html, /Gestion de ayudas y subvenciones/);
  assert.match(html, /Redes Base/);
  assert.match(html, /Redes Pro/);
  assert.match(html, /Redes Premium/);
  assert.match(html, /Publicidad online/);
  assert.match(html, /Branding y diseno/);
  assert.doesNotMatch(html, /dashboard\.html|buscador\.html|pipeline\.html|newsletter\.html|\.env/);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.pricing-hero/);
  assert.match(css, /\.pricing-grid/);
  assert.match(css, /\.addon-grid/);
  assert.match(css, /\.service-strip/);
  assert.match(css, /\.pricing-cta/);
}

console.log("pricing page tests passed");