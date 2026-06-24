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
  assert.match(css, /\.process-orbit-core\s*{[\s\S]*left: 50%;[\s\S]*top: 50%;/);
  assert.match(css, /transform: translate\(92px, -142px\);/);
  assert.match(css, /@keyframes processOrbitSpin/);
  assert.match(css, /@media \(max-width: 760px\)/);
}

for (const js of [script, publicScript]) {
  assert.match(js, /\[data-process-node\]/);
  assert.match(js, /\[data-process-detail\]/);
  assert.match(js, /function updateProcessOrbit/);
  assert.match(js, /const PROCESS_ORBIT_ROTATION_MS = 3500;/);
  assert.match(js, /function getActiveProcessIndex/);
  assert.match(js, /function showNextProcessOrbitNode/);
  assert.match(js, /function startProcessOrbitRotation/);
  assert.match(js, /function stopProcessOrbitRotation/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /setInterval\(showNextProcessOrbitNode, PROCESS_ORBIT_ROTATION_MS\)/);
  assert.match(js, /addEventListener\("mouseenter", stopProcessOrbitRotation\)/);
  assert.match(js, /addEventListener\("mouseleave", startProcessOrbitRotation\)/);
  assert.match(js, /addEventListener\("focusin", stopProcessOrbitRotation\)/);
  assert.match(js, /addEventListener\("focusout", startProcessOrbitRotation\)/);
  assert.match(js, /stopProcessOrbitRotation\(\);\s*updateProcessOrbit\(node\);\s*startProcessOrbitRotation\(\);/);
  assert.doesNotMatch(js, /from "react"|lucide-react|useState|useEffect/);
}

console.log("process orbit tests passed");
