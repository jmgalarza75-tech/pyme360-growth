const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const logo = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-logo.svg"), "utf8");
const publicLogo = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-logo.svg"), "utf8");

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<img class="brand-logo" src="assets\/pyme360-logo\.svg" alt="Pyme360">/);
  assert.equal(html.includes('<span class="brand-mark">P360</span>'), false);
}

for (const svg of [logo, publicLogo]) {
  assert.match(svg, /PYME/);
  assert.match(svg, /360/);
  assert.match(svg, /TU PRESENCIA DIGITAL, EN BUENAS MANOS/);
}

console.log("logo tests passed");
