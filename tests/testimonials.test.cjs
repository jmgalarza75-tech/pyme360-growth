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

// Proyectos propios confirmados en JS
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

// A petición de usuario: Casos reales retirados de index.html
assert.equal(html.includes('<section id="casos"'), false, "index.html must not include #casos section");
assert.equal(publicHtml.includes('<section id="casos"'), false, "public/index.html must not include #casos section");
assert.equal(html.includes('href="#casos"'), false, "index.html nav must not link to #casos");

// A petición de usuario: Pestaña con formulario de contacto que cumpla LOPD
const contactoPath = path.join(__dirname, "..", "contacto.html");
const publicContactoPath = path.join(__dirname, "..", "public", "contacto.html");
assert.equal(fs.existsSync(contactoPath), true, "contacto.html must exist");
assert.equal(fs.existsSync(publicContactoPath), true, "public/contacto.html must exist");

const contactoHtml = fs.readFileSync(contactoPath, "utf8");
const publicContactoHtml = fs.readFileSync(publicContactoPath, "utf8");
assert.equal(contactoHtml, publicContactoHtml, "contacto.html must match public/contacto.html byte for byte");

// Verificación de formulario de contacto y cumplimiento estricto LOPD/RGPD
assert.match(contactoHtml, /<form class="lead-form lead-form-premium contact-form"/);
assert.match(contactoHtml, /action="\/procesar-lead\.php"/);
assert.match(contactoHtml, /name="name"[^>]*required/);
assert.match(contactoHtml, /name="email"[^>]*required/);
assert.match(contactoHtml, /name="phone"[^>]*required/);
assert.match(contactoHtml, /name="business"[^>]*required/);
assert.match(contactoHtml, /name="problem"[^>]*required/);

// Primera capa informativa LOPD/RGPD visible
assert.match(contactoHtml, /Información básica sobre protección de datos/);
assert.match(contactoHtml, /Responsable:/);
assert.match(contactoHtml, /Finalidad:/);
assert.match(contactoHtml, /Legitimación:/);
assert.match(contactoHtml, /Derechos:/);

// Checkbox obligatorio de aceptación de política de privacidad
assert.match(contactoHtml, /<input type="checkbox" name="privacy" required>/);
assert.match(contactoHtml, /href="privacidad\.html"/);

// Navegación incluye Contacto
assert.match(html, /<a href="contacto\.html">Contacto<\/a>/);
assert.match(contactoHtml, /<a href="contacto\.html" aria-current="page">Contacto<\/a>/);

console.log("testimonial and contact tests passed");
