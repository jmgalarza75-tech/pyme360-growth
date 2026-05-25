const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const testimonials = [
  {
    id: 32,
    author: "Home4Escape",
    sector: "Hospitality y alquiler vacacional",
    quote: "Pyme360 nos ayudo a ordenar la captacion y convertir la presencia digital en una herramienta comercial, no solo en una web bonita."
  },
  {
    id: 47,
    author: "Nomads Jungle",
    sector: "Experiencias y comunidad viajera",
    quote: "Por fin entendimos que acciones priorizar. El diagnostico aterrizo el marketing en decisiones concretas para crecer."
  },
  {
    id: 12,
    author: "Cafeteria Brisa",
    sector: "Caso tipo de pyme local",
    quote: "Necesitabamos mas clientes locales sin perdernos en tecnicismos. El sistema nos dio foco, seguimiento y una ruta clara."
  }
];

function rotateTestimonials(items) {
  if (items.length < 2) return items;
  return [...items.slice(1), items[0]];
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
        <img src="https://i.pravatar.cc/128?img=${testimonial.id}" alt="Avatar de ${testimonial.author}">
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
    current_status: "scraped",
    form_submitted: true,
    lead_magnet_sent: false,
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

if (typeof window !== "undefined") {
  window.pyme360Testimonials = testimonials;
  window.pyme360RotateTestimonials = rotateTestimonials;
  window.pyme360BuildLeadPayload = pyme360BuildLeadPayload;
  window.pyme360SubmitLead = pyme360SubmitLead;
}

if (leadForm) {
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
