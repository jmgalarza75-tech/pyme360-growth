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
