const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const rootJs = fs.readFileSync(path.join(root, "assets", "pyme360-public.js"), "utf8");
const publicJs = fs.readFileSync(path.join(root, "public", "assets", "pyme360-public.js"), "utf8");

assert.equal(rootJs, publicJs, "The public and source analytics JS must stay identical");
assert.match(rootJs, /pyme360Track\("cta_click"/);
assert.match(rootJs, /pyme360Track\("form_start"/);
assert.match(rootJs, /pyme360Track\("generate_lead"/);
assert.match(rootJs, /form_name: "diagnostico_gratuito"/);
assert.doesNotMatch(rootJs, /gtag\([^;]+(email|phone|business_name|location)/i);

for (const relative of ["lead_magnet.html", "public/lead_magnet.html", "propuesta.html", "public/propuesta.html"]) {
  const html = fs.readFileSync(path.join(root, relative), "utf8");
  assert.doesNotMatch(html, /gtag\([^;]+(business_name|location['\"]\s*:|budget['\"]\s*:)/is);
}

console.log("analytics event contract passed");
