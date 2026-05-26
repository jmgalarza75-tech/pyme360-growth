const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<form class="lead-form lead-form-premium"/);
  assert.match(html, /<span class="field-icon" aria-hidden="true">/);
  assert.match(html, /<select name="sector" required>/);
  assert.match(html, /<span class="select-arrow" aria-hidden="true">/);
  assert.match(html, /Sin spam\. Sin compromiso\. Respuesta clara/);
  assert.match(html, /pyme360-public\.css\?v=20260526-2/);
  assert.match(html, /pyme360-public\.js\?v=20260526-2/);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.lead-form-premium\s*{/);
  assert.match(css, /\.field-control\s*{/);
  assert.match(css, /\.field-icon\s*{/);
  assert.match(css, /\.lead-form-premium select/);
  assert.match(css, /appearance: none;/);
  assert.match(css, /\.select-arrow\s*{/);
  assert.match(css, /\.lead-form-premium \.button-primary\s*{/);
}

console.log("premium form tests passed");
