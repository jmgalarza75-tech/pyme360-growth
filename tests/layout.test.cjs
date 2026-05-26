const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");

assert.equal(styles.includes("--page-gutter: clamp(28px, 8vw, 140px);"), true);
assert.match(styles, /\.site-header\s*{[\s\S]*padding: 18px var\(--page-gutter\);/);
assert.match(styles, /\.section\s*{[\s\S]*padding: clamp\(72px, 9vw, 126px\) var\(--page-gutter\);/);
assert.match(styles, /\.site-footer\s*{[\s\S]*padding: 28px var\(--page-gutter\);/);
assert.match(styles, /\.authority\s*{[\s\S]*grid-template-columns: minmax\(0, 760px\) minmax\(320px, 620px\);[\s\S]*justify-content: center;/);
assert.match(styles, /\.sectors \.section-heading,\s*\.sector-list\s*{[\s\S]*max-width: 1500px;[\s\S]*margin-right: auto;[\s\S]*margin-left: auto;/);

console.log("layout tests passed");
