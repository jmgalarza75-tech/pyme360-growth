const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<span class="score-value" aria-label="Oportunidad estimada 31%, al pasar por encima sube a 60% y 90%">/);
  assert.match(html, /<span class="score-default">31%<\/span>/);
  assert.match(html, /<span class="score-mid">60%<\/span>/);
  assert.match(html, /<span class="score-high">90%<\/span>/);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.score-default,/);
  assert.match(css, /\.score-mid,/);
  assert.match(css, /\.score-high\s*{/);
  assert.match(css, /\.hero-panel:hover \.score-ring/);
  assert.match(css, /animation: scoreRingCycle/);
  assert.match(css, /#ef4444/);
  assert.match(css, /#f59e0b/);
  assert.match(css, /#2fbf71/);
}

console.log("hero panel hover tests passed");
