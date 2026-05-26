const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pages = [
  {
    file: path.join(root, "index.html"),
    url: "https://pyme360.online/",
    title: "Pyme360 | Marketing claro para pymes que quieren mas clientes"
  },
  {
    file: path.join(root, "precios.html"),
    url: "https://pyme360.online/precios.html",
    title: "Precios Pyme360 | Planes de crecimiento para pymes"
  },
  {
    file: path.join(root, "public", "index.html"),
    url: "https://pyme360.online/",
    title: "Pyme360 | Marketing claro para pymes que quieren mas clientes"
  },
  {
    file: path.join(root, "public", "precios.html"),
    url: "https://pyme360.online/precios.html",
    title: "Precios Pyme360 | Planes de crecimiento para pymes"
  }
];

for (const page of pages) {
  const html = fs.readFileSync(page.file, "utf8");

  assert.match(html, new RegExp(`<link rel="canonical" href="${page.url.replace(/\./g, "\\.")}">`));
  assert.match(html, /<meta name="robots" content="index, follow">/);
  assert.match(html, /<meta name="theme-color" content="#071310">/);
  assert.match(html, /<link rel="manifest" href="site\.webmanifest">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta property="og:site_name" content="Pyme360">/);
  assert.match(html, new RegExp(`<meta property="og:url" content="${page.url.replace(/\./g, "\\.")}">`));
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<script type="application\/ld\+json">[\s\S]*"name": "Pyme360"[\s\S]*<\/script>/);
  assert.match(html, /rel="preconnect" href="https:\/\/images\.unsplash\.com"/);
  assert.doesNotMatch(html, /\u00c3|\u00e2|\u20ac|&euro;/);
}

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const publicIndexHtml = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");

for (const html of [indexHtml, publicIndexHtml]) {
  const imageTags = html.match(/<img src="https:\/\/images\.unsplash\.com[^>]+>/g) || [];
  assert.equal(imageTags.length, 4);
  for (const tag of imageTags) {
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
    assert.match(tag, /decoding="async"/);
    assert.match(tag, /referrerpolicy="no-referrer"/);
  }
  assert.match(imageTags[0], /fetchpriority="high"/);
  for (const tag of imageTags.slice(1)) {
    assert.match(tag, /loading="lazy"/);
  }
}

for (const base of [root, path.join(root, "public")]) {
  const robots = fs.readFileSync(path.join(base, "robots.txt"), "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/pyme360\.online\/sitemap\.xml/);

  const sitemap = fs.readFileSync(path.join(base, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pyme360\.online\/precios\.html<\/loc>/);

  const manifest = fs.readFileSync(path.join(base, "site.webmanifest"), "utf8");
  const manifestJson = JSON.parse(manifest);
  assert.equal(manifestJson.name, "Pyme360");
  assert.equal(manifestJson.start_url, "/");
  assert.equal(manifestJson.theme_color, "#071310");
}

console.log("seo performance tests passed");
