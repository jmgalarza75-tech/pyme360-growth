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
const processOrbitStage = document.querySelector("[data-process-orbit]");
const processDetail = document.querySelector("[data-process-detail]");
const PROCESS_ORBIT_ROTATION_MS = 3500;
let processOrbitTimer = null;

const clients = [
  {
    logo: "assets/logos/equalis_blanco.png",
    logoImg: "assets/logos/equalis_blanco.png",
    logoClass: "testimonial-logo-equalis",
    author: "Equalis Consultoría Canaria",
    url: "https://www.equalisconsultoriacanaria.es/",
    type: "Cliente",
    sector: "Consultoría de igualdad y formación en Canarias",
    services: ["Diseño web", "SEO local", "Google Ads"]
  },
  {
    logo: "assets/logos/acevinos.png",
    logoImg: "assets/logos/acevinos.png",
    logoClass: "testimonial-logo-acevinos",
    author: "Aceviños Jardinería",
    url: "https://acevinosjardineria.com/",
    type: "Cliente",
    sector: "Césped artificial y jardinería en Tenerife",
    services: ["Diseño web", "SEO local", "Google Ads"]
  }
];

const testimonials = [
  {
    logo: "assets/logos/home4escape.png",
    logoImg: "assets/logos/home4escape.png",
    logoClass: "testimonial-logo-home",
    author: "Home4Escape",
    url: "https://www.home4escape.com/",
    type: "Proyecto propio",
    sector: "Alquiler vacacional de villas y casas rurales en Canarias"
  },
  {
    logo: "assets/logos/nomadsjungle.png",
    logoImg: "assets/logos/nomadsjungle.png",
    logoClass: "testimonial-logo-nomads",
    author: "Nomads Jungle",
    url: "https://nomadsjungle.com/",
    type: "Proyecto propio",
    sector: "Vivienda profesional por temporada en Canarias"
  },
  {
    logo: "assets/logos/diariodeabordo.svg",
    logoImg: "assets/logos/diariodeabordo.svg",
    logoClass: "testimonial-logo-diario",
    author: "Diario de Abordo",
    url: "https://diariodeabordo.es/",
    type: "Proyecto propio",
    sector: "Blog y newsletter sobre crecimiento y sistemas"
  },
  {
    logo: "assets/logos/roamretreats.png",
    logoImg: "assets/logos/roamretreats.png",
    logoClass: "testimonial-logo-roam",
    author: "Roam Retreats",
    url: "https://roamretreats.es/",
    type: "Proyecto propio",
    sector: "Consultoría boutique de inversión hotelera"
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

  let isShaderVisible = true;
  let isMobile = window.innerWidth <= 768;

  function render() {
    if (!isShaderVisible || isMobile) return;
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

  function handleVisibilityChange(visible) {
    const wasRendering = isShaderVisible && !isMobile;
    isShaderVisible = visible;
    if (!wasRendering && isShaderVisible && !isMobile) {
      requestAnimationFrame(render);
    }
  }

  if (typeof IntersectionObserver !== "undefined") {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        handleVisibilityChange(entry.isIntersecting);
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroShaderCanvas);
  }

  window.addEventListener("resize", () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    resizeCanvas();
    if (wasMobile && !isMobile && isShaderVisible) {
      requestAnimationFrame(render);
    }
  }, { passive: true });

  resizeCanvas();
  if (!isMobile) {
    requestAnimationFrame(render);
  }
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
    if (window.innerWidth <= 620) return;
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

function getActiveProcessIndex() {
  const activeIndex = processNodes.findIndex((node) => node.classList.contains("is-active"));
  return activeIndex >= 0 ? activeIndex : 0;
}

function showNextProcessOrbitNode() {
  if (!processNodes.length) return;
  const nextIndex = (getActiveProcessIndex() + 1) % processNodes.length;
  updateProcessOrbit(processNodes[nextIndex]);
}

let processOrbitAngle = 0;
let processOrbitTargetAngle = 0;
let processOrbitAnimationActive = true;
let processOrbitAnimationFrame = null;
let lastProcessOrbitScrollTime = 0;
let isUserInteractingOrbit = false;

function onProcessOrbitScroll() {
  if (!processOrbitStage || window.innerWidth <= 760) return;
  if (!processOrbitAnimationFrame && window.requestAnimationFrame) {
    processOrbitAnimationFrame = requestAnimationFrame(animateProcessOrbitContinuous);
  }
  const rect = processOrbitStage.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  
  // Calcular el progreso del paso de la sección por la ventana visible
  const totalDist = vh + rect.height;
  const progress = Math.max(0, Math.min(1, (vh - rect.top) / totalDist));
  
  // Giro proporcional al scroll (420 grados a lo largo de su paso por pantalla)
  processOrbitTargetAngle = progress * 420;
  lastProcessOrbitScrollTime = Date.now();

  // Conectar el avance del scroll con el nodo activo correspondiente (1 de 5)
  if (processNodes.length && !isUserInteractingOrbit) {
    const nodeIndex = Math.min(processNodes.length - 1, Math.floor(progress * processNodes.length));
    if (processNodes[nodeIndex] && !processNodes[nodeIndex].classList.contains("is-active")) {
      updateProcessOrbit(processNodes[nodeIndex]);
    }
  }
}

function animateProcessOrbitContinuous() {
  if (processOrbitStage && window.innerWidth > 760) {
    const timeSinceScroll = Date.now() - lastProcessOrbitScrollTime;
    
    if (timeSinceScroll < 1500) {
      // Respuesta dinámica al scroll con interpolación fluida (Lerp a 60fps)
      processOrbitAngle += (processOrbitTargetAngle - processOrbitAngle) * 0.12;
    } else if (processOrbitAnimationActive && !isUserInteractingOrbit) {
      // Rotación ambiental continua cuando no hay scroll activo
      processOrbitAngle = (processOrbitAngle + 0.18) % 360;
      processOrbitTargetAngle = processOrbitAngle;
    }
    
    processOrbitStage.style.setProperty("--orbit-angle", `${processOrbitAngle.toFixed(2)}deg`);
    processOrbitAnimationFrame = requestAnimationFrame(animateProcessOrbitContinuous);
  } else {
    processOrbitAnimationFrame = null;
  }
}

function stopProcessOrbitRotation() {
  processOrbitAnimationActive = false;
  isUserInteractingOrbit = true;
  if (!processOrbitTimer) return;
  window.clearInterval(processOrbitTimer);
  processOrbitTimer = null;
}

function startProcessOrbitRotation() {
  processOrbitAnimationActive = true;
  isUserInteractingOrbit = false;
  if (!processNodes.length || processOrbitTimer) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  processOrbitTimer = window.setInterval(showNextProcessOrbitNode, PROCESS_ORBIT_ROTATION_MS);
}

if (processNodes.length) {
  processNodes.forEach((node) => {
    node.addEventListener("click", () => {
      stopProcessOrbitRotation();
      updateProcessOrbit(node);
      startProcessOrbitRotation();
    });
  });

  updateProcessOrbit(processNodes.find((node) => node.classList.contains("is-active")) || processNodes[0]);

  if (processOrbitStage) {
    processOrbitStage.addEventListener("mouseenter", stopProcessOrbitRotation);
    processOrbitStage.addEventListener("mouseleave", startProcessOrbitRotation);
    processOrbitStage.addEventListener("focusin", stopProcessOrbitRotation);
    processOrbitStage.addEventListener("focusout", startProcessOrbitRotation);

    window.addEventListener("scroll", onProcessOrbitScroll, { passive: true });
    onProcessOrbitScroll();
  }

  startProcessOrbitRotation();
  if (window.requestAnimationFrame && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    requestAnimationFrame(animateProcessOrbitContinuous);
  }
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

  const positions = ["front", "middle", "back", "far", "tail"];

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

function isMobileTestimonialsLayout() {
  return Boolean(window.matchMedia && window.matchMedia("(max-width: 620px)").matches);
}

function scrollToNextTestimonial() {
  if (!testimonialStage) return;

  const cards = Array.from(testimonialStage.querySelectorAll(".testimonial-card"));
  if (!cards.length) return;

  const currentIndex = cards.reduce((nearestIndex, card, index) => {
    const nearestCard = cards[nearestIndex];
    return Math.abs(card.offsetLeft - testimonialStage.scrollLeft) < Math.abs(nearestCard.offsetLeft - testimonialStage.scrollLeft)
      ? index
      : nearestIndex;
  }, 0);
  const nextCard = cards[(currentIndex + 1) % cards.length];

  testimonialStage.scrollTo({
    left: nextCard.offsetLeft,
    behavior: "smooth"
  });
}

function shuffleTestimonials() {
  if (isMobileTestimonialsLayout()) {
    scrollToNextTestimonial();
    return;
  }

  currentTestimonials = rotateTestimonials(currentTestimonials);
  renderTestimonials();
}

if (testimonialStage) {
  renderTestimonials();

  let dragStartX = 0;

  testimonialStage.addEventListener("pointerdown", (event) => {
    if (isMobileTestimonialsLayout()) return;
    if (!event.target.closest(".is-front")) return;
    dragStartX = event.clientX;
  });

  testimonialStage.addEventListener("pointerup", (event) => {
    if (isMobileTestimonialsLayout()) return;
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
const LEAD_ENDPOINT = "/procesar-lead.php";

function pyme360Track(eventName, parameters = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}

// Track only high-signal interactions and never send PII to Google Analytics.
if (typeof document.querySelectorAll === "function") {
  document.querySelectorAll('a[href="#diagnostico"]').forEach((cta) => {
    cta.addEventListener("click", () => {
      pyme360Track("cta_click", {
        cta_name: "diagnostico_gratuito",
        cta_location: cta.classList.contains("nav-cta") ? "navigation" : "page"
      });
    });
  });
}


// Track WhatsApp contact clicks
if (typeof document !== "undefined" && typeof document.querySelectorAll === "function") {
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(waLink) {
    waLink.addEventListener("click", function() {
      pyme360Track("contact_click", {
        contact_type: "whatsapp",
        contact_destination: "34686184291",
        contact_location: waLink.closest(".site-footer") ? "footer" : "page"
      });
    });
  });
}

function pyme360BuildLeadPayload(values) {
  const business = values.business.trim();
  const location = values.location.trim() || "Sin especificar";
  const phone = values.phone.trim();

  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone,
    business_name: business,
    sector: values.sector.trim(),
    location,
    objetivo: values.objetivo || "",
    presupuesto: values.presupuesto || "",
    problem: values.problem.trim()
  };
}

async function pyme360SubmitLead(payload) {
  const response = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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
  window.pyme360Projects = testimonials;
  window.pyme360Clients = clients;
  window.pyme360RotateTestimonials = rotateTestimonials;
  window.pyme360BuildLeadPayload = pyme360BuildLeadPayload;
  window.pyme360SubmitLead = pyme360SubmitLead;
  window.pyme360PrefillLeadFormFromUrl = pyme360PrefillLeadFormFromUrl;
  window.LEAD_ENDPOINT = LEAD_ENDPOINT;
}

if (leadForm) {
  pyme360PrefillLeadFormFromUrl(leadForm);

  let formStartTracked = false;
  leadForm.addEventListener("focusin", () => {
    if (formStartTracked) return;
    formStartTracked = true;
    pyme360Track("form_start", { form_name: "diagnostico_gratuito" });
  }, { once: false });

  const privacyCheckbox = leadForm.querySelector('input[name="privacy"]');
  const submitButton = leadForm.querySelector("button[type='submit']");

  if (privacyCheckbox && submitButton) {
    submitButton.disabled = !privacyCheckbox.checked;
    submitButton.style.opacity = privacyCheckbox.checked ? "1" : "0.5";
    submitButton.style.cursor = privacyCheckbox.checked ? "pointer" : "not-allowed";

    privacyCheckbox.addEventListener("change", () => {
      submitButton.disabled = !privacyCheckbox.checked;
      submitButton.style.opacity = privacyCheckbox.checked ? "1" : "0.5";
      submitButton.style.cursor = privacyCheckbox.checked ? "pointer" : "not-allowed";
    });
  }

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
      problem: formData.get("problem") || "",
      objetivo: formData.get("objetivo") || "",
      presupuesto: formData.get("presupuesto") || ""
    });

    try {
      await pyme360SubmitLead(payload);
      pyme360Track("generate_lead", {
        form_name: "diagnostico_gratuito",
        lead_source: "home"
      });

      const isContactForm = leadForm.classList.contains("contact-form");
      if (submitButton) {
        submitButton.textContent = isContactForm ? "Mensaje enviado" : "Solicitud recibida";
      }

      leadForm.insertAdjacentHTML(
        "beforeend",
        isContactForm
          ? '<p class="form-success form-wide" role="status">Gracias. Hemos recibido tu mensaje correctamente y te responderemos en menos de 24 horas laborables.</p>'
          : '<p class="form-success form-wide" role="status">Gracias. Hemos recibido tu solicitud de diagnóstico y te contactaremos para preparar la revisión.</p>'
      );
    } catch (error) {
      console.error(error);

      if (submitButton) {
        submitButton.textContent = "Quiero mi diagnóstico gratuito";
        submitButton.removeAttribute("disabled");
      }

      leadForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-error form-wide" role="alert">No hemos podido enviar la solicitud. Escríbenos a info@pyme360.online y revisamos tu diagnóstico.</p>'
      );
    }
  });
}


/* ==========================================================================
   Gestión de consentimiento de Cookies y Carga diferida de Google Analytics
   ========================================================================== */
function pyme360LoadAnalytics() {
  if (typeof window === "undefined" || window._pyme360GaLoaded) return;
  window._pyme360GaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function(){ window.dataLayer.push(arguments); };
  }
  window.gtag("js", new Date());
  window.gtag("config", "G-TV5EY510HZ");

  if (typeof document !== "undefined" && typeof document.createElement === "function" && document.head) {
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-TV5EY510HZ";
    document.head.appendChild(gaScript);
  }
}

function pyme360InitCookieConsent() {
  if (typeof window === "undefined" || typeof document === "undefined" || typeof document.createElement !== "function" || !document.body) return;

  var CONSENT_KEY = "pyme360_cookie_consent";
  var consent = null;
  try {
    if (typeof localStorage !== "undefined") {
      consent = localStorage.getItem(CONSENT_KEY);
    }
  } catch (e) {}

  if (consent === "accepted") {
    pyme360LoadAnalytics();
    return;
  }
  if (consent === "rejected") {
    return;
  }

  var banner = document.createElement("aside");
  banner.className = "pyme360-cookie-banner";
  banner.setAttribute("aria-label", "Gestión de cookies");
  banner.innerHTML = [
    '<div class="pyme360-cookie-inner">',
    '  <p class="pyme360-cookie-text">',
    '    <strong>Privacidad y cookies:</strong> Utilizamos cookies analíticas de Google Analytics para medir visitas y mejorar nuestro servicio en Tenerife. Puedes aceptarlas o rechazarlas libremente. Consulta nuestra <a href="/cookies.html">política de cookies</a>.',
    '  </p>',
    '  <div class="pyme360-cookie-actions">',
    '    <button type="button" class="pyme360-cookie-btn pyme360-cookie-reject" id="pyme360-cookie-reject">Solo necesarias</button>',
    '    <button type="button" class="pyme360-cookie-btn pyme360-cookie-accept" id="pyme360-cookie-accept">Aceptar todas</button>',
    '  </div>',
    '</div>'
  ].join("");

  document.body.appendChild(banner);

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(function() {
      banner.classList.add("is-visible");
    });
  } else {
    banner.classList.add("is-visible");
  }

  var btnAccept = document.getElementById("pyme360-cookie-accept");
  var btnReject = document.getElementById("pyme360-cookie-reject");

  if (btnAccept) {
    btnAccept.addEventListener("click", function() {
      try { if (typeof localStorage !== "undefined") localStorage.setItem(CONSENT_KEY, "accepted"); } catch (e) {}
      banner.classList.remove("is-visible");
      setTimeout(function() { banner.remove(); }, 300);
      pyme360LoadAnalytics();
    });
  }

  if (btnReject) {
    btnReject.addEventListener("click", function() {
      try { if (typeof localStorage !== "undefined") localStorage.setItem(CONSENT_KEY, "rejected"); } catch (e) {}
      banner.classList.remove("is-visible");
      setTimeout(function() { banner.remove(); }, 300);
    });
  }
}

if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pyme360InitCookieConsent);
  } else {
    pyme360InitCookieConsent();
  }
}
