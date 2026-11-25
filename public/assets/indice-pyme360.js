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
  const score100 = Number(values.score_100);

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
    score_100: Number.isFinite(score100) && score100 >= 0 && score100 <= 100
      ? Math.round(score100)
      : null,
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

  const result = await response.json().catch(() => null);
  if (!response.ok && response.status !== 201) {
    throw new Error(result?.error || `Error del servidor (${response.status})`);
  }
  return result;
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
    needs: [],         // Array de letras seleccionadas: ['A', 'B', ...]
    primaryNeed: "",   // 'A' .. 'H'
    profile: {
      sector: "vivienda",
      sectorText: "Vivienda vacacional",
      units: "1",
      location: "",
      business: "",
      web: ""
    },
    answers: {
      1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null,
      8: null, 9: null, 10: null, 11: null, 12: null, 13: null, 14: null,
      15: null, 16: null, 17: null, 18: null, 19: null, 20: null, 21: null
    },
    utms: {
      source: "",
      medium: "",
      campaign: "",
      content: "",
      term: ""
    }
  };

  // Extraer parámetros UTM de la URL
  try {
    if (typeof window !== "undefined" && window.location) {
      const sp = new URLSearchParams(window.location.search);
      state.utms.source = sp.get("utm_source") || "";
      state.utms.medium = sp.get("utm_medium") || "";
      state.utms.campaign = sp.get("utm_campaign") || "";
      state.utms.content = sp.get("utm_content") || "";
      state.utms.term = sp.get("utm_term") || "";
    }
  } catch (e) {}

  // Catálogo de necesidades
  const needsDescriptions = {
    A: "Conseguir más reservas y mejorar la comercialización",
    B: "Mejorar mi página web y aumentar las reservas directas",
    C: "Reducir la dependencia de Booking y Airbnb",
    D: "Mejorar fotografías, descripciones y presentación del alojamiento",
    E: "Delegar la gestión de reservas, huéspedes u operativa",
    F: "Organizar mejor el negocio, ahorrar tiempo y mejorar procesos",
    G: "Mejorar mi estrategia de precios y rentabilidad",
    H: "Todavía no lo tengo claro; quiero conocer mi situación"
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
      priority: "Conviene definir mejor el público prioritario de cada temporada y destacar tu valor diferencial.",
      action: "Revisar la propuesta de valor y destacar qué incluye tu alojamiento que los competidores cercanos no ofrecen."
    },
    p2: {
      strength: "Cuentas con tarifas estructuradas y control del margen neto tras comisiones de venta.",
      priority: "Revisar el coste real de cada canal y ajustar tarifas por temporada protegerá tu margen neto.",
      action: "Calcular el margen neto real tras comisiones de Booking/Airbnb y establecer un incentivo directo en tu web para estancias de más de 3 noches."
    },
    p3: {
      strength: "Tus canales de venta encajan con tu cliente y mantienes tus calendarios actualizados.",
      priority: "Alinear canales con tu huésped objetivo y coordinar disponibilidad evitará desajustes y fricciones.",
      action: "Asegurar que la web propia permite consultar disponibilidad en tiempo real sin obligar al viajero a llamar o esperar respuesta."
    },
    p4: {
      strength: "Planificas acciones comerciales en fechas valle y compruebas qué iniciativas dan reservas.",
      priority: "Anticipar acciones para meses flojos y medir su eficacia evitará recurrir a rebajas de última hora.",
      action: "Optimizar la ficha de Google Business con fotos de temporada y activar el enlace a tu web para captar búsquedas locales."
    },
    p5: {
      strength: "Las responsabilidades comerciales están claras y respondéis con agilidad a las consultas.",
      priority: "Asignar claramente tareas comerciales y reducir el tiempo de respuesta acelerará el cierre de reservas.",
      action: "Establecer un protocolo de respuesta rápida (< 1 hora) para consultas en fechas calientes y solicitar reseñas activamente."
    },
    p6: {
      strength: "El recorrido de reserva está estructurado y mantenéis el contacto con antiguos clientes.",
      priority: "Simplificar el paso de consulta a reserva y hacer seguimiento de huéspedes abrirá ventas directas.",
      action: "Simplificar los pasos de reserva directa en móvil eliminando campos innecesarios en el formulario de contacto o consulta."
    },
    p7: {
      strength: "Tus imágenes reflejan fielmente el alojamiento y el huésped encuentra datos claros para decidir.",
      priority: "Actualizar fotos nítidas y facilitar información práctica (normas y condiciones) mejorará la conversión móvil.",
      action: "Actualizar las primeras 5 fotografías de portada con luz natural y comprobar que las condiciones de reserva se leen claras desde el móvil."
    }
  };

  // Motor determinista de clasificación comercial
  function pyme360GetBrandRecommendation(primaryNeed, pScores, location, tipo, selectedNeeds) {
    const locLower = String(location || "").toLowerCase();
    const isCanary = locLower.includes("tenerife") || locLower.includes("canaria") || locLower.includes("palma") || locLower.includes("gomera") || locLower.includes("hierro") || locLower.includes("lanzarote") || locLower.includes("fuerteventura");
    const needsList = Array.isArray(selectedNeeds) ? selectedNeeds : [];

    let brand = "PYME360";
    let complementaryBrand = null;
    let title = "Podemos ayudarte a convertir estas oportunidades en mejoras concretas";
    let text = "Según tus respuestas, una de tus prioridades es mejorar cómo presentas y comercializas tu alojamiento. Desde PYME360 podemos estudiar tu situación y proponerte una intervención adaptada a tu negocio.";
    let nextStep = "Analizar conjuntamente tus canales actuales y tu web para eliminar fugas de margen.";

    // Mapeo de notas de las 7P
    const pMap = {};
    if (Array.isArray(pScores)) {
      pScores.forEach((p) => { pMap[p.key] = p.score; });
    }
    const avgP3 = pMap.p3 ?? 6.0; // Canales
    const avgP4 = pMap.p4 ?? 6.0; // Promoción
    const avgP6 = pMap.p6 ?? 6.0; // Procesos

    if (primaryNeed === "E" || (needsList.includes("E") && !primaryNeed)) {
      brand = "Home4Escape";
      title = "¿Necesitas recuperar tiempo delegando la gestión?";
      const coverageNote = isCanary
        ? "Contamos con equipo operativo en Canarias para coordinar comercialización y reservas."
        : "Podemos valorar si las necesidades operativas de tu alojamiento encajan con nuestro alcance en tu zona.";
      text = `Tus respuestas indican que la gestión diaria del alojamiento es una de tus principales preocupaciones. ${coverageNote} Te ayudamos a liberar tiempo manteniendo el control de tu negocio.`;
      nextStep = "Comprobar el encaje operativo y la ubicación del alojamiento para valorar un modelo de gestión delegada.";

      if (needsList.includes("B") || needsList.includes("D")) {
        complementaryBrand = {
          brand: "PYME360",
          note: "Complementariamente, para la renovación web o producción visual, PYME360 puede intervenir directamente sobre tus activos de captación."
        };
      }
    } else if (primaryNeed === "F" || (needsList.includes("F") && !primaryNeed)) {
      brand = "FARO";
      title = "Una organización más eficiente empieza por identificar qué cambiar";
      text = "Has señalado la organización y los procesos como una de tus prioridades. Un acompañamiento especializado en procesos te ayudará a estructurar rutinas, optimizar tiempos y asentar métodos claros de trabajo.";
      nextStep = "Mapear los 3 procesos que más tiempo te consumen semanalmente y diseñar protocolos de simplificación.";

      if (needsList.includes("B") || needsList.includes("C") || avgP3 < 5.0) {
        complementaryBrand = {
          brand: "PYME360",
          note: "En paralelo con la optimización de procesos, PYME360 puede ayudarte a reforzar tu captación directa para no perder reservas durante la reorganización."
        };
      }
    } else if (primaryNeed === "H" || (needsList.includes("H") && !primaryNeed)) {
      if (avgP3 < 5.0 || avgP4 < 5.0) {
        brand = "PYME360";
        title = "Punto de partida: corregir fugas en comercialización y canales";
        text = "Tus respuestas reflejan que las mayores oportunidades se concentran en tus canales de venta y promoción. En una sesión de valoración de 20 minutos analizaremos tus canales actuales para ordenar tus primeras prioridades.";
        nextStep = "Revisar los datos del diagnóstico en una sesión de 20 minutos para definir cuál es la primera palanca de rentabilidad.";
      } else if (avgP6 < 5.0) {
        brand = "FARO";
        title = "Punto de partida: simplificar rutinas y operativa";
        text = "Tus respuestas muestran que la principal fricción no está en la venta, sino en la carga de procesos diarios. Un acompañamiento en procesos te ayudará a recuperar control y tiempo.";
        nextStep = "Analizar en una sesión de 20 minutos las rutinas que más tiempo te restan en el día a día.";
      } else {
        brand = "PYME360";
        title = "Un punto de partida claro para ordenar prioridades";
        text = "Has indicado que prefieres conocer tu situación antes de decidir un área concreta. En una breve conversación de valoración podemos repasar tus resultados del diagnóstico y orientarte sobre qué paso tiene mayor sentido abordar primero.";
        nextStep = "Revisar los datos del diagnóstico en una sesión de 20 minutos para definir cuál es la primera palanca de rentabilidad.";
      }
    } else {
      // A, B, C, D, G -> PYME360
      brand = "PYME360";
      title = "Podemos ayudarte a convertir estas oportunidades en mejoras concretas";
      text = "Según tus respuestas, una de tus prioridades es mejorar cómo presentas y comercializas tu alojamiento. Desde PYME360 podemos estudiar tu situación y proponerte una intervención adaptada a tu negocio.";
      if (primaryNeed === "B") nextStep = "Auditar el flujo de reserva de tu página web y optimizar la conversión desde dispositivos móviles.";
      else if (primaryNeed === "C") nextStep = "Establecer incentivos exclusivos de reserva directa para frenar la fuga de comisiones hacia Booking y Airbnb.";
      else if (primaryNeed === "D") nextStep = "Renovar la narrativa visual y las descripciones clave para posicionar el alojamiento en un segmento de mayor valor.";
      else if (primaryNeed === "G") nextStep = "Estructurar tarifas dinámicas por temporada para proteger el margen neto en meses valle.";
      else nextStep = "Analizar conjuntamente tus canales actuales y tu web para eliminar fugas de margen.";

      if (needsList.includes("F")) {
        complementaryBrand = {
          brand: "FARO",
          note: "Como también has señalado la necesidad de mejorar procesos y organización, un asesoramiento estructurado de FARO puede complementar la estrategia comercial."
        };
      }
    }

    return { brand, complementaryBrand, title, text, nextStep };
  }

  // Disparar evento analítico en GA4 y Meta Pixel (respetando privacidad y sin PII ni datos sensibles)
  function trackAnalyticsEvent(eventName, params) {
    // 1. Google Analytics 4
    try {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", eventName, params || {});
      }
    } catch (e) {}

    // 2. Meta Pixel (Dataset ID: 1508603327820296)
    // Reglas estrictas:
    // - Lead: se dispara tras confirmación de envío de solicitud y sin importes.
    // - ViewContent: al visualizar el resultado del diagnóstico.
    // - PageView: gestionado en la carga inicial tras el consentimiento.
    // - NO se dispara Schedule al hacer clic (solo cuando una plataforma confirme reserva).
    // - NO se envían value ni currency: la puntuación no es un importe monetario.
    // - NO se envían respuestas del cuestionario ni datos personales (PII) a Meta.
    try {
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        if (eventName === "generate_lead") {
          window.fbq("track", "Lead", {
            content_name: "Informe Diagnóstico Comercial 7P"
          });
        } else if (eventName === "diagnostic_complete") {
          window.fbq("track", "ViewContent", {
            content_name: "Resultado Diagnóstico Comercial"
          });
        }
      }
    } catch (e) {}
  }

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

  // Manejo de la selección de necesidades (Paso 0)
  const needsGrid = app.querySelector("#quiz-needs-grid");
  const priorityWrap = app.querySelector("#quiz-primary-priority-wrap");
  const primaryNeedSelect = app.querySelector("#quiz-primary-need-select");

  if (needsGrid) {
    const needCards = needsGrid.querySelectorAll(".quiz-need-card");

    needCards.forEach((card) => {
      const checkbox = card.querySelector("input[type='checkbox']");
      const needCode = card.getAttribute("data-need");
      if (!checkbox) return;

      checkbox.addEventListener("change", () => {
        // Si se marca "H" (No lo tengo claro), desmarcar las demás
        if (needCode === "H" && checkbox.checked) {
          needCards.forEach((c) => {
            if (c !== card) {
              const cb = c.querySelector("input[type='checkbox']");
              if (cb) cb.checked = false;
              c.classList.remove("is-selected");
            }
          });
        } else if (needCode !== "H" && checkbox.checked) {
          // Si se marca otra, desmarcar H si estuviese marcada
          const hCard = needsGrid.querySelector('.quiz-need-card[data-need="H"]');
          if (hCard) {
            const hCb = hCard.querySelector("input[type='checkbox']");
            if (hCb) hCb.checked = false;
            hCard.classList.remove("is-selected");
          }
        }

        if (checkbox.checked) {
          card.classList.add("is-selected");
        } else {
          card.classList.remove("is-selected");
        }

        // Actualizar array de necesidades seleccionadas
        const selectedCodes = [];
        needCards.forEach((c) => {
          const cb = c.querySelector("input[type='checkbox']");
          if (cb && cb.checked) {
            selectedCodes.push(c.getAttribute("data-need"));
          }
        });
        state.needs = selectedCodes;
        state.selectedNeeds = selectedCodes;

        // Gestión de la Prioridad Principal
        if (selectedCodes.length === 1) {
          state.primaryNeed = selectedCodes[0];
          state.primaryPriority = selectedCodes[0];
          if (priorityWrap) priorityWrap.style.display = "none";
        } else if (selectedCodes.length > 1) {
          if (priorityWrap && primaryNeedSelect) {
            priorityWrap.style.display = "block";
            const currentSelected = state.primaryNeed || state.primaryPriority;
            primaryNeedSelect.innerHTML = '<option value="">Selecciona tu prioridad número uno</option>' +
              selectedCodes.map((code) => {
                const label = needsDescriptions[code] || code;
                return `<option value="${code}">${code}. ${label}</option>`;
              }).join("");

            if (selectedCodes.includes(currentSelected)) {
              primaryNeedSelect.value = currentSelected;
            } else {
              primaryNeedSelect.value = selectedCodes[0];
              state.primaryNeed = selectedCodes[0];
              state.primaryPriority = selectedCodes[0];
            }
          }
        } else {
          state.primaryNeed = "";
          state.primaryPriority = "";
          if (priorityWrap) priorityWrap.style.display = "none";
        }

        // GA4 tracking del inicio
        if (selectedCodes.length === 1 && !state._startedTracked) {
          state._startedTracked = true;
          trackAnalyticsEvent("diagnostic_start", {
            first_need: selectedCodes[0]
          });
        }
      });
    });

    if (primaryNeedSelect) {
      primaryNeedSelect.addEventListener("change", () => {
        state.primaryNeed = primaryNeedSelect.value;
      });
    }
  }

  // Adaptación dinámica de palabras según el perfil del alojamiento
  function updateTerminology(tipo) {
    let term = "alojamiento o cada una de sus unidades";
    if (tipo === "vivienda") term = "vivienda vacacional";
    else if (tipo === "apartamento") term = "apartamento";
    else if (tipo === "casa_rural") term = "casa rural";
    else if (tipo === "hotel") term = "habitación o categoría";
    else if (tipo === "otro") term = "alojamiento turístico";

    const unitSpans = app.querySelectorAll(".quiz-unit-term, .quiz-unit-label");
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
        const valAttr = btn.getAttribute("data-val");
        if (valAttr === "na") {
          state.answers[qNum] = "na";
          buttons.forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          if (feedback) {
            feedback.textContent = "No aplica a tu modelo de alojamiento · No penaliza tu puntuación";
          }
        } else {
          const val = parseInt(valAttr, 10);
          state.answers[qNum] = val;
          buttons.forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          if (feedback && scaleTexts[val]) {
            feedback.textContent = scaleTexts[val];
          }
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
        progressText.textContent = "Paso 0 de 7 · Necesidades y perfil";
        progressPercent.textContent = "0% completado";
      } else if (targetStep >= 1 && targetStep <= 7) {
        const pct = Math.round((targetStep / 7) * 100);
        progressFill.style.width = `${pct}%`;
        const pNamesList = ["", "Producto", "Precio", "Plaza", "Promoción", "Personas", "Procesos", "Evidencia"];
        progressText.textContent = `Paso ${targetStep} de 7 · ${pNamesList[targetStep]}`;
        progressPercent.textContent = `${pct}% completado`;
      } else if (targetStep === 8) {
        progressFill.style.width = "100%";
        progressText.textContent = "Diagnóstico completado · Índice calculado";
        progressPercent.textContent = "100% completado";
      }
    }

    // Scroll suave a la cabecera del widget
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Validación inicial y paso a las preguntas
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      if (state.needs.length === 0) {
        alert("Por favor, selecciona al menos un aspecto que te gustaría mejorar en tu alojamiento rural para iniciar el diagnóstico.");
        return;
      }

      if (state.needs.length > 1 && !state.primaryNeed) {
        if (primaryNeedSelect && primaryNeedSelect.value) {
          state.primaryNeed = primaryNeedSelect.value;
        } else {
          state.primaryNeed = state.needs[0];
        }
      }

      // Guardar contexto
      state.profile.sector = tipoSelect ? (tipoSelect.value || "casa") : "casa";
      state.profile.sectorText = tipoSelect?.options[tipoSelect.selectedIndex]?.text || "Casa rural o vivienda vacacional independiente";
      state.profile.units = unidadesInput ? (unidadesInput.value || "1") : "1";
      state.profile.location = ubicacionInput ? ubicacionInput.value.trim() : "";
      state.profile.business = nombreInput ? nombreInput.value.trim() : "";
      state.profile.web = webInput ? webInput.value.trim() : "";

      trackAnalyticsEvent("needs_selected", {
        needs_count: state.needs.length,
        primary_need: state.primaryNeed
      });

      goToStep(1);
    });
  }

  // Botones de siguiente y anterior
  const navNextBtns = app.querySelectorAll(".quiz-btn-next:not(#quiz-btn-start)");
  navNextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.getAttribute("data-target-step"), 10);
      const currentStep = state.currentStep;

      // Si está avanzando de un pilar (1 a 7), validar que las 3 preguntas estén puntuadas
      if (currentStep >= 1 && currentStep <= 7 && targetStep > currentStep) {
        const q1 = (currentStep * 3) - 2;
        const q2 = (currentStep * 3) - 1;
        const q3 = currentStep * 3;
        if (state.answers[q1] === null || state.answers[q2] === null || state.answers[q3] === null) {
          alert("Por favor, puntúa o selecciona 'N/A' en cada una de las 3 preguntas antes de avanzar.");
          return;
        }
      }

      if (targetStep === 8) {
        calculateAndRenderResults();
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

  // Botón para revelar y enfocar el formulario de captación
  const btnUnlockReport = app.querySelector("#btn-unlock-report");
  if (btnUnlockReport) {
    btnUnlockReport.addEventListener("click", () => {
      const formCard = app.querySelector("#quiz-report-form-card");
      if (formCard) {
        formCard.scrollIntoView({ behavior: "smooth", block: "start" });
        const nameInput = formCard.querySelector("#report-name");
        if (nameInput) setTimeout(() => nameInput.focus(), 300);
      }
    });
  }

  // ==========================================================================
  // Cálculo y Presentación Inmediata de Resultados (Paso 8)
  // ==========================================================================
  function calculateAndRenderResults() {
    function calcPillarScore(qIndices) {
      const valid = qIndices
        .map((q) => state.answers[q])
        .filter((val) => typeof val === "number" && !isNaN(val));
      if (valid.length === 0) return null;
      return Math.round((valid.reduce((acc, v) => acc + v, 0) / valid.length) * 10) / 10;
    }

    const rawScores = [
      { key: "p1", name: pNames.p1, score: calcPillarScore([1, 2, 3]) },
      { key: "p2", name: pNames.p2, score: calcPillarScore([4, 5, 6]) },
      { key: "p3", name: pNames.p3, score: calcPillarScore([7, 8, 9]) },
      { key: "p4", name: pNames.p4, score: calcPillarScore([10, 11, 12]) },
      { key: "p5", name: pNames.p5, score: calcPillarScore([13, 14, 15]) },
      { key: "p6", name: pNames.p6, score: calcPillarScore([16, 17, 18]) },
      { key: "p7", name: pNames.p7, score: calcPillarScore([19, 20, 21]) }
    ];

    const validPillars = rawScores.filter((p) => p.score !== null);
    const overallAvg = validPillars.length > 0
      ? (validPillars.reduce((a, b) => a + b.score, 0) / validPillars.length)
      : 6.0;

    const pScores = rawScores.map((p) => ({
      key: p.key,
      name: p.name,
      score: p.score !== null ? p.score : Math.round(overallAvg * 10) / 10
    }));

    const finalAvg = pScores.reduce((sum, p) => sum + p.score, 0) / 7;
    const globalScore100 = Math.min(100, Math.max(10, Math.round(finalAvg * 10)));
    const globalScore10 = finalAvg.toFixed(1);

    // Renderizar Puntuación Global sobre 100
    const globalNumEl = app.querySelector("#res-global-score");
    const globalLevelEl = app.querySelector("#res-global-level");
    const globalDescEl = app.querySelector("#res-global-desc");
    const globalBarEl = app.querySelector("#res-global-bar");

    if (globalNumEl) globalNumEl.textContent = String(globalScore100);

    if (globalBarEl) {
      globalBarEl.style.width = `${globalScore100}%`;
      if (globalScore100 < 50) globalBarEl.style.background = "linear-gradient(90deg, #ef4444, #f87171)";
      else if (globalScore100 < 70) globalBarEl.style.background = "linear-gradient(90deg, #f59e0b, #fbbf24)";
      else globalBarEl.style.background = "linear-gradient(90deg, #10b981, #34d399)";
    }

    if (globalLevelEl && globalDescEl) {
      if (globalScore100 <= 49) {
        globalLevelEl.textContent = "Tu Índice: " + globalScore100 + "/100 · Nivel Inicial de Madurez";
        globalDescEl.textContent = "Tus prácticas comerciales se apoyan principalmente en la reacción puntual ante la demanda. Tienes una oportunidad directa para asentar métodos estables en tarifas, canales y presentación sin complicarte con herramientas caras.";
      } else if (globalScore100 <= 69) {
        globalLevelEl.textContent = "Tu Índice: " + globalScore100 + "/100 · Buen Punto de Partida con Margen de Mejora";
        globalDescEl.textContent = "Cuentas con bases de gestión y métodos definidos, aunque todavía se aplican de forma irregular. Establecer rutinas fijas y optimizar tus canales te permitirá defender mejor tu margen neto frente a comisiones de intermediarios.";
      } else if (globalScore100 <= 84) {
        globalLevelEl.textContent = "Tu Índice: " + globalScore100 + "/100 · Nivel Comercial Consolidado";
        globalDescEl.textContent = "Tienes procesos claros y registrados en la mayor parte de las áreas comerciales. Tu principal palanca de rentabilidad consiste en afinar la conversión de venta directa y optimizar la ocupación en fechas de menor demanda.";
      } else {
        globalLevelEl.textContent = "Tu Índice: " + globalScore100 + "/100 · Nivel de Gestión Avanzada y Excelente";
        globalDescEl.textContent = "Demuestras un control riguroso y una gestión guiada por datos en tus canales y procesos. El foco consiste en proteger la rentabilidad neta y rentabilizar aún más la fidelización de antiguos huéspedes.";
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

    const mainStrength = sortedDesc[0];
    const mainPriority = sortedAsc[0];

    const strengthsListEl = app.querySelector("#res-strengths-list");
    if (strengthsListEl) {
      strengthsListEl.innerHTML = `
        <li>
          <strong>${mainStrength.name} (${mainStrength.score.toFixed(1)}/10):</strong>
          ${pInsights[mainStrength.key]?.strength || "Área con prácticas comerciales consolidadas."}
        </li>
      `;
    }

    const prioritiesListEl = app.querySelector("#res-priorities-list");
    if (prioritiesListEl) {
      prioritiesListEl.innerHTML = `
        <li>
          <strong>${mainPriority.name} (${mainPriority.score.toFixed(1)}/10):</strong>
          ${pInsights[mainPriority.key]?.priority || "Área prioritaria para impulsar reservas directas."}
        </li>
      `;
    }

    // Recomendación de marca personalizada
    const rec = pyme360GetBrandRecommendation(state.primaryNeed, pScores, state.profile.location, state.profile.sector, state.needs);
    const recKicker = app.querySelector("#rec-kicker");
    const recTitle = app.querySelector("#rec-title");
    const recText = app.querySelector("#rec-text");
    const recBookingBtn = app.querySelector("#rec-booking-btn");

    if (recKicker) recKicker.textContent = `Recomendación comercial adaptada · Solución para tu caso`;
    if (recTitle) recTitle.textContent = rec.title;
    if (recText) recText.textContent = rec.text;

    // Configuración del botón de agenda
    if (recBookingBtn) {
      const bookingMsg = `Hola, he completado el diagnóstico comercial para ${state.profile.business || "mi alojamiento rural"} (Puntuación: ${globalScore100}/100, Prioridad: ${needsDescriptions[state.primaryNeed] || state.primaryNeed}). Me gustaría reservar la sesión gratuita de asesoramiento de 20 minutos.`;
      const finalAgendaUrl = (typeof window !== "undefined" && window.PYME360_AGENDA_URL)
        ? window.PYME360_AGENDA_URL
        : `https://wa.me/34686184291?text=${encodeURIComponent(bookingMsg)}`;

      recBookingBtn.href = finalAgendaUrl;
      recBookingBtn.addEventListener("click", () => {
        trackAnalyticsEvent("booking_click", {
          score_100: globalScore100,
          primary_need: state.primaryNeed,
          brand: rec.brand
        });
      });
    }

    // Pre-rellenar formulario de informe con datos de perfil si existen
    const reportName = app.querySelector("#report-name");
    const reportBusiness = app.querySelector("#report-business");
    const reportLocation = app.querySelector("#report-location");

    if (reportBusiness && state.profile.business && !reportBusiness.value) {
      reportBusiness.value = state.profile.business;
    }
    if (reportLocation && state.profile.location && !reportLocation.value) {
      reportLocation.value = state.profile.location;
    }

    // GA4 evento de diagnóstico completado
    trackAnalyticsEvent("diagnostic_complete", {
      score_100: globalScore100,
      primary_need: state.primaryNeed,
      recommended_brand: rec.brand
    });
  }

  // ==========================================================================
  // Envío del Informe Detallado por Correo
  // ==========================================================================
  const emailForm = app.querySelector("#quiz-email-form");
  if (emailForm) {
    let leadReportSent = false;
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (leadReportSent) {
        console.warn("La solicitud de informe ya ha sido registrada previamente en esta sesión.");
        return;
      }

      const submitBtn = emailForm.querySelector("#report-submit-btn");
      const statusMsg = emailForm.querySelector("#report-status-msg");

      const nameVal = emailForm.querySelector("#report-name")?.value.trim() || "";
      const emailVal = emailForm.querySelector("#report-email")?.value.trim() || "";
      const businessVal = emailForm.querySelector("#report-business")?.value.trim() || state.profile.business || "";
      const locationVal = emailForm.querySelector("#report-location")?.value.trim() || state.profile.location || "Sin especificar";
      const phoneVal = emailForm.querySelector("#report-phone")?.value.trim() || "";
      const newsletterBox = emailForm.querySelector("#report-newsletter");
      const privacyBox = emailForm.querySelector("#report-privacy");

      if (!privacyBox || !privacyBox.checked) {
        alert("Debes aceptar la política de privacidad para que podamos generar y enviarte el informe.");
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

      // Cálculo del informe de Autoevaluación 7P
      let sum = 0;
      for (let i = 1; i <= 21; i++) sum += (state.answers[i] || 1);
      const globalScore100 = Math.min(100, Math.max(10, Math.round((sum / (21 * 10)) * 100)));
      const globalScore10 = (sum / 21).toFixed(1);

      const pScores = [
        { key: "p1", name: "1. Producto", score: (((state.answers[1] || 1) + (state.answers[2] || 1) + (state.answers[3] || 1)) / 3) },
        { key: "p2", name: "2. Precio", score: (((state.answers[4] || 1) + (state.answers[5] || 1) + (state.answers[6] || 1)) / 3) },
        { key: "p3", name: "3. Plaza (Canales)", score: (((state.answers[7] || 1) + (state.answers[8] || 1) + (state.answers[9] || 1)) / 3) },
        { key: "p4", name: "4. Promoción", score: (((state.answers[10] || 1) + (state.answers[11] || 1) + (state.answers[12] || 1)) / 3) },
        { key: "p5", name: "5. Personas", score: (((state.answers[13] || 1) + (state.answers[14] || 1) + (state.answers[15] || 1)) / 3) },
        { key: "p6", name: "6. Procesos", score: (((state.answers[16] || 1) + (state.answers[17] || 1) + (state.answers[18] || 1)) / 3) },
        { key: "p7", name: "7. Evidencia física y digital", score: (((state.answers[19] || 1) + (state.answers[20] || 1) + (state.answers[21] || 1)) / 3) }
      ];

      const sortedAsc = [...pScores].sort((a, b) => a.score - b.score);
      const sortedDesc = [...pScores].sort((a, b) => b.score - a.score);

      const prio1 = sortedAsc[0];
      const prio2 = sortedAsc[1];
      const prio3 = sortedAsc[2];
      const fort1 = sortedDesc[0];
      const fort2 = sortedDesc[1];
      const fort3 = sortedDesc[2];

      const rec = pyme360GetBrandRecommendation(state.primaryNeed, pScores, locationVal, state.profile.sector, state.needs);

      const questionLabels = {
        1: "P1 Producto · Definición de huésped objetivo por temporada",
        2: "P1 Producto · Claridad de la propuesta y valor diferencial",
        3: "P1 Producto · Equipamiento, confort y detalles clave para el huésped",
        4: "P2 Precio · Tarifas estructuradas por temporada y estancia",
        5: "P2 Precio · Control del margen neto tras comisiones de venta",
        6: "P2 Precio · Paridad e incentivos claros para la reserva directa",
        7: "P3 Canales · Canales de venta alineados con tu público objetivo",
        8: "P3 Canales · Calendarios unificados y sincronizados en tiempo real",
        9: "P3 Canales · Web propia con consulta de disponibilidad y reserva",
        10: "P4 Promoción · Plan comercial para fechas valle y meses flojos",
        11: "P4 Promoción · Medición del retorno de acciones comerciales",
        12: "P4 Promoción · Optimización de ficha Google Business y SEO local",
        13: "P5 Personas · Responsabilidades comerciales y de atención claras",
        14: "P5 Personas · Agilidad en respuesta a consultas calientes (< 1h)",
        15: "P5 Personas · Protocolo activo de reseñas y reputación online",
        16: "P6 Procesos · Facilidad en el paso de consulta a reserva directa",
        17: "P6 Procesos · Seguimiento y fidelización de antiguos huéspedes",
        18: "P6 Procesos · Instrucciones automatizadas y guía digital de bienvenida",
        19: "P7 Evidencia · Fotografías y vídeos atractivos y profesionales",
        20: "P7 Evidencia · Información práctica clara en web (normas, servicios)",
        21: "P7 Evidencia · Cuidado de detalles físicos y experiencia memorable"
      };

      const detailedAnswers = [];
      for (let i = 1; i <= 21; i++) {
        const val = state.answers[i];
        const valStr = val === "na" ? "N/A (No aplica a este modelo)" : `${val || 1} / 10`;
        detailedAnswers.push(`- Q${i < 10 ? '0' + i : i} [${questionLabels[i]}]: ${valStr}`);
      }

      const problemReportText = [
        `============================================================`,
        `INFORME COMPLETO DE AUTOEVALUACIÓN COMERCIAL 7P`,
        `Pyme360 Growth · Alojamientos Turísticos Independientes de España`,
        `============================================================`,
        ``,
        `DATOS DEL ALOJAMIENTO:`,
        `- Alojamiento: ${businessVal}`,
        `- Tipo: ${state.profile.sectorText || state.profile.sector || "No especificado"}`,
        `- Habitaciones / Unidades: ${state.profile.units || "1"}`,
        `- Ubicación: ${locationVal}`,
        `- Web o enlace: ${state.profile.web || "No facilitada"}`,
        ``,
        `NECESIDADES DECLARADAS:`,
        `- Aspectos seleccionados: ${state.needs.map(n => n + ': ' + (needsDescriptions[n] || '')).join('; ') || 'No especificado'}`,
        `- Prioridad principal: ${state.primaryNeed ? (state.primaryNeed + ': ' + (needsDescriptions[state.primaryNeed] || '')) : 'No especificada'}`,
        `- Solución recomendada: ${rec.brand} (${rec.title})`,
        ``,
        `DATOS DE CONTACTO DEL RESPONSABLE:`,
        `- Nombre: ${nameVal}`,
        `- Email: ${emailVal}`,
        `- Teléfono / WhatsApp: ${phoneVal || "No facilitado"}`,
        `- Newsletter comercial: ${newsletterBox && newsletterBox.checked ? "Sí, suscrito voluntariamente" : "No"}`,
        `- Privacidad: Aceptada conforme a RGPD`,
        `- Atribución campaña: source=${state.utms.source || 'directo'}, campaign=${state.utms.campaign || 'ninguna'}, medium=${state.utms.medium || 'ninguno'}`,
        ``,
        `------------------------------------------------------------`,
        `RESULTADO GLOBAL: ${globalScore100} / 100 (${globalScore10} / 10 en madurez comercial)`,
        `------------------------------------------------------------`,
        ``,
        `DESGLOSE DE LAS 7 P DEL MARKETING MIX:`,
        pScores.map(p => `- ${p.name}: ${p.score.toFixed(1)} / 10`).join("\n"),
        ``,
        `------------------------------------------------------------`,
        `TRES FORTALEZAS SUSTENTADAS EN LAS RESPUESTAS:`,
        `1. ${fort1.name} (${fort1.score.toFixed(1)}/10): ${pInsights[fort1.key]?.strength || "Práctica comercial afianzada."}`,
        `2. ${fort2.name} (${fort2.score.toFixed(1)}/10): ${pInsights[fort2.key]?.strength || "Práctica comercial afianzada."}`,
        `3. ${fort3.name} (${fort3.score.toFixed(1)}/10): ${pInsights[fort3.key]?.strength || "Práctica comercial afianzada."}`,
        ``,
        `------------------------------------------------------------`,
        `TRES OPORTUNIDADES PRIORITARIAS DE MEJORA:`,
        `1. ${prio1.name} (${prio1.score.toFixed(1)}/10): ${pInsights[prio1.key]?.priority || "Revisar y asentar métodos claros."}`,
        `2. ${prio2.name} (${prio2.score.toFixed(1)}/10): ${pInsights[prio2.key]?.priority || "Revisar y asentar métodos claros."}`,
        `3. ${prio3.name} (${prio3.score.toFixed(1)}/10): ${pInsights[prio3.key]?.priority || "Revisar y asentar métodos claros."}`,
        ``,
        `PROBLEMA PRIORITARIO:`,
        `El área de mayor fricción identificada es ${prio1.name}. Descuidar este aspecto suele provocar fugas directas de margen hacia intermediarios y pérdida de consultas de clientes interesados.`,
        ``,
        `TRES ACCIONES PRÁCTICAS RECOMENDADAS:`,
        `1. ${pInsights[prio1.key]?.action || "Revisar la propuesta de valor y destacar qué incluye tu alojamiento."}`,
        `2. ${pInsights[prio2.key]?.action || "Calcular el margen neto real tras comisiones y crear un incentivo directo en web."}`,
        `3. ${pInsights[prio3.key]?.action || "Optimizar la presencia móvil y simplificar los datos de contacto."}`,
        ``,
        `PRÓXIMO PASO RECOMENDADO:`,
        `${rec.nextStep}`,
        ``,
        `PROPUESTA COMERCIAL ADAPTADA (${rec.brand}):`,
        `${rec.text}`,
        ``,
        `------------------------------------------------------------`,
        `DETALLE DE LAS 21 PREGUNTAS Y PUNTUACIÓN (1 al 10):`,
        detailedAnswers.join("\n"),
        ``,
        `============================================================`
      ].join("\n");

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        business: businessVal,
        sector: state.profile.sectorText || state.profile.sector,
        accommodation_type: state.profile.sector || "vivienda",
        location: locationVal,
        web: state.profile.web || "",
        units: state.profile.units || "1",
        problem: problemReportText,
        source: "indice_pyme360_autoevaluacion",
        newsletter: newsletterBox && newsletterBox.checked ? "yes" : "",
        privacy: "yes",
        needs: state.needs,
        primary_need: state.primaryNeed,
        recommended_brand: rec.brand,
        complementary_brand: rec.complementaryBrand ? rec.complementaryBrand.brand : "",
        score_100: globalScore100,
        utms: state.utms
      };

      try {
        const fullPayload = pyme360BuildIndiceLeadPayload(payload);
        const submitResult = await pyme360SubmitIndiceLead(fullPayload);

        // Disparar Lead SOLO cuando la solicitud se haya enviado correctamente al backend y una sola vez
        if (!leadReportSent) {
          leadReportSent = true;
          trackAnalyticsEvent("generate_lead", {
            primary_need: state.primaryNeed,
            recommended_brand: rec.brand
          });
        }

        if (submitResult && submitResult.email_sent === false) {
          if (statusMsg) {
            statusMsg.textContent = "Tu solicitud se ha procesado, pero no se pudo confirmar el envío del informe por correo. Revisa la carpeta de spam o promociones y, si no aparece, escríbenos a info@pyme360.online.";
            statusMsg.classList.add("is-error");
            statusMsg.style.display = "block";
          }
          if (submitBtn) {
            submitBtn.textContent = "Correo no confirmado";
          }
          return;
        }

        if (statusMsg) {
          statusMsg.textContent = "Solicitud recibida. El servidor ha aceptado el envío del informe a " + emailVal + ". Revisa también spam o promociones. Puedes reservar tu sesión de asesoramiento de 20 minutos a continuación.";
          statusMsg.classList.add("is-success");
          statusMsg.style.display = "block";
        }
        if (submitBtn) {
          submitBtn.textContent = "Solicitud recibida ✓";
        }
      } catch (err) {
        console.error("Error al enviar autoevaluacion lead:", err);
        if (statusMsg) {
          statusMsg.textContent = "No se pudo conectar con el servidor en este momento. Tus resultados siguen visibles en pantalla; escríbenos directamente a info@pyme360.online con tus resultados.";
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
    state.needs = ["B", "C"];
    state.primaryNeed = "B";
    state.profile = {
      sector: "casa",
      sectorText: "Casa rural o vivienda vacacional independiente",
      units: "6",
      location: "Asturias",
      business: "Finca El Valle",
      web: "fincaelvalle.es"
    };
    state.answers = {
      1: 8, 2: 7, 3: 5,
      4: 4, 5: 6, 6: 5,
      7: 4, 8: 3, 9: 8,
      10: 7, 11: 6, 12: 5,
      13: 7, 14: 6, 15: 6,
      16: 5, 17: 4, 18: 5,
      19: 7, 20: 6, 21: 7
    };
    calculateAndRenderResults();
    goToStep(8);
  }

  if (typeof window !== "undefined") {
    window.pyme360VerResultadosDemo = function() {
      state.needs = ["B", "C"];
      state.primaryNeed = "B";
      state.profile = {
        sector: "casa",
        sectorText: "Casa rural o vivienda vacacional independiente",
        units: "6",
        location: "Asturias",
        business: "Finca El Valle",
        web: "fincaelvalle.es"
      };
      state.answers = {
        1: 8, 2: 7, 3: 5,
        4: 4, 5: 6, 6: 5,
        7: 4, 8: 3, 9: 8,
        10: 7, 11: 6, 12: 5,
        13: 7, 14: 6, 15: 6,
        16: 5, 17: 4, 18: 5,
        19: 7, 20: 6, 21: 7
      };
      calculateAndRenderResults();
      goToStep(8);
    };
    window.pyme360GetBrandRecommendation = pyme360GetBrandRecommendation;
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


/* ==========================================================================
   Gestión de consentimiento de Cookies y Carga diferida de Analytics y Meta Pixel
   ========================================================================== */
var META_PIXEL_ID = (function() {
  if (typeof window !== "undefined") {
    var host = window.location ? window.location.hostname : "";
    // Todo override está estrictamente confinado dentro de localhost / 127.0.0.1
    if (host === "localhost" || host === "127.0.0.1") {
      if (window.META_PIXEL_ID && /^\d+$/.test(window.META_PIXEL_ID)) {
        return window.META_PIXEL_ID;
      }
      var qaId = new URLSearchParams(window.location.search).get("qa_pixel_id");
      if (qaId && /^\d+$/.test(qaId)) {
        return qaId;
      }
      // Dataset exclusivo de QA para desarrollo y pruebas locales
      return "2378358353015122";
    }
  }
  return "1508603327820296";
})();

function pyme360LoadAnalytics() {
  if (typeof window === "undefined" || window._pyme360AnalyticsLoaded) return;
  window._pyme360AnalyticsLoaded = true;

  // 1. Google Analytics 4
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

  // 2. Meta Pixel (1508603327820296)
  if (typeof window.fbq !== "function") {
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else if (b.head) {
        b.head.appendChild(t);
      }
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  }

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
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
    '    <strong>Privacidad y cookies:</strong> Utilizamos cookies analíticas y de medición (Google Analytics y Meta Pixel) para evaluar visitas y mejorar nuestro servicio. Puedes aceptarlas o rechazarlas libremente. Consulta nuestra <a href="/cookies.html">política de cookies</a>.',
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

