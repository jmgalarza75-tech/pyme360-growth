const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");

assert.equal(styles.includes("--page-gutter: clamp(28px, 8vw, 140px);"), true);
assert.match(styles, /\.site-header\s*{[\s\S]*padding: 18px var\(--page-gutter\);/);
assert.match(styles, /\.section\s*{[\s\S]*padding: clamp\(72px, 9vw, 126px\) var\(--page-gutter\);/);
assert.match(styles, /\.site-footer\s*{[\s\S]*padding: 28px var\(--page-gutter\);/);

console.log("layout tests passed");
