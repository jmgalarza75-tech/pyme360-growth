const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");

assert.equal(
  styles.includes("/* Pyme360 rural: reset movil fluido */"),
  true,
  "missing final fluid mobile reset"
);

assert.match(
  styles,
  /@media \(max-width: 640px\) \{[\s\S]*\.indice-page \.hero-copy,[\s\S]*\.indice-page \.module-grid article[\s\S]*width: 100% !important;[\s\S]*max-width: min\(100%, 342px\) !important;[\s\S]*margin-right: auto !important;[\s\S]*margin-left: auto !important;/,
  "mobile content blocks should be fluid, capped, and centered"
);

assert.doesNotMatch(
  styles,
  /\/\* Pyme360 rural: reset movil fluido \*\/[\s\S]*width: 300px !important;/,
  "final mobile reset must not reintroduce fixed 300px blocks"
);

assert.match(
  styles,
  /\.indice-page \.hero-lede\s*\{[\s\S]*font-size: 16px !important;[\s\S]*line-height: 1\.5 !important;/,
  "mobile hero copy should be compact enough for the first viewport"
);

console.log("rural mobile layout tests passed");
