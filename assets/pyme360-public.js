const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

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
