const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.js"), "utf8");
const publicScript = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.js"), "utf8");

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /class="process process-orbit section"/);
  assert.match(html, /Un sistema que convierte diagn&oacute;stico en acci&oacute;n/);
  assert.match(html, /Pyme360 Growth System/);
  assert.match(html, /data-process-orbit/);
  assert.match(html, /data-process-node/);
  assert.match(html, /data-process-detail/);
  assert.match(html, /Diagn&oacute;stico/);
  assert.match(html, /Fugas/);
  assert.match(html, /Prioridad/);
  assert.match(html, /Ejecuci&oacute;n/);
  assert.match(html, /Medici&oacute;n/);
  assert.doesNotMatch(html, /class="timeline"/);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.process-orbit-stage/);
  assert.match(css, /\.process-orbit-node/);
  assert.match(css, /\.process-orbit-detail/);
  assert.match(css, /@keyframes processOrbitSpin/);
  assert.match(css, /@media \(max-width: 760px\)/);
}

for (const js of [script, publicScript]) {
  assert.match(js, /\[data-process-node\]/);
  assert.match(js, /\[data-process-detail\]/);
  assert.match(js, /function updateProcessOrbit/);
  assert.doesNotMatch(js, /from "react"|lucide-react|useState|useEffect/);
}

console.log("process orbit tests passed");
