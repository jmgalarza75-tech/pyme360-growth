const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "..", "public", "indice-pyme360", "index.html"), "utf8");
const ruralHtml = fs.readFileSync(path.join(__dirname, "..", "public", "alojamientos-rurales", "index.html"), "utf8");
const legacyPath = path.join(__dirname, "..", "public", "indice-pyme360.html");
const script = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "indice-pyme360.js"), "utf8");

assert.match(html, /Te ayudamos a conseguir más reservas directas/, "hero should explain the outcome in plain owner language");
assert.match(html, /Miramos tu web, Google y canales como Booking/, "hero should say plainly what Pyme360 reviews");
assert.match(html, /hotel-hero-panel/, "landing should include hotel-specific framed visual hero");
assert.match(html, /hotel-signal-strip/, "landing should include hotel-specific signal cards");
assert.match(html, /Casa tradicional canaria de La Orotava/, "landing should use rural Canarian hotel imagery, not generic resort imagery");
assert.match(html, /\.\.\/assets\/indice\/hotel-rural-canario\.jpg/, "landing should load the local rural Canarian hotel image asset");
assert.match(html, /rel="canonical" href="https:\/\/pyme360\.online\/indice-pyme360\/"/, "clean landing should declare canonical clean URL");
assert.match(ruralHtml, /rel="canonical" href="https:\/\/pyme360\.online\/alojamientos-rurales\/"/, "rural landing should declare commercial SEO canonical URL");
assert.match(ruralHtml, /<title>Más reservas directas para casas rurales \| Pyme360 Growth<\/title>/, "rural landing should use plain segment-specific SEO title");
assert.match(ruralHtml, /Quiero que miren mi alojamiento/, "primary CTA should be understandable for a rural accommodation owner");
assert.doesNotMatch(ruralHtml, /FARO|Home4Escape|Separación clara/, "public rural landing should not expose internal brand architecture jargon");
assert.match(ruralHtml, /sin palabras raras ni informes eternos/, "authority proof should use plain owner language");
assert.match(html, /src="\.\.\/assets\/indice-pyme360\.js\?v=\d{8}-\d+"/, "clean landing should version its JS asset with nested path");
assert.match(html, /href="\.\.\/assets\/pyme360-public\.css\?v=\d{8}-\d+"/, "clean landing should load shared CSS with nested path");
assert.match(html, /href="\.\.\/index\.html"/, "clean landing should link back to home from nested route");
assert.equal(fs.existsSync(legacyPath), false, "legacy .html landing should not exist because it was never uploaded");
assert.match(html, /name="newsletter" type="checkbox" value="yes"/, "newsletter must be an independent checkbox");
assert.match(html, /name="privacy" type="checkbox"/, "privacy acceptance is required separately from newsletter");
assert.match(html, /name="web" type="text" inputmode="url" autocomplete="url"/, "web field should accept plain domains without browser URL validation error");
assert.doesNotMatch(html, /name="web" type="url"/, "web field must not force protocol via native browser validation");
assert.match(html, /name="units"/);

const sandbox = {
  HTMLAnchorElement: function HTMLAnchorElement() {},
  HTMLInputElement: function HTMLInputElement() {},
  HTMLTextAreaElement: function HTMLTextAreaElement() {},
  HTMLSelectElement: function HTMLSelectElement() {},
  console,
  window: { location: { search: "" } },
  document: {
    querySelector() { return null; }
  },
  setInterval() { return 1; },
  clearInterval() {}
};

vm.createContext(sandbox);
vm.runInContext(script, sandbox);

assert.equal(sandbox.window.INDICE_LEAD_ENDPOINT, "/procesar-lead.php");
assert.equal(typeof sandbox.window.pyme360BuildIndiceLeadPayload, "function");

const payload = sandbox.window.pyme360BuildIndiceLeadPayload({
  name: "Ana Martín",
  email: "ana@example.com",
  phone: "",
  business: "Casa Rural El Pinar",
  sector: "Casa rural",
  location: "Tenerife",
  web: "https://example.com",
  units: "8",
  problem: "Más reservas directas",
  newsletter: "yes",
  privacy: "yes"
});

assert.equal(JSON.stringify(payload), JSON.stringify({
  name: "Ana Martín",
  email: "ana@example.com",
  phone: "",
  business_name: "Casa Rural El Pinar",
  sector: "Casa rural",
  location: "Tenerife",
  website: "https://example.com",
  units: "8",
  problem: "Más reservas directas",
  source: "indice_pyme360_revision_inicial",
  newsletter_consent: true,
  privacy_consent: true
}));

const plainDomainPayload = sandbox.window.pyme360BuildIndiceLeadPayload({
  name: "Teofila Rubio Perez",
  email: "home4escape@gmail.com",
  business: "33",
  sector: "Casa rural",
  location: "Santa Cruz de Tenerife",
  web: "nomadsjungle.com",
  privacy: "yes"
});
assert.equal(plainDomainPayload.website, "https://nomadsjungle.com", "plain domains should be normalized before submit");

assert.doesNotMatch(script, /SUPABASE_URL|SUPABASE_KEY|rest\/v1\/leads/);
assert.match(script, /fetch\(INDICE_LEAD_ENDPOINT/);

console.log("indice form tests passed");
