const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.js"), "utf8");

const sandbox = {
  HTMLAnchorElement: function HTMLAnchorElement() {},
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

assert.equal(typeof sandbox.window.pyme360BuildLeadPayload, "function");

const payload = sandbox.window.pyme360BuildLeadPayload({
  name: "Maria Garcia",
  email: "maria@example.com",
  phone: "+34 600 000 000",
  business: "Restaurante La Terraza",
  sector: "Restaurante",
  location: "Tenerife",
  problem: "No llegan reservas desde la web"
});

const expectedPayload = {
  name: "Maria Garcia",
  email: "maria@example.com",
  phone: "+34 600 000 000",
  business_name: "Restaurante La Terraza",
  sector: "Restaurante",
  location: "Tenerife",
  objetivo: "",
  presupuesto: "",
  problem: "No llegan reservas desde la web"
};

assert.equal(JSON.stringify(payload), JSON.stringify(expectedPayload));

console.log("form-submit tests passed");

assert.equal(typeof sandbox.window.pyme360PrefillLeadFormFromUrl, "function");
