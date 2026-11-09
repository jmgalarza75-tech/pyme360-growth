const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

const generatedSlugs = [
  "web-visitas-sin-contactos-tenerife",
  "la-falacia-del-85-por-ciento-ocupacion",
  "seo-local-canarias-google-maps",
  "tus-huespedes-no-son-tuyos",
  "errores-google-ads-pymes",
  "friccion-invisible-reservas-web-movil",
  "geo-aparecer-en-respuestas-ia",
  "trampa-bajar-precios-temporada-baja",
  "resenas-google-negocios-tenerife",
  "control-costes-hotel-rural"
];

for (const slug of generatedSlugs) {
  const rootPath = path.join(root, "blog", slug, "index.html");
  const publicPath = path.join(root, "public", "blog", slug, "index.html");

  assert.ok(fs.existsSync(rootPath), `Missing ${rootPath}`);
  assert.ok(fs.existsSync(publicPath), `Missing ${publicPath}`);

  const rootHtml = fs.readFileSync(rootPath, "utf8");
  const publicHtml = fs.readFileSync(publicPath, "utf8");

  // Byte for byte parity
  assert.equal(rootHtml, publicHtml, `${slug} must match byte for byte`);

  // Exactly one H1
  const h1Matches = rootHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  assert.equal(h1Matches.length, 1, `${slug} must have exactly one H1`);

  // Canonical matches slug
  assert.match(rootHtml, new RegExp(`<link rel="canonical" href="https:\\/\\/pyme360\\.online\\/blog\\/${slug}\\/">`));

  // Author is Theo Rubio
  assert.match(rootHtml, /Theo Rubio/);

  // FAQPage JSON-LD valid
  const jsonLdMatches = [...rootHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(jsonLdMatches.length >= 1, `${slug} must contain JSON-LD`);
  for (const m of jsonLdMatches) {
    const parsed = JSON.parse(m[1]);
    assert.ok(parsed, `Valid JSON-LD in ${slug}`);
  }
}

console.log("All 10 generated articles passed validation test suite!");

