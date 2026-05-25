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
  assert.match(html, /<canvas class="hero-shader"/);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.hero-shader\s*{/);
  assert.match(css, /\.hero::before\s*{/);
  assert.match(css, /pointer-events: none;/);
}

for (const js of [script, publicScript]) {
  assert.match(js, /initHeroShader/);
  assert.match(js, /getContext\("webgl"\)/);
  assert.match(js, /iResolution/);
  assert.match(js, /requestAnimationFrame/);
}

console.log("hero shader tests passed");
