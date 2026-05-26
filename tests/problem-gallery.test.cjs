const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /<section class="problem section" aria-labelledby="problem-title">/);
  assert.match(html, /<div class="problem-gallery-shell">/);
  assert.match(html, /<div class="problem-gallery" aria-label="Galeria circular de problemas digitales">/);
  assert.match(html, /class="problem-nav problem-prev"/);
  assert.match(html, /class="problem-nav problem-next"/);
  assert.equal((html.match(/class="problem-card/g) || []).length, 4);
  assert.equal((html.match(/data-problem-card/g) || []).length, 4);
  assert.equal((html.match(/<img src="https:\/\/images\.unsplash\.com/g) || []).length, 4);
  assert.equal(html.includes("problem-grid"), false);
}

for (const css of [styles, publicStyles]) {
  assert.match(css, /\.problem-gallery-shell\s*{[\s\S]*perspective: 2200px;/);
  assert.match(css, /\.problem-card\s*{[\s\S]*transform-style: preserve-3d;/);
  assert.match(css, /\.problem-card\.is-active/);
  assert.match(css, /\.problem-card\.is-left/);
  assert.match(css, /\.problem-card\.is-right/);
  assert.match(css, /\.problem-nav:hover/);
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*\.problem-gallery\s*{[\s\S]*grid-template-columns: 1fr;/);
}

console.log("problem gallery tests passed");
