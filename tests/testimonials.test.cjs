const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.js"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const publicScript = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.js"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");

// Paridad estricta raíz <-> public
assert.equal(html, publicHtml, "index.html must match public/index.html byte for byte");
assert.equal(script, publicScript, "pyme360-public.js must match public/assets/pyme360-public.js byte for byte");
assert.equal(styles, publicStyles, "pyme360-public.css must match public/assets/pyme360-public.css byte for byte");

const sandbox = {
  HTMLAnchorElement: function HTMLAnchorElement() {},
  FormData: function FormData() {},
  window: {},
  console,
  document: {
    querySelector() {
      return null;
    }
  }
};

vm.createContext(sandbox);
vm.runInContext(script, sandbox);

// Proyectos propios confirmados (§15.3)
const expectedProjects = ["Home4Escape", "Nomads Jungle", "Diario de Abordo", "Roam Retreats"];
assert.equal(Array.isArray(sandbox.window.pyme360Testimonials), true);
assert.equal(sandbox.window.pyme360Testimonials.length, 4);
assert.equal(
  JSON.stringify(sandbox.window.pyme360Testimonials.map((p) => p.author)),
  JSON.stringify(expectedProjects)
);

// Proyectos retirados sin clientes verificados: Cafetería Brisa, Hotel Rural El Mirador, Isla Norte Tours
const bannedExamples = ["Cafetería Brisa", "Hotel Rural El Mirador", "Isla Norte Tours"];
for (const banned of bannedExamples) {
  assert.equal(html.includes(banned), false, `html must not include unverified client '${banned}'`);
  assert.equal(publicHtml.includes(banned), false, `publicHtml must not include unverified client '${banned}'`);
  assert.equal(script.includes(banned), false, `script must not include unverified client '${banned}'`);
  assert.equal(publicScript.includes(banned), false, `publicScript must not include unverified client '${banned}'`);
}

// Comprobación de sección y enlaces oficiales con rel="noopener"
assert.match(html, /<section id="casos" class="testimonials section"/);
assert.match(html, /Trabajo real, en negocios reales/);
assert.match(html, /Proyectos propios/);

const expectedUrls = [
  "https://www.home4escape.com/",
  "https://nomadsjungle.com/",
  "https://diariodeabordo.es/",
  "https://roamretreats.es/"
];

for (const url of expectedUrls) {
  assert.match(html, new RegExp(`href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*rel="noopener"`));
}

// Estilos de proyectos propios presentes
assert.match(styles, /\.projects-grid/);
assert.match(styles, /\.project-card/);
assert.match(styles, /\.project-badge/);


// Clientes confirmados (§15.3)
assert.match(html, /Equalis Consultoría Canaria/);
assert.match(html, /Aceviños Jardinería/);
assert.match(html, /href="https:\/\/www\.equalisconsultoriacanaria\.es\/"[^>]*rel="noopener"/);
assert.match(html, /href="https:\/\/acevinosjardineria\.com\/"[^>]*rel="noopener"/);
assert.equal(Array.isArray(sandbox.window.pyme360Clients), true);
assert.equal(sandbox.window.pyme360Clients.length, 2);

console.log("testimonial tests passed");
