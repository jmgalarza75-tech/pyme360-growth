const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.js"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");

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

assert.equal(Array.isArray(sandbox.window.pyme360Testimonials), true);
assert.equal(sandbox.window.pyme360Testimonials.length, 3);
assert.equal(
  JSON.stringify(sandbox.window.pyme360Testimonials.map((testimonial) => testimonial.author)),
  JSON.stringify(["Home4Escape", "Nomads Jungle", "Cafeteria Brisa"])
);
assert.equal(typeof sandbox.window.pyme360RotateTestimonials, "function");

const rotated = sandbox.window.pyme360RotateTestimonials([
  { author: "A" },
  { author: "B" },
  { author: "C" }
]);

assert.equal(JSON.stringify(rotated.map((testimonial) => testimonial.author)), JSON.stringify(["B", "C", "A"]));
assert.equal(styles.includes("background: #0f172a;"), true);
assert.equal(styles.includes("filter: blur(7px);"), true);
assert.equal(styles.includes("min-height: 620px;"), true);

console.log("testimonial tests passed");
