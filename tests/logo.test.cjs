const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");

const logoPath = path.join(__dirname, "..", "assets", "lgo.png");
const publicLogoPath = path.join(__dirname, "..", "public", "assets", "lgo.png");

assert.equal(fs.existsSync(logoPath), true);
assert.equal(fs.existsSync(publicLogoPath), true);

for (const p of [html, publicHtml]) {
  assert.match(p, /<img class="brand-logo" src="assets\/lgo\.png"/);
}

console.log("logo tests passed");
