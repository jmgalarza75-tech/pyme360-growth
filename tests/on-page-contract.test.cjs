const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const cssVersion = "20261109-1";
const mirroredPages = [
  ["index.html", "public/index.html"],
  ["precios.html", "public/precios.html"],
  ["alojamientos-rurales/index.html", "public/alojamientos-rurales/index.html"],
  ["indice-pyme360/index.html", "public/indice-pyme360/index.html"],
  ["aviso-legal.html", "public/aviso-legal.html"],
  ["privacidad.html", "public/privacidad.html"],
  ["cookies.html", "public/cookies.html"],
  ["contacto.html", "public/contacto.html"],
  ["blog/index.html", "public/blog/index.html"],
  ["blog/plantilla.html", "public/blog/plantilla.html"]
];

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

for (const [source, mirror] of mirroredPages) {
  const sourceHtml = fs.readFileSync(path.join(root, source), "utf8");
  const mirrorHtml = fs.readFileSync(path.join(root, mirror), "utf8");
  assert.equal(sourceHtml, mirrorHtml, `${source} must match ${mirror} byte for byte`);

  const versions = [...sourceHtml.matchAll(/pyme360-public\.css\?v=([^"']+)/g)].map((match) => match[1]);
  assert.equal(versions.length, 1, `${source} must load the shared stylesheet once`);
  assert.equal(versions[0], cssVersion, `${source} must use the consolidated CSS cache version`);
}

for (const relative of ["precios.html", "public/precios.html"]) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  const title = "Precios y presupuestos de marketing para pymes | Pyme360";
  assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/title>`));
  assert.match(html, new RegExp(`<meta property="og:title" content="${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`));
  assert.match(html, new RegExp(`<meta name="twitter:title" content="${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`));
}

const ruralPages = ["alojamientos-rurales/index.html", "public/alojamientos-rurales/index.html"];
for (const relative of ruralPages) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  assert.match(html, /Haz que tu alojamiento rural se venda mejor, todo el año/);
}

const breadcrumbPages = [
  ["precios.html", "Precios", "https://pyme360.online/precios.html"],
  ["alojamientos-rurales/index.html", "Alojamientos rurales", "https://pyme360.online/alojamientos-rurales/"],
  ["contacto.html", "Contacto", "https://pyme360.online/contacto.html"]
];
for (const [relative, label, url] of breadcrumbPages) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  const nav = html.match(/<nav class="seo-breadcrumb" aria-label="Migas de pan">([\s\S]*?)<\/nav>/);
  assert.ok(nav, `${relative} must show a visible breadcrumb navigation`);
  assert.match(nav[1], /<a href="\/">Inicio<\/a>/);
  assert.match(nav[1], new RegExp(`<span aria-current="page">${label}<\\/span>`));

  const breadcrumb = jsonLdBlocks(html).find((block) => block["@type"] === "BreadcrumbList");
  assert.ok(breadcrumb, `${relative} must contain BreadcrumbList JSON-LD`);
  assert.deepEqual(breadcrumb.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://pyme360.online/" },
    { "@type": "ListItem", position: 2, name: label, item: url }
  ]);
}

const styles = fs.readFileSync(path.join(root, "assets", "pyme360-public.css"), "utf8");
const publicStyles = fs.readFileSync(path.join(root, "public", "assets", "pyme360-public.css"), "utf8");
assert.equal(styles, publicStyles, "shared CSS copies must match byte for byte");
assert.match(styles, /\.seo-breadcrumb\s*\{/);

console.log("on-page contract tests passed");
