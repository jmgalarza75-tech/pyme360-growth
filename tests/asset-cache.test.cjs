const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");

for (const html of [rootHtml, publicHtml]) {
  assert.match(html, /href="assets\/pyme360-public\.css\?v=\d{8}-\d+"/);
  assert.match(html, /src="assets\/pyme360-public\.js\?v=\d{8}-\d+"/);
}

console.log("asset cache tests passed");
