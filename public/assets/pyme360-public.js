const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const heroShaderCanvas = document.querySelector(".hero-shader");
const problemCards = typeof document.querySelectorAll === "function"
  ? Array.from(document.querySelectorAll("[data-problem-card]"))
  : [];
const problemPrev = document.querySelector(".problem-prev");
const problemNext = document.querySelector(".problem-next");
const processNodes = typeof document.querySelectorAll === "function"
  ? Array.from(document.querySelectorAll("[data-process-node]"))
  : [];
const processDetail = document.querySelector("[data-process-detail]");
const testimonials = [
  {
    logo: "H4",
    logoClass: "testimonial-logo-home",
    author: "Home4Escape",
    sector: "Hospitality y alquiler vacacional",
    quote: "Pyme360 nos ayudo a ordenar la captacion y convertir la presencia digital en una herramienta comercial, no solo en una web bonita."
  },
  {
    logo: "NJ",
    logoClass: "testimonial-logo-nomads",
    author: "Nomads Jungle",
    sector: "Experiencias y comunidad viajera",
    quote: "Por fin entendimos que acciones priorizar. El diagnostico aterrizo el marketing en decisiones concretas para crecer."
  },
  {
    logo: "CB",
    logoClass: "testimonial-logo-brisa",
    author: "Cafeteria Brisa",
    sector: "Caso tipo de pyme local",
    quote: "Necesitabamos mas clientes locales sin perdernos en tecnicismos. El sistema nos dio foco, seguimiento y una ruta clara."
  }
];

function rotateTestimonials(items) {
  if (items.length < 2) return items;
  return [...items.slice(1), items[0]];
}

function initHeroShader() {
  if (!heroShaderCanvas || !window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const gl = heroShaderCanvas.getContext("webgl");
  if (!gl) return;

  const vertexSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    const float overallSpeed = 0.2;
    const float gridSmoothWidth = 0.015;
    const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
    const float scale = 5.0;
    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.2;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);
      vec4 bgColor1 = vec4(0.03, 0.05, 0.10, 1.0);
      vec4 bgColor2 = vec4(0.23, 0.08, 0.34, 1.0);

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;
        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

        lines += (line + circle) * lineColor * rand;
      }

      vec4 fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor *= verticalFade;
      fragColor.a = 1.0;
      fragColor += lines;

      gl_FragColor = fragColor;
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) return;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    1.0, 1.0
  ]), gl.STATIC_DRAW);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  const resolution = gl.getUniformLocation(shaderProgram, "iResolution");
  const time = gl.getUniformLocation(shaderProgram, "iTime");
  const startTime = Date.now();

  function resizeCanvas() {
    const bounds = heroShaderCanvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    heroShaderCanvas.width = Math.max(1, Math.floor(bounds.width * pixelRatio));
    heroShaderCanvas.height = Math.max(1, Math.floor(bounds.height * pixelRatio));
    gl.viewport(0, 0, heroShaderCanvas.width, heroShaderCanvas.height);
  }

  function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.uniform2f(resolution, heroShaderCanvas.width, heroShaderCanvas.height);
    gl.uniform1f(time, (Date.now() - startTime) / 1000);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(render);
}

initHeroShader();

function updateProblemGallery(activeIndex) {
  if (!problemCards.length) return;

  const positions = ["is-active", "is-right", "is-back", "is-left", "is-hidden"];

  problemCards.forEach((card, index) => {
    card.classList.remove(...positions);
    const positionIndex = (index - activeIndex + problemCards.length) % problemCards.length;
    card.classList.add(positions[positionIndex] || "is-hidden");
  });
}

if (problemCards.length) {
  let activeProblemIndex = 0;

  const showProblem = (direction) => {
    activeProblemIndex = (activeProblemIndex + direction + problemCards.length) % problemCards.length;
    updateProblemGallery(activeProblemIndex);
  };

  if (problemPrev) {
    problemPrev.addEventListener("click", () => showProblem(-1));
  }

  if (problemNext) {
    problemNext.addEventListener("click", () => showProblem(1));
  }

  window.addEventListener("scroll", () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;
    const nextIndex = Math.round((window.scrollY / scrollableHeight) * (problemCards.length - 1));
    if (nextIndex !== activeProblemIndex) {
      activeProblemIndex = nextIndex;
      updateProblemGallery(activeProblemIndex);
    }
  }, { passive: true });
}

function updateProcessOrbit(activeNode) {
  if (!activeNode || !processDetail) return;

  const related = (activeNode.dataset.related || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  processNodes.forEach((node) => {
    const isActive = node === activeNode;
    const isRelated = related.includes(node.dataset.nodeId || "");
    node.classList.toggle("is-active", isActive);
    node.classList.toggle("is-related", !isActive && isRelated);
    node.setAttribute("aria-expanded", String(isActive));
  });

  const title = processDetail.querySelector("[data-process-title]");
  const status = processDetail.querySelector("[data-process-status]");
  const content = processDetail.querySelector("[data-process-content]");
  const energy = processDetail.querySelector("[data-process-energy]");
  const bar = processDetail.querySelector("[data-process-bar]");
  const energyValue = activeNode.dataset.energy || "78";

  if (title) title.textContent = activeNode.dataset.title || "";
  if (status) status.textContent = activeNode.dataset.status || "";
  if (content) content.textContent = activeNode.dataset.content || "";
  if (energy) energy.textContent = `${energyValue}%`;
  if (bar) bar.style.setProperty("--energy", `${energyValue}%`);
}

if (processNodes.length) {
  processNodes.forEach((node) => {
    node.addEventListener("click", () => updateProcessOrbit(node));
  });

  updateProcessOrbit(processNodes.find((node) => node.classList.contains("is-active")) || processNodes[0]);
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const testimonialStage = document.querySelector(".testimonial-stage");
const shuffleButton = document.querySelector(".testimonial-shuffle");
let currentTestimonials = testimonials;

function renderTestimonials() {
  if (!testimonialStage) return;

  const positions = ["front", "middle", "back"];

  testimonialStage.innerHTML = currentTestimonials.map((testimonial, index) => {
    const position = positions[index];
    return `
      <article class="testimonial-card is-${position}" data-position="${position}">
        <span class="testimonial-logo ${testimonial.logoClass}" aria-label="Logo de ${testimonial.author}">${testimonial.logo}</span>
        <blockquote>${testimonial.quote}</blockquote>
        <div><strong>${testimonial.author}</strong><span>${testimonial.sector}</span></div>
      </article>
    `;
  }).join("");
}

function shuffleTestimonials() {
  currentTestimonials = rotateTestimonials(currentTestimonials);
  renderTestimonials();
}

if (testimonialStage) {
  renderTestimonials();

  let dragStartX = 0;

  testimonialStage.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".is-front")) return;
    dragStartX = event.clientX;
  });

  testimonialStage.addEventListener("pointerup", (event) => {
    if (dragStartX - event.clientX > 90) {
      shuffleTestimonials();
    }
    dragStartX = 0;
  });
}

if (shuffleButton) {
  shuffleButton.addEventListener("click", shuffleTestimonials);
}

const leadForm = document.querySelector(".lead-form");
const SUPABASE_URL = "https://veqpsnxqecehdaygycmi.supabase.co";
const SUPABASE_KEY = "sb_publishable_u35aO5iZYVX40r2dB-SekA_1zpOniBw";

function pyme360BuildLeadPayload(values) {
  const business = values.business.trim();
  const location = values.location.trim() || "Sin especificar";
  const phone = values.phone.trim();

  return {
    business_name: business,
    cleaned_name: business,
    email: values.email.trim(),
    mobile_phone: phone,
    phone_number: phone,
    tipo_de_empresa: values.sector.trim(),
    location,
    zona: location,
    critical_errors: {
      source: "web_publica",
      contact_name: values.name.trim(),
      problem: values.problem.trim()
    },
    current_status: "permission_granted",
    form_submitted: false,
    lead_magnet_sent: true,
    outreach_channel: "web_publica",
    channel_used: "email",
    retry_count: 0
  };
}

async function pyme360SubmitLead(payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok && response.status !== 201) {
    throw new Error(await response.text());
  }
}

function pyme360PrefillLeadFormFromUrl(form) {
  const params = new URLSearchParams(window.location.search);
  const values = {
    business: params.get("business") || params.get("negocio"),
    location: params.get("location") || params.get("zona"),
    sector: params.get("sector"),
    name: params.get("name"),
    email: params.get("email"),
    phone: params.get("phone"),
    problem: params.get("problem")
  };

  Object.entries(values).forEach(([name, value]) => {
    if (!value) return;
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      field.value = value;
    }
  });
}
if (typeof window !== "undefined") {
  window.pyme360Testimonials = testimonials;
  window.pyme360RotateTestimonials = rotateTestimonials;
  window.pyme360BuildLeadPayload = pyme360BuildLeadPayload;
  window.pyme360SubmitLead = pyme360SubmitLead;
  window.pyme360PrefillLeadFormFromUrl = pyme360PrefillLeadFormFromUrl;
}

if (leadForm) {
  pyme360PrefillLeadFormFromUrl(leadForm);

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (leadForm.querySelector(".form-success")) {
      return;
    }

    const submitButton = leadForm.querySelector("button[type='submit']");

    if (submitButton) {
      submitButton.textContent = "Enviando solicitud...";
      submitButton.setAttribute("disabled", "true");
    }

    const formData = new FormData(leadForm);
    const payload = pyme360BuildLeadPayload({
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      business: formData.get("business") || "",
      sector: formData.get("sector") || "",
      location: formData.get("location") || "",
      problem: formData.get("problem") || ""
    });

    try {
      await pyme360SubmitLead(payload);

      if (submitButton) {
        submitButton.textContent = "Solicitud recibida";
      }

      leadForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-success form-wide" role="status">Gracias. Hemos recibido tu solicitud de diagnostico y te contactaremos para preparar la revision.</p>'
      );
    } catch (error) {
      console.error(error);

      if (submitButton) {
        submitButton.textContent = "Quiero mi diagnostico gratuito";
        submitButton.removeAttribute("disabled");
      }

      leadForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-error form-wide" role="alert">No hemos podido enviar la solicitud. Escribenos a hola@home4escape.com y revisamos tu diagnostico.</p>'
      );
    }
  });
}
