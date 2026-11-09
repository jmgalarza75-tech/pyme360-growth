const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

// 1. Paridad raíz <-> public de las páginas del blog
const blogPages = [
  ["blog/index.html", "public/blog/index.html"],
  ["blog/plantilla.html", "public/blog/plantilla.html"]
];

for (const [source, mirror] of blogPages) {
  const sourceHtml = fs.readFileSync(path.join(root, source), "utf8");
  const mirrorHtml = fs.readFileSync(path.join(root, mirror), "utf8");
  assert.equal(sourceHtml, mirrorHtml, `${source} must match ${mirror} byte for byte`);

  // Un solo H1
  const h1Matches = sourceHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  assert.ok(h1Matches, `${source} must have an H1`);
  assert.equal(h1Matches.length, 1, `${source} must have exactly one H1`);

  // Title <= 60 caracteres
  const titleMatch = sourceHtml.match(/<title>([\s\S]*?)<\/title>/i);
  assert.ok(titleMatch, `${source} must have a title`);
  assert.ok(titleMatch[1].trim().length <= 60, `${source} title must be <= 60 chars, got ${titleMatch[1].trim().length}`);

  // Canonical correcto
  assert.match(sourceHtml, /<link rel="canonical" href="https:\/\/pyme360\.online\/blog\//);
}

// 2. Comprobación JSON-LD válido (JSON.parse)
function parseJsonLd(html) {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return matches.map((m) => JSON.parse(m[1]));
}

// En blog/index.html: debe contener tipo "Blog"
const indexHtml = fs.readFileSync(path.join(root, "blog/index.html"), "utf8");
const indexJsonLd = parseJsonLd(indexHtml);
const blogEntry = indexJsonLd.flatMap((b) => b["@graph"] || [b]).find((item) => item["@type"] === "Blog");
assert.ok(blogEntry, "blog/index.html must have Blog in JSON-LD");
assert.equal(blogEntry["@id"], "https://pyme360.online/blog/#blog");

// En blog/plantilla.html: debe contener "BlogPosting" con author tipo "Person"
const templateHtml = fs.readFileSync(path.join(root, "blog/plantilla.html"), "utf8");
const templateJsonLd = parseJsonLd(templateHtml);
const postEntry = templateJsonLd.flatMap((b) => b["@graph"] || [b]).find((item) => item["@type"] === "BlogPosting");
assert.ok(postEntry, "blog/plantilla.html must have BlogPosting in JSON-LD");
assert.equal(postEntry.author["@type"], "Person");
assert.equal(postEntry.author.name, "Theo Rubio");

// 3. Presencia de URL del blog en sitemap.xml y llms.txt
for (const base of [root, path.join(root, "public")]) {
  const sitemap = fs.readFileSync(path.join(base, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/blog\/<\/loc>/);

  const llms = fs.readFileSync(path.join(base, "llms.txt"), "utf8");
  assert.match(llms, /## Blog/);
  assert.match(llms, /https:\/\/pyme360\.online\/blog\//);
}

// 4. Enlace "Blog" en la navegación de Home, Precios y Alojamientos
const navPages = [
  "index.html",
  "precios.html",
  "alojamientos-rurales/index.html",
  "public/index.html",
  "public/precios.html",
  "public/alojamientos-rurales/index.html"
];

for (const rel of navPages) {
  const html = fs.readFileSync(path.join(root, rel), "utf8");
  assert.match(html, /<a [^>]*href="(?:\/)?blog\/"[^>]*>Blog<\/a>/, `${rel} must contain link to Blog in navigation/footer`);
}

console.log("blog tests passed");

