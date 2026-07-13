const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const manifest = fs.readFileSync(path.join(__dirname, "..", "site.webmanifest"), "utf8");
const publicManifest = fs.readFileSync(path.join(__dirname, "..", "public", "site.webmanifest"), "utf8");

for (const m of [manifest, publicManifest]) {
  assert.match(m, /"src": "assets\/favicon\.png"/);
}

for (const h of [html, publicHtml]) {
  assert.match(h, /<link rel="icon" type="image\/png" href="assets\/favicon\.png">/);
}

for (const iconPath of [
  path.join(__dirname, "..", "assets", "favicon.png"),
  path.join(__dirname, "..", "public", "assets", "favicon.png")
]) {
  assert.equal(fs.existsSync(iconPath), true);
}

console.log("favicon tests passed");
