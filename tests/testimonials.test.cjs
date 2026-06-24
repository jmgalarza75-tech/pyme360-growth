const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.js"), "utf8");
const styles = fs.readFileSync(path.join(__dirname, "..", "assets", "pyme360-public.css"), "utf8");
const publicHtml = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const publicScript = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.js"), "utf8");
const publicStyles = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "pyme360-public.css"), "utf8");

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
assert.equal(sandbox.window.pyme360Testimonials.length, 5);
assert.equal(
  JSON.stringify(sandbox.window.pyme360Testimonials.map((testimonial) => testimonial.author)),
  JSON.stringify(["Home4Escape", "Nomads Jungle", "Cafetería Brisa", "Hotel Rural El Mirador", "Isla Norte Tours"])
);
assert.equal(typeof sandbox.window.pyme360RotateTestimonials, "function");
assert.equal(sandbox.window.pyme360Testimonials[0].quote.includes("ayudó"), true);
assert.equal(sandbox.window.pyme360Testimonials[0].quote.includes("captación"), true);
assert.equal(sandbox.window.pyme360Testimonials[0].quote.includes("presencia digital"), true);

const rotated = sandbox.window.pyme360RotateTestimonials([
  { author: "A" },
  { author: "B" },
  { author: "C" }
]);

assert.equal(JSON.stringify(rotated.map((testimonial) => testimonial.author)), JSON.stringify(["B", "C", "A"]));
assert.equal(styles.includes("background: #0f172a;"), true);
assert.equal(styles.includes(".testimonial-logo"), true);
assert.equal(styles.includes(".testimonial-card::before"), true);
assert.equal(styles.includes("mix-blend-mode: screen;"), true);
assert.equal(styles.includes(".testimonial-card.is-front:hover"), true);
assert.equal(styles.includes("filter: blur(3px);"), true);
assert.equal(styles.includes("min-height: 560px;"), true);
assert.match(styles, /@media \(max-width: 620px\)[\s\S]*overflow-x: auto;/);
assert.match(styles, /@media \(max-width: 620px\)[\s\S]*scroll-snap-type: x mandatory;/);
assert.match(styles, /@media \(max-width: 620px\)[\s\S]*scroll-padding-inline: 18px;/);
assert.match(styles, /@media \(max-width: 620px\)[\s\S]*scroll-snap-align: center;/);
assert.match(styles, /@media \(max-width: 620px\)[\s\S]*\.testimonial-card\.is-front,\s*\.testimonial-card\.is-middle,\s*\.testimonial-card\.is-back,\s*\.testimonial-card\.is-far,\s*\.testimonial-card\.is-tail\s*{[\s\S]*transform: none;/);
assert.match(styles, /@media \(max-width: 620px\)[\s\S]*\.testimonial-card\.is-middle \.testimonial-logo,[\s\S]*\.testimonial-card\.is-tail blockquote\s*{[\s\S]*filter: none;/);
assert.equal(script.includes("pravatar"), false);
assert.equal(script.includes("images.unsplash.com"), false);
assert.equal(script.includes("Cafetería Brisa"), true);
assert.equal(script.includes("Hotel Rural El Mirador"), true);
assert.equal(script.includes("Isla Norte Tours"), true);
assert.equal(script.includes("ayudó"), true);
assert.equal(script.includes("captación"), true);
assert.equal(script.includes("temporada baja"), true);
assert.equal(script.includes("Servicios turísticos"), true);
assert.equal(script.includes("function isMobileTestimonialsLayout"), true);
assert.equal(script.includes("function scrollToNextTestimonial"), true);
assert.equal(script.includes("scrollTo({"), true);
assert.equal(publicHtml.includes("testimonial-stage"), true);
assert.equal(publicHtml.includes("ayudó"), true);
assert.equal(publicHtml.includes("Cafetería Brisa"), true);
assert.equal(publicStyles.includes(".testimonial-card"), true);
assert.equal(publicStyles.includes(".testimonial-logo"), true);
assert.equal(publicStyles.includes(".testimonial-card::before"), true);
assert.equal(publicStyles.includes("scroll-snap-type: x mandatory;"), true);
assert.equal(publicScript.includes("pyme360Testimonials"), true);
assert.equal(publicScript.includes("scrollToNextTestimonial"), true);
assert.equal(publicScript.includes("Cafetería Brisa"), true);
assert.equal(publicScript.includes("Hotel Rural El Mirador"), true);
assert.equal(publicScript.includes("Isla Norte Tours"), true);
assert.equal(publicScript.includes("pravatar"), false);
assert.equal(publicScript.includes("images.unsplash.com"), false);

console.log("testimonial tests passed");
