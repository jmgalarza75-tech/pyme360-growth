const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const INDICE_LEAD_ENDPOINT = "/procesar-lead.php";

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

const leadForm = document.querySelector(".indice-lead-form");

function pyme360NormalizeWebsite(value) {
  const website = String(value || "").trim();
  if (!website) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(website)) return website;
  return `https://${website}`;
}

function pyme360BuildIndiceLeadPayload(values) {
  const business = String(values.business || "").trim();
  const location = String(values.location || "").trim() || "Sin especificar";

  return {
    name: String(values.name || "").trim(),
    email: String(values.email || "").trim(),
    phone: String(values.phone || "").trim(),
    business_name: business,
    sector: String(values.sector || "").trim(),
    location,
    website: pyme360NormalizeWebsite(values.web || values.website || ""),
    units: String(values.units || "").trim(),
    problem: String(values.problem || "").trim(),
    source: "indice_pyme360_revision_inicial",
    newsletter_consent: values.newsletter === "yes" || values.newsletter === true,
    privacy_consent: values.privacy === "yes" || values.privacy === true
  };
}

async function pyme360SubmitIndiceLead(payload) {
  const response = await fetch(INDICE_LEAD_ENDPOINT, {
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

function prefillLeadFormFromUrl() {
  if (!leadForm) return;
  const params = new URLSearchParams(window.location.search);
  const values = {
    business: params.get("business") || params.get("negocio"),
    location: params.get("location") || params.get("zona"),
    sector: params.get("sector"),
    name: params.get("name"),
    email: params.get("email"),
    phone: params.get("phone"),
    web: params.get("web") || params.get("url"),
    units: params.get("units") || params.get("habitaciones"),
    problem: params.get("problem")
  };

  Object.entries(values).forEach(([name, value]) => {
    if (!value) return;
    const field = leadForm.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      field.value = value;
    }
  });
}

function showLeadFormStatus(message, type) {
  const oldStatus = leadForm.querySelector(".form-success, .form-error");
  if (oldStatus) oldStatus.remove();
  leadForm.insertAdjacentHTML(
    "beforeend",
    `<p class="${type === "success" ? "form-success" : "form-error"} form-wide" role="${type === "success" ? "status" : "alert"}" data-status="${type}">${message}</p>`
  );
}

if (typeof window !== "undefined") {
  window.INDICE_LEAD_ENDPOINT = INDICE_LEAD_ENDPOINT;
  window.pyme360BuildIndiceLeadPayload = pyme360BuildIndiceLeadPayload;
  window.pyme360SubmitIndiceLead = pyme360SubmitIndiceLead;
  window.pyme360NormalizeWebsite = pyme360NormalizeWebsite;
}

if (leadForm) {
  prefillLeadFormFromUrl();

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = leadForm.querySelector("button[type='submit']");

    if (submitButton) {
      submitButton.textContent = "Enviando solicitud...";
      submitButton.setAttribute("disabled", "true");
    }

    const formData = new FormData(leadForm);
    const payload = pyme360BuildIndiceLeadPayload({
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      business: formData.get("business") || "",
      sector: formData.get("sector") || "",
      location: formData.get("location") || "",
      web: formData.get("web") || "",
      units: formData.get("units") || "",
      problem: formData.get("problem") || "",
      newsletter: formData.get("newsletter") || "",
      privacy: formData.get("privacy") || ""
    });

    try {
      await pyme360SubmitIndiceLead(payload);
      showLeadFormStatus("Gracias. Hemos recibido tu solicitud de revisión inicial. Te contactaremos para preparar el diagnóstico.", "success");
      if (submitButton) submitButton.textContent = "Solicitud recibida";
    } catch (error) {
      console.error("Pyme360 indice lead form error:", error);
      showLeadFormStatus("No hemos podido registrar la solicitud. Revisa los datos o escríbenos directamente a info@pyme360.online.", "error");
      if (submitButton) {
        submitButton.textContent = "Solicitar revisión inicial";
        submitButton.removeAttribute("disabled");
      }
    }
  });
}

const leakGallery = document.querySelector(".leak-gallery");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");

if (leakGallery && galleryPrev && galleryNext) {
  const leakCards = Array.from(leakGallery.querySelectorAll(".leak-card"));
  let activeLeakIndex = 0;
  let rotationTimer;

  const getRelativePosition = (index) => {
    const total = leakCards.length;
    const forward = (index - activeLeakIndex + total) % total;
    const backward = (activeLeakIndex - index + total) % total;
    return forward <= backward ? forward : -backward;
  };

  const setActiveLeak = (nextIndex) => {
    const total = leakCards.length;
    activeLeakIndex = (nextIndex + total) % total;

    leakCards.forEach((card, index) => {
      card.classList.remove("is-active", "is-prev", "is-next", "is-before", "is-after");
      card.setAttribute("aria-hidden", "true");
      const position = getRelativePosition(index);
      if (position === 0) {
        card.classList.add("is-active");
        card.removeAttribute("aria-hidden");
      } else if (position === -1) {
        card.classList.add("is-prev");
      } else if (position === 1) {
        card.classList.add("is-next");
      } else if (position < 0) {
        card.classList.add("is-before");
      } else {
        card.classList.add("is-after");
      }
    });
  };

  const startRotation = () => {
    rotationTimer = setInterval(() => setActiveLeak(activeLeakIndex + 1), 3600);
  };

  const restartRotation = () => {
    clearInterval(rotationTimer);
    startRotation();
  };

  galleryPrev.addEventListener("click", () => { setActiveLeak(activeLeakIndex - 1); restartRotation(); });
  galleryNext.addEventListener("click", () => { setActiveLeak(activeLeakIndex + 1); restartRotation(); });
  leakGallery.addEventListener("mouseenter", () => clearInterval(rotationTimer));
  leakGallery.addEventListener("mouseleave", startRotation);
  leakGallery.addEventListener("focusin", () => clearInterval(rotationTimer));
  leakGallery.addEventListener("focusout", startRotation);
  setActiveLeak(0);
  startRotation();
}

// Linear Carousel for Ejemplos Reales with Infinite Scroll & Mouse Scroll-Driven Animation
(function initSpecialsCarousel() {
  if (typeof document === "undefined" || !document || typeof document.querySelector !== "function") return;
  const track = document.querySelector("#specialsTrack");
  const prevBtn = document.querySelector(".specials-nav-prev");
  const nextBtn = document.querySelector(".specials-nav-next");

  if (!track) return;

  const shell = track.closest(".specials-carousel-shell");
  const originalCards = Array.from(track.querySelectorAll(".specials-card"));
  if (originalCards.length === 0) return;

  // 1. Clones for infinite looping: [Pre-clones] [Originals] [Post-clones]
  if (typeof document.createDocumentFragment === "function") {
    const preFragment = document.createDocumentFragment();
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("is-clone");
      clone.setAttribute("aria-hidden", "true");
      preFragment.appendChild(clone);
    });
    track.insertBefore(preFragment, originalCards[0]);

    const postFragment = document.createDocumentFragment();
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("is-clone");
      clone.setAttribute("aria-hidden", "true");
      postFragment.appendChild(clone);
    });
    track.appendChild(postFragment);
  }

  function getSingleSetWidth() {
    const firstOrig = originalCards[0];
    const firstPost = track.children[originalCards.length * 2];
    if (firstOrig && firstPost && firstPost.offsetLeft > firstOrig.offsetLeft) {
      return firstPost.offsetLeft - firstOrig.offsetLeft;
    }
    const card = track.querySelector(".specials-card");
    const gap = 20;
    const cardWidth = card ? card.offsetWidth : 320;
    return (cardWidth + gap) * originalCards.length;
  }

  let singleSetWidth = getSingleSetWidth();

  function getCardStep() {
    const firstCard = track.querySelector(".specials-card");
    if (!firstCard) return 340;
    return firstCard.offsetWidth + 20;
  }

  // Position at middle set (the original cards)
  let currentScrollLeft = singleSetWidth;
  let targetScrollLeft = singleSetWidth;
  let isProgrammatic = false;

  function setTrackScrollLeft(val) {
    isProgrammatic = true;
    track.scrollLeft = val;
    isProgrammatic = false;
  }

  setTrackScrollLeft(singleSetWidth);

  function checkWrap() {
    if (!singleSetWidth || singleSetWidth <= 0) return;
    if (track.scrollLeft >= singleSetWidth * 2) {
      const offset = singleSetWidth;
      setTrackScrollLeft(track.scrollLeft - offset);
      currentScrollLeft -= offset;
      targetScrollLeft -= offset;
    } else if (track.scrollLeft < singleSetWidth) {
      const offset = singleSetWidth;
      setTrackScrollLeft(track.scrollLeft + offset);
      currentScrollLeft += offset;
      targetScrollLeft += offset;
    }
  }

  function recalculateMetrics() {
    const newWidth = getSingleSetWidth();
    if (newWidth > 0 && Math.abs(newWidth - singleSetWidth) > 5) {
      const ratio = currentScrollLeft / (singleSetWidth || 1);
      singleSetWidth = newWidth;
      currentScrollLeft = singleSetWidth * ratio;
      targetScrollLeft = currentScrollLeft;
      setTrackScrollLeft(currentScrollLeft);
    }
    checkWrap();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("resize", recalculateMetrics);
    window.addEventListener("load", recalculateMetrics);
  }

  // 2. Smooth Lerp Animation Loop
  let isDragging = false;
  let isTouching = false;

  function stepAnimation() {
    if (!isDragging && !isTouching) {
      const diff = targetScrollLeft - currentScrollLeft;
      if (Math.abs(diff) > 0.4) {
        currentScrollLeft += diff * 0.14;
        setTrackScrollLeft(currentScrollLeft);
        checkWrap();
      } else if (Math.abs(diff) > 0) {
        currentScrollLeft = targetScrollLeft;
        setTrackScrollLeft(currentScrollLeft);
        checkWrap();
      }
    }
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(stepAnimation);
    }
  }

  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(stepAnimation);
  }

  // 3. Infinite Navigation Buttons (< and >)
  if (prevBtn) {
    prevBtn.disabled = false;
    prevBtn.addEventListener("click", () => {
      targetScrollLeft -= getCardStep();
    });
  }

  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.addEventListener("click", () => {
      targetScrollLeft += getCardStep();
    });
  }

  // 4. "Según bajo con el ratón": Page Scroll Driven Horizontal Motion
  const section = track.closest("#ejemplos") || (shell ? shell.parentElement : null);
  let lastWindowY = typeof window !== "undefined" ? window.scrollY : 0;

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const currentWindowY = window.scrollY;
      const deltaY = currentWindowY - lastWindowY;
      lastWindowY = currentWindowY;

      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < (window.innerHeight + 120) && rect.bottom > -120;

      if (inView && !isDragging && !isTouching) {
        // Multiplier translates vertical page scroll directly into horizontal carousel movement
        targetScrollLeft += deltaY * 1.35;
      }
    }, { passive: true });
  }

  // 5. Mouse Wheel over Carousel Shell
  if (shell) {
    shell.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        targetScrollLeft += e.deltaY * 1.15;
      }
    }, { passive: true });
  }

  // 6. Drag to scroll logic
  let startX = 0;
  let dragStartLeft = 0;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    track.classList.add("is-dragging");
    startX = e.pageX;
    dragStartLeft = track.scrollLeft;
    currentScrollLeft = track.scrollLeft;
    targetScrollLeft = track.scrollLeft;
  });

  if (typeof window !== "undefined") {
    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("is-dragging");
      currentScrollLeft = track.scrollLeft;
      targetScrollLeft = track.scrollLeft;
      checkWrap();
    });
  }

  track.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const walk = (e.pageX - startX) * 1.4;
    setTrackScrollLeft(dragStartLeft - walk);
    currentScrollLeft = track.scrollLeft;
    targetScrollLeft = track.scrollLeft;
    checkWrap();
  });

  // Touch Support (Mobile)
  track.addEventListener("touchstart", () => {
    isTouching = true;
  }, { passive: true });

  track.addEventListener("touchend", () => {
    isTouching = false;
    currentScrollLeft = track.scrollLeft;
    targetScrollLeft = track.scrollLeft;
    checkWrap();
  }, { passive: true });

  track.addEventListener("scroll", () => {
    if (isProgrammatic) return;
    if (isTouching || isDragging) {
      currentScrollLeft = track.scrollLeft;
      targetScrollLeft = track.scrollLeft;
      checkWrap();
    }
  }, { passive: true });
})();

// FAQ Accordion fallback logic (for older browsers lacking native name="" support on <details>)
(function initFaqAccordion() {
  if (typeof document === "undefined" || typeof document.querySelectorAll !== "function") return;
  const items = document.querySelectorAll(".faq-accordion-item");
  if (!items || !items.length) return;

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
})();

// 3D Flip Card Toggle for Review Grid
(function initFlipCards() {
  if (typeof document === "undefined" || typeof document.querySelectorAll !== "function") return;
  const cards = document.querySelectorAll(".flip-card");
  if (!cards || !cards.length) return;

  cards.forEach((card) => {
    function toggleCard() {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-expanded", isFlipped ? "true" : "false");
    }

    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard();
      }
    });
  });
})();

// ==========================================================================
// Cuestionario de Autoevaluación Comercial (Las 7 P del Marketing Mix)
// ==========================================================================
(function initAutoevaluacion() {
  if (typeof document === "undefined" || typeof document.querySelector !== "function") return;
  const app = document.querySelector("#autoevaluacion-app");
  if (!app) return;

  // Estado reactivo del cuestionario
  const state = {
    currentStep: 0,
    profile: {
      sector: "",
      sectorText: "",
      units: "",
      location: "",
      business: "",
      web: ""
    },
    answers: {
      1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null,
      8: null, 9: null, 10: null, 11: null, 12: null, 13: null, 14: null
    }
  };

  const scaleTexts = {
    1: "1 · No se hace o no hay información para evaluarlo",
    2: "2 · Práctica muy incipiente o puntual",
    3: "3 · Se hace de manera puntual y reactiva",
    4: "4 · En desarrollo inicial con método básico",
    5: "5 · Hay un método, pero se aplica de forma irregular",
    6: "6 · Método en consolidación y aplicación periódica",
    7: "7 · Aplicación regular en casi todas las situaciones",
    8: "8 · Se hace habitualmente y queda registrado",
    9: "9 · Práctica muy avanzada y revisada de forma continua",
    10: "10 · Se revisa con datos y se ajusta según los resultados"
  };

  const pNames = {
    p1: "Producto",
    p2: "Precio",
    p3: "Plaza (Canales)",
    p4: "Promoción",
    p5: "Personas",
    p6: "Procesos",
    p7: "Evidencia física y digital"
  };

  const pInsights = {
    p1: {
      strength: "Tienes una propuesta diferencial y un tipo de huésped definido para cada temporada.",
      priority: "Conviene definir mejor el público prioritario de cada temporada y destacar tu valor diferencial."
    },
    p2: {
      strength: "Cuentas con tarifas estructuradas y control del margen neto tras comisiones de venta.",
      priority: "Revisar el coste real de cada canal y ajustar tarifas por temporada protegerá tu margen neto."
    },
    p3: {
      strength: "Tus canales de venta encajan con tu cliente y mantienes tus calendarios actualizados.",
      priority: "Alinear canales con tu huésped objetivo y coordinar disponibilidad evitará desajustes y fricciones."
    },
    p4: {
      strength: "Planificas acciones comerciales en fechas valle y compruebas qué iniciativas dan reservas.",
      priority: "Anticipar acciones para meses flojos y medir su eficacia evitará recurrir a rebajas de última hora."
    },
    p5: {
      strength: "Las responsabilidades comerciales están claras y respondéis con agilidad a las consultas.",
      priority: "Asignar claramente tareas comerciales y reducir el tiempo de respuesta acelerará el cierre de reservas."
    },
    p6: {
      strength: "El recorrido de reserva está estructurado y mantenéis el contacto con antiguos clientes.",
      priority: "Simplificar el paso de consulta a reserva y hacer seguimiento de huéspedes abrirá ventas directas."
    },
    p7: {
      strength: "Tus imágenes reflejan fielmente el alojamiento y el huésped encuentra datos claros para decidir.",
      priority: "Actualizar fotos nítidas y facilitar información práctica (normas y condiciones) mejorará la conversión móvil."
    }
  };

  // Elementos DOM principales
  const stepPanes = app.querySelectorAll(".quiz-step-pane");
  const progressFill = app.querySelector("#quiz-progress-fill");
  const progressText = app.querySelector("#quiz-progress-text");
  const progressPercent = app.querySelector("#quiz-progress-percent");

  const tipoSelect = app.querySelector("#quiz-tipo");
  const unidadesInput = app.querySelector("#quiz-unidades");
  const ubicacionInput = app.querySelector("#quiz-ubicacion");
  const nombreInput = app.querySelector("#quiz-nombre");
  const webInput = app.querySelector("#quiz-web");
  const btnStart = app.querySelector("#quiz-btn-start");

  // Adaptación dinámica de palabras según el perfil del alojamiento
  function updateTerminology(tipo) {
    let term = "alojamiento o cada una de sus unidades";
    if (tipo === "casa") term = "casa completa";
    else if (tipo === "hotel") term = "habitación o categoría";
    else if (tipo === "complejo") term = "unidad y conjunto";

    const unitSpans = app.querySelectorAll(".quiz-unit-term");
    unitSpans.forEach((span) => {
      span.textContent = term;
    });
  }

  if (tipoSelect) {
    tipoSelect.addEventListener("change", () => {
      state.profile.sector = tipoSelect.value;
      state.profile.sectorText = tipoSelect.options[tipoSelect.selectedIndex]?.text || "";
      updateTerminology(tipoSelect.value);
    });
  }

  // Interacción con la escala 1 al 10
  const ratingScales = app.querySelectorAll(".quiz-rating-scale");
  ratingScales.forEach((scale) => {
    const qNum = parseInt(scale.getAttribute("data-question"), 10);
    const buttons = scale.querySelectorAll(".scale-btn");
    const feedback = app.querySelector(`#feedback-q${qNum}`);
    const card = app.querySelector(`.quiz-question-card[data-q="${qNum}"]`);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = parseInt(btn.getAttribute("data-val"), 10);
        state.answers[qNum] = val;

        buttons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");

        if (feedback && scaleTexts[val]) {
          feedback.textContent = scaleTexts[val];
        }
        if (card) {
          card.classList.add("has-selection");
        }
      });
    });
  });

  // Cambio de paso
  function goToStep(targetStep) {
    state.currentStep = targetStep;

    stepPanes.forEach((pane) => {
      const paneStep = parseInt(pane.getAttribute("data-step"), 10);
      if (paneStep === targetStep) {
        pane.classList.add("is-active");
      } else {
        pane.classList.remove("is-active");
      }
    });

    // Actualizar barra de progreso
    if (progressFill && progressText && progressPercent) {
      if (targetStep === 0) {
        progressFill.style.width = "0%";
        progressText.textContent = "Paso 0 de 7 · Perfil de tu alojamiento";
        progressPercent.textContent = "0% completado";
      } else if (targetStep >= 1 && targetStep <= 7) {
        const pct = Math.round((targetStep / 7) * 100);
        progressFill.style.width = `${pct}%`;
        const pNamesList = ["", "Producto", "Precio", "Plaza", "Promoción", "Personas", "Procesos", "Evidencia"];
        progressText.textContent = `Paso ${targetStep} de 7 · ${pNamesList[targetStep]}`;
        progressPercent.textContent = `${pct}% completado`;
      } else if (targetStep === 8) {
        progressFill.style.width = "100%";
        progressText.textContent = "Autoevaluación completada · Diagnóstico listo";
        progressPercent.textContent = "100% completado";
      }
    }

    // Scroll suave a la cabecera del widget
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Validación y navegación entre pasos
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      const sector = tipoSelect ? tipoSelect.value.trim() : "";
      const units = unidadesInput ? unidadesInput.value.trim() : "";
      const location = ubicacionInput ? ubicacionInput.value.trim() : "";
      const business = nombreInput ? nombreInput.value.trim() : "";

      if (!sector || !units || !location || !business) {
        alert("Por favor, completa los campos de perfil para personalizar las preguntas y contextualizar tu resultado.");
        if (!sector && tipoSelect) tipoSelect.focus();
        else if (!units && unidadesInput) unidadesInput.focus();
        else if (!location && ubicacionInput) ubicacionInput.focus();
        else if (!business && nombreInput) nombreInput.focus();
        return;
      }

      state.profile.sector = sector;
      state.profile.sectorText = tipoSelect.options[tipoSelect.selectedIndex]?.text || sector;
      state.profile.units = units;
      state.profile.location = location;
      state.profile.business = business;
      state.profile.web = webInput ? webInput.value.trim() : "";

      goToStep(1);
    });
  }

  // Botones de siguiente y anterior
  const navNextBtns = app.querySelectorAll(".quiz-btn-next:not(#quiz-btn-start)");
  navNextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.getAttribute("data-target-step"), 10);
      const currentStep = state.currentStep;

      // Si está avanzando de un pilar (1 a 7), validar que ambas preguntas estén puntuadas
      if (currentStep >= 1 && currentStep <= 7 && targetStep > currentStep) {
        const q1 = (currentStep * 2) - 1;
        const q2 = currentStep * 2;
        if (state.answers[q1] === null || state.answers[q2] === null) {
          alert("Por favor, selecciona una puntuación para cada una de las dos preguntas antes de avanzar.");
          return;
        }
      }

      if (targetStep === 8) {
        calculateAndRenderResults();
        pyme360LanzarConfeti();
      }

      goToStep(targetStep);
    });
  });

  const navPrevBtns = app.querySelectorAll(".quiz-btn-prev");
  navPrevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.getAttribute("data-target-step"), 10);
      goToStep(targetStep);
    });
  });

  const btnModify = app.querySelector("#quiz-btn-modify");
  if (btnModify) {
    btnModify.addEventListener("click", () => {
      goToStep(7);
    });
  }

  // ==========================================================================
  // Cálculo y Presentación Inmediata de Resultados (Paso 8)
  // ==========================================================================
  function calculateAndRenderResults() {
    let sum = 0;
    for (let i = 1; i <= 14; i++) {
      sum += (state.answers[i] || 1);
    }
    const globalScore = Math.round((sum / 14) * 10) / 10;

    // Medias de las 7 P
    const pScores = [
      { key: "p1", name: pNames.p1, score: Math.round(((state.answers[1] + state.answers[2]) / 2) * 10) / 10 },
      { key: "p2", name: pNames.p2, score: Math.round(((state.answers[3] + state.answers[4]) / 2) * 10) / 10 },
      { key: "p3", name: pNames.p3, score: Math.round(((state.answers[5] + state.answers[6]) / 2) * 10) / 10 },
      { key: "p4", name: pNames.p4, score: Math.round(((state.answers[7] + state.answers[8]) / 2) * 10) / 10 },
      { key: "p5", name: pNames.p5, score: Math.round(((state.answers[9] + state.answers[10]) / 2) * 10) / 10 },
      { key: "p6", name: pNames.p6, score: Math.round(((state.answers[11] + state.answers[12]) / 2) * 10) / 10 },
      { key: "p7", name: pNames.p7, score: Math.round(((state.answers[13] + state.answers[14]) / 2) * 10) / 10 }
    ];

    // Renderizar Puntuación Global
    const globalNumEl = app.querySelector("#res-global-score");
    const globalLevelEl = app.querySelector("#res-global-level");
    const globalDescEl = app.querySelector("#res-global-desc");

    if (globalNumEl) globalNumEl.textContent = globalScore.toFixed(1);

    if (globalLevelEl && globalDescEl) {
      if (globalScore <= 4.0) {
        globalLevelEl.textContent = "Nivel inicial de desarrollo comercial";
        globalDescEl.textContent = "Tus prácticas comerciales se apoyan principalmente en la reacción puntual. Tienes una oportunidad directa para asentar métodos estables en tarifas, canales y seguimiento sin complicarte con herramientas caras.";
      } else if (globalScore <= 6.5) {
        globalLevelEl.textContent = "Nivel de desarrollo en consolidación";
        globalDescEl.textContent = "Cuentas con bases de gestión y métodos definidos, aunque todavía se aplican de forma irregular. Establecer rutinas fijas y medir el rendimiento de tus canales te permitirá defender mejor tu margen neto.";
      } else if (globalScore <= 8.5) {
        globalLevelEl.textContent = "Nivel comercial consolidado";
        globalDescEl.textContent = "Tienes procesos claros y registrados en la mayor parte de las áreas comerciales. Tu margen de mejora está en afinar la conversión de la venta directa y optimizar las fechas de menor demanda.";
      } else {
        globalLevelEl.textContent = "Nivel de gestión avanzada y analítica";
        globalDescEl.textContent = "Demuestras un control riguroso y una gestión guiada por datos en tus canales y procesos. El foco consiste en proteger la rentabilidad neta y rentabilizar aún más la fidelización directa.";
      }
    }

    // Renderizar lista de las 7 P con barras
    const pListEl = app.querySelector("#res-p-list");
    if (pListEl) {
      pListEl.innerHTML = pScores.map((p) => {
        let barColor = "#2fbf71";
        if (p.score < 5.0) barColor = "#e76f51";
        else if (p.score < 7.5) barColor = "#e7b75f";

        const fillWidth = Math.round((p.score / 10) * 100);
        return `
          <div class="quiz-p-row">
            <span class="quiz-p-name">${p.name}</span>
            <div class="quiz-p-bar-bg" aria-hidden="true">
              <div class="quiz-p-bar-fill" style="width: ${fillWidth}%; background: ${barColor};"></div>
            </div>
            <span class="quiz-p-score">${p.score.toFixed(1)}/10</span>
          </div>
        `;
      }).join("");
    }

    // Ordenar para obtener fortalezas (top 2) y prioridades (bottom 2)
    const sortedDesc = [...pScores].sort((a, b) => b.score - a.score);
    const sortedAsc = [...pScores].sort((a, b) => a.score - b.score);

    const strengths = [sortedDesc[0], sortedDesc[1]];
    const priorities = [sortedAsc[0], sortedAsc[1]];

    const strengthsListEl = app.querySelector("#res-strengths-list");
    if (strengthsListEl) {
      strengthsListEl.innerHTML = strengths.map((s) => `
        <li>
          <strong>${s.name} (${s.score.toFixed(1)}/10):</strong>
          ${pInsights[s.key]?.strength || "Área con prácticas comerciales consolidadas."}
        </li>
      `).join("");
    }

    const prioritiesListEl = app.querySelector("#res-priorities-list");
    if (prioritiesListEl) {
      prioritiesListEl.innerHTML = priorities.map((p) => `
        <li>
          <strong>${p.name} (${p.score.toFixed(1)}/10):</strong>
          ${pInsights[p.key]?.priority || "Área prioritaria para impulsar reservas directas."}
        </li>
      `).join("");
    }

    // Enlace de WhatsApp pre-rellenado (conversación voluntaria)
    const whatsappCta = app.querySelector("#quiz-whatsapp-cta");
    if (whatsappCta) {
      const msg = `Hola Pyme360, he completado la autoevaluación comercial de ${state.profile.business || "mi alojamiento"} con una puntuación de ${globalScore.toFixed(1)}/10. Mis dos prioridades son ${priorities[0].name} y ${priorities[1].name}. Me gustaría comentarlas con vosotros.`;
      whatsappCta.href = `https://wa.me/34686184291?text=${encodeURIComponent(msg)}`;
    }

    // Pre-rellenar formulario de informe detallado por correo
    const reportName = app.querySelector("#report-name");
    if (reportName && state.profile.business && !reportName.value) {
      reportName.value = state.profile.business;
    }
  }

  // ==========================================================================
  // Envío del Informe Detallado por Correo
  // ==========================================================================
  const emailForm = app.querySelector("#quiz-email-form");
  if (emailForm) {
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = emailForm.querySelector("#report-submit-btn");
      const statusMsg = emailForm.querySelector("#report-status-msg");

      const nameVal = emailForm.querySelector("#report-name")?.value.trim() || "";
      const emailVal = emailForm.querySelector("#report-email")?.value.trim() || "";
      const phoneVal = emailForm.querySelector("#report-phone")?.value.trim() || "";
      const newsletterBox = emailForm.querySelector("#report-newsletter");
      const privacyBox = emailForm.querySelector("#report-privacy");

      if (!privacyBox || !privacyBox.checked) {
        alert("Debes aceptar la política de privacidad para que podamos enviarte el informe.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Preparando y enviando informe...";
      }

      if (statusMsg) {
        statusMsg.style.display = "none";
        statusMsg.className = "form-status-msg form-wide";
      }

      // Cálculo del informe formateado
      let sum = 0;
      for (let i = 1; i <= 14; i++) sum += (state.answers[i] || 1);
      const globalScore = (sum / 14).toFixed(1);

      const pSummary = [
        `P1 Producto: ${(((state.answers[1] || 1) + (state.answers[2] || 1)) / 2).toFixed(1)}/10`,
        `P2 Precio: ${(((state.answers[3] || 1) + (state.answers[4] || 1)) / 2).toFixed(1)}/10`,
        `P3 Plaza (Canales): ${(((state.answers[5] || 1) + (state.answers[6] || 1)) / 2).toFixed(1)}/10`,
        `P4 Promoción: ${(((state.answers[7] || 1) + (state.answers[8] || 1)) / 2).toFixed(1)}/10`,
        `P5 Personas: ${(((state.answers[9] || 1) + (state.answers[10] || 1)) / 2).toFixed(1)}/10`,
        `P6 Procesos: ${(((state.answers[11] || 1) + (state.answers[12] || 1)) / 2).toFixed(1)}/10`,
        `P7 Evidencia: ${(((state.answers[13] || 1) + (state.answers[14] || 1)) / 2).toFixed(1)}/10`
      ].join(" | ");

      const answersDetail = [];
      for (let i = 1; i <= 14; i++) {
        answersDetail.push(`Q${i}: ${state.answers[i] || 1}/10`);
      }

      const problemReportText = [
        `=== AUTOEVALUACIÓN COMERCIAL 7P ===`,
        `Alojamiento: ${state.profile.business || nameVal}`,
        `Tipo: ${state.profile.sectorText || state.profile.sector}`,
        `Unidades: ${state.profile.units}`,
        `Ubicación: ${state.profile.location}`,
        `Web: ${state.profile.web || "No facilitada"}`,
        ``,
        `PUNTUACIÓN GLOBAL: ${globalScore} / 10`,
        `DESGLOSE 7 P: ${pSummary}`,
        `RESPUESTAS DETALLADAS: ${answersDetail.join(", ")}`,
        `SOLICITUD: Envío de informe detallado con observaciones comerciales aplicadas.`
      ].join("\n");

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        business: state.profile.business || nameVal,
        sector: state.profile.sectorText || state.profile.sector,
        location: state.profile.location || "Sin especificar",
        web: state.profile.web || "",
        units: state.profile.units || "",
        problem: problemReportText,
        newsletter: newsletterBox && newsletterBox.checked ? "yes" : "",
        privacy: "yes"
      };

      try {
        const fullPayload = pyme360BuildIndiceLeadPayload(payload);
        await pyme360SubmitIndiceLead(fullPayload);

        if (statusMsg) {
          statusMsg.textContent = "¡Informe registrado! Hemos enviado una copia a tu email y registrado tu autoevaluación. Revisaremos tus prioridades para responderte.";
          statusMsg.classList.add("is-success");
          statusMsg.style.display = "block";
        }
        if (submitBtn) {
          submitBtn.textContent = "Informe enviado correctamente ✓";
        }
        pyme360LanzarConfeti();
      } catch (err) {
        console.error("Error al enviar autoevaluacion lead:", err);
        if (statusMsg) {
          statusMsg.textContent = "No se pudo conectar con el servidor en este momento. Hemos conservado tus resultados en pantalla; puedes escribirnos directamente a info@pyme360.online con tus resultados.";
          statusMsg.classList.add("is-error");
          statusMsg.style.display = "block";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Reintentar envío";
        }
      }
    });
  }

    // Soporte para previsualización inmediata (?demo=1 o ?paso=8)
    const urlParams = (typeof window !== "undefined" && window.location) ? new URLSearchParams(window.location.search) : null;
    if (urlParams && (urlParams.get("demo") === "1" || urlParams.get("paso") === "8" || urlParams.get("test") === "resultados")) {
      state.profile = {
        sector: "casa",
        sectorText: "Casa rural o vivienda vacacional independiente",
        units: "6",
        location: "Asturias",
        business: "Finca El Valle",
        web: "fincaelvalle.es"
      };
      state.answers = {
        1: 8, 2: 7,
        3: 5, 4: 4,
        5: 6, 6: 5,
        7: 4, 8: 3,
        9: 8, 10: 7,
        11: 6, 12: 5,
        13: 7, 14: 6
      };
      calculateAndRenderResults();
      goToStep(8);
      setTimeout(pyme360LanzarConfeti, 150);
    }


  // ========================================================
  // Celebración WOW: Confeti de marca y pajaritos volando
  // ========================================================
  function pyme360LanzarConfeti() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    try {
      const existing = document.getElementById("pyme360-celebration-canvas");
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }

      const canvas = document.createElement("canvas");
      canvas.id = "pyme360-celebration-canvas";
      canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;";
      document.body.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      // Paleta Pyme360: esmeraldas, oros, naranjas cálidos, cian y blanco
      const colors = ["#10b981", "#059669", "#34d399", "#f59e0b", "#fbbf24", "#ea580c", "#f97316", "#38bdf8", "#ffffff"];
      const particles = [];
      const particleCount = 135;

      // Generar partículas (confeti vibrante + pajaritos voladores origami)
      for (let i = 0; i < particleCount; i++) {
        const isBird = (i % 6 === 0); // 1 de cada 6 es un pajarito volador
        particles.push({
          isBird: isBird,
          x: width * (0.2 + Math.random() * 0.6),
          y: height * 0.6 + (Math.random() * 80 - 40),
          vx: (Math.random() - 0.5) * (isBird ? 13 : 19),
          vy: -Math.random() * (isBird ? 15 : 22) - 6,
          size: isBird ? (Math.random() * 8 + 11) : (Math.random() * 8 + 6),
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          wingAngle: Math.random() * Math.PI * 2,
          wingSpeed: 0.16 + Math.random() * 0.18,
          opacity: 1,
          gravity: isBird ? 0.20 : 0.44,
          drag: isBird ? 0.985 : 0.965
        });
      }

      let startTime = performance.now();
      let animId = null;

      function render(currentTime) {
        const elapsed = currentTime - startTime;
        ctx.clearRect(0, 0, width, height);

        let alive = false;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.vx *= p.drag;
          p.vy = p.vy * p.drag + p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.wingAngle += p.wingSpeed;

          if (elapsed > 2400) {
            p.opacity -= 0.024;
          }

          if (p.opacity > 0 && p.y < height + 80) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

            if (p.isBird) {
              // Silueta origami de pajarito batiendo alas
              ctx.fillStyle = p.color;
              ctx.beginPath();
              const wingOffset = Math.sin(p.wingAngle) * (p.size * 0.5);
              ctx.moveTo(-p.size, wingOffset);
              ctx.quadraticCurveTo(0, -p.size * 0.7, p.size, wingOffset);
              ctx.quadraticCurveTo(0, p.size * 0.3, -p.size, wingOffset);
              ctx.fill();

              // Detalle de cabeza / pico
              ctx.beginPath();
              ctx.arc(p.size * 0.7, wingOffset * 0.5, p.size * 0.22, 0, Math.PI * 2);
              ctx.fillStyle = "#ffffff";
              ctx.fill();
            } else {
              // Cinta o papel de confeti ondeante en perspectiva 3D
              ctx.fillStyle = p.color;
              const w = p.size;
              const h = p.size * (0.35 + 0.65 * Math.abs(Math.cos(p.wingAngle)));
              ctx.fillRect(-w / 2, -h / 2, w, h);
            }

            ctx.restore();
          }
        }

        if (alive && elapsed < 4800) {
          animId = requestAnimationFrame(render);
        } else {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          if (animId) cancelAnimationFrame(animId);
        }
      }

      animId = requestAnimationFrame(render);
    } catch (e) {
      console.warn("Celebration animation skipped:", e);
    }
  }

  if (typeof window !== "undefined") {
    window.pyme360LanzarConfeti = pyme360LanzarConfeti;
  }

    if (typeof window !== "undefined") {
      window.pyme360VerResultadosDemo = function() {
        state.profile = {
          sector: "casa",
          sectorText: "Casa rural o vivienda vacacional independiente",
          units: "6",
          location: "Asturias",
          business: "Finca El Valle",
          web: "fincaelvalle.es"
        };
        state.answers = {
          1: 8, 2: 7,
          3: 5, 4: 4,
          5: 6, 6: 5,
          7: 4, 8: 3,
          9: 8, 10: 7,
          11: 6, 12: 5,
          13: 7, 14: 6
        };
        calculateAndRenderResults();
        goToStep(8);
        setTimeout(pyme360LanzarConfeti, 150);
      };
    }
})();

// ========================================================
// Hero Zoom In / Zoom Out Interactive Showcase Deck
// ========================================================
(function initHeroZoomDeck() {
  if (typeof document === "undefined" || typeof document.querySelector !== "function") return;
  const deck = document.querySelector("#heroZoomDeck");
  if (!deck) return;

  const cards = Array.from(deck.querySelectorAll(".zoom-deck-card"));
  if (cards.length === 0) return;

  let currentIdx = 0;
  let timer = null;
  let isPaused = false;

  function setActiveCard(idx) {
    cards.forEach((c, i) => {
      if (i === idx) {
        c.classList.add("is-zoomed");
      } else {
        c.classList.remove("is-zoomed");
      }
    });
    currentIdx = idx;
  }

  function startCycle() {
    stopCycle();
    timer = setInterval(() => {
      if (isPaused) return;
      currentIdx = (currentIdx + 1) % cards.length;
      setActiveCard(currentIdx);
    }, 3800);
  }

  function stopCycle() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  cards.forEach((card, idx) => {
    card.addEventListener("mouseenter", () => {
      isPaused = true;
      setActiveCard(idx);
    });

    card.addEventListener("focus", () => {
      isPaused = true;
      setActiveCard(idx);
    });

    card.addEventListener("click", () => {
      isPaused = true;
      setActiveCard(idx);
    });
  });

  deck.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  // Inicio de ciclo
  setActiveCard(0);
  startCycle();
})();


  // ========================================================
  // Secuencia Cinematográfica de Entrada del Hero (1 -> 2 -> 3 -> 4)
  // Al inicio solo se ve la imagen de fondo limpia, y los textos van entrando de derecha a izquierda
  // ========================================================
  function initHeroCinematicSequence() {
    if (typeof document === "undefined" || typeof document.querySelector !== "function") return;

    const s1 = document.querySelector(".hero-stage-1");
    const s2 = document.querySelector(".hero-stage-2");
    const s3 = document.querySelector(".hero-stage-3");
    const s4 = document.querySelector(".hero-stage-4");

    if (!s1 || !s2 || !s3) return;

    // Si viene con ancla o demo, activar inmediatamente
    if (typeof window !== "undefined" && window.location) {
      if (window.location.hash || window.location.search.includes("demo=1")) {
        [s1, s2, s3, s4].forEach((el) => el && el.classList.add("is-entered"));
        return;
      }
    }

    // 0ms a 500ms: Solo la imagen de fondo visible
    // 500ms: Entra 1 (Kicker + "analizamos qué falla y")
    setTimeout(() => {
      s1.classList.add("is-entered");
    }, 500);

    // 1250ms: Entra 2 ("VENDEMOS MEJOR TU ALOJAMIENTO")
    setTimeout(() => {
      s2.classList.add("is-entered");
    }, 1250);

    // 2000ms: Entra 3 (Párrafo + Botones + Nota)
    setTimeout(() => {
      s3.classList.add("is-entered");
    }, 2000);

    // 2750ms: Entra 4 (Fases metodológicas en dock)
    setTimeout(() => {
      if (s4) s4.classList.add("is-entered");
    }, 2750);

    // Si el usuario scrollea antes de terminar la secuencia, revelar de inmediato
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      const onScrollTrigger = () => {
        if (window.scrollY > 30) {
          [s1, s2, s3, s4].forEach((el) => el && el.classList.add("is-entered"));
          window.removeEventListener("scroll", onScrollTrigger);
        }
      };
      window.addEventListener("scroll", onScrollTrigger, { passive: true });
    }
  }

  // ========================================================
  // Scroll Reveal: Elementos aparecen de derecha a izquierda al hacer scroll
  // ========================================================
  function initScrollRevealRight() {
    if (typeof document === "undefined" || typeof document.querySelectorAll !== "function") return;

    const items = document.querySelectorAll(".scroll-reveal-right");
    if (!items || items.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08
      }
    );

    items.forEach((el) => {
      observer.observe(el);
    });

    if (typeof window !== "undefined" && window.location) {
      if (window.location.hash || window.location.search.includes("demo=1")) {
        setTimeout(() => {
          items.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 250) {
              el.classList.add("is-visible");
            }
          });
        }, 50);
      }
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        initHeroCinematicSequence();
        initScrollRevealRight();
      });
    } else {
      initHeroCinematicSequence();
      initScrollRevealRight();
    }
  }
