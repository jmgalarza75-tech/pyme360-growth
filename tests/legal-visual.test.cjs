const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const htmlFiles = ["index.html", "precios.html", "public/index.html", "public/precios.html"];

for (const relative of htmlFiles) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  assert.match(html, /<footer class="site-footer">/);
  assert.match(html, /href="aviso-legal\.html"/);
  assert.match(html, /href="privacidad\.html"/);
  assert.match(html, /href="cookies\.html"/);
}

const legalPages = [
  ["aviso-legal.html", "Aviso legal"],
  ["privacidad.html", "Politica de privacidad"],
  ["cookies.html", "Politica de cookies"]
];

for (const [file, title] of legalPages) {
  for (const base of [root, path.join(root, "public")]) {
    const html = fs.readFileSync(path.join(base, file), "utf8");
    assert.match(html, new RegExp(`<title>${title} \\| Pyme360<\\/title>`));
    assert.match(html, /Roam Retreats/);
    assert.match(html, /CIF 16392094/);
    assert.match(html, /Calle Tinfugaya I 7/);
    assert.match(html, /<a href="index\.html#top">Inicio<\/a>/);
    assert.match(html, /<a href="precios\.html">Precios<\/a>/);
    assert.match(html, /<link rel="stylesheet" href="assets\/pyme360-public\.css\?v=20260713-3">/);
    assert.doesNotMatch(html, /dashboard\.html|buscador\.html|pipeline\.html|newsletter\.html|\.env/);
  }
}


for (const base of [root, path.join(root, "public")]) {
  const sitemap = fs.readFileSync(path.join(base, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/aviso-legal\.html<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/privacidad\.html<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/cookies\.html<\/loc>/);
}
const css = fs.readFileSync(path.join(root, "assets", "pyme360-public.css"), "utf8");
const publicCss = fs.readFileSync(path.join(root, "public", "assets", "pyme360-public.css"), "utf8");

for (const styles of [css, publicCss]) {
  assert.match(styles, /\.brand-logo\s*{[\s\S]*width: clamp\(154px, 14vw, 220px\);/);
  assert.match(styles, /\.modern-price-card h2\s*{[\s\S]*overflow-wrap: normal;/);
  assert.match(styles, /\.legal-page/);
  assert.match(styles, /\.footer-mark/);
  assert.match(styles, /\.footer-links/);
}

console.log("legal and visual polish tests passed");
