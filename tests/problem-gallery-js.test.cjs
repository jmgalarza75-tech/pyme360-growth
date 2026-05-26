const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const script = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.js"), "utf8");
const publicScript = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.js"), "utf8");

for (const js of [script, publicScript]) {
  assert.match(js, /document\.querySelectorAll\("\[data-problem-card\]"\)/);
  assert.match(js, /function updateProblemGallery\(activeIndex\)/);
  assert.match(js, /problemPrev\.addEventListener\("click"/);
  assert.match(js, /problemNext\.addEventListener\("click"/);
  assert.match(js, /window\.addEventListener\("scroll"/);
  assert.match(js, /"is-active", "is-right", "is-back", "is-left"/);
}

console.log("problem gallery js tests passed");
