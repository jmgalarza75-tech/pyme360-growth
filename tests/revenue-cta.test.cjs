const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const formBase = "https://www.home4escape.com/contactar/";
const approvedCopy = "¿Quieres revisar tus precios, temporadas y rentabilidad?";
const approvedSupport = "el equipo especializado en estrategia comercial y revenue management para alojamientos.";

const revenueArticles = {
  "la-falacia-del-85-por-ciento-ocupacion": "r01",
  "trampa-bajar-precios-temporada-baja": "r04",
  "control-costes-hotel-rural": "r05"
};

for (const [slug, contentId] of Object.entries(revenueArticles)) {
  const sourcePath = path.join(root, "blog", slug, "index.html");
  const publicPath = path.join(root, "public", "blog", slug, "index.html");
  const html = fs.readFileSync(sourcePath, "utf8");
  const publicHtml = fs.readFileSync(publicPath, "utf8");

  assert.equal(html, publicHtml, `${slug} must match its public mirror byte for byte`);
  const trackedForm = `${formBase}?utm_source=pyme360&amp;utm_medium=referral&amp;utm_campaign=revenue_content&amp;utm_content=${contentId}`;
  assert.ok(html.includes(trackedForm), `${slug} must link to the tracked Home4Escape contact form`);
  assert.match(html, new RegExp(approvedCopy), `${slug} must contain the approved CTA question`);
  assert.match(html, new RegExp(approvedSupport), `${slug} must explain the Home4Escape service boundary`);
  assert.match(html, /https:\/\/pyme360\.online\/alojamientos-rurales\//, `${slug} must retain the Pyme360 rural review CTA`);
  assert.doesNotMatch(html, /"serviceType"\s*:\s*"?revenue management/i, `${slug} must not mark revenue as a Pyme360 service`);
}

console.log("Revenue CTA contract passed for R01, R04 and R05");
