const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const pages = [
  path.join(__dirname, "..", "index.html"),
  path.join(__dirname, "..", "precios.html"),
  path.join(__dirname, "..", "public", "index.html"),
  path.join(__dirname, "..", "public", "precios.html")
];

for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="assets\/pyme360-favicon\.svg">/);
}

for (const iconPath of [
  path.join(__dirname, "..", "assets", "pyme360-favicon.svg"),
  path.join(__dirname, "..", "public", "assets", "pyme360-favicon.svg")
]) {
  const svg = fs.readFileSync(iconPath, "utf8");
  assert.match(svg, /<svg[^>]+viewBox="0 0 128 128"/);
  assert.match(svg, /Pyme360/);
  assert.match(svg, />360<\/text>/);
  assert.equal(svg.includes("<script"), false);
}

console.log("favicon tests passed");
