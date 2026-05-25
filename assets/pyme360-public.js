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

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (leadForm.querySelector(".form-success")) {
      return;
    }

    const submitButton = leadForm.querySelector("button[type='submit']");

    if (submitButton) {
      submitButton.textContent = "Solicitud recibida";
      submitButton.setAttribute("disabled", "true");
    }

    leadForm.insertAdjacentHTML(
      "beforeend",
      '<p class="form-success form-wide" role="status">Gracias. Hemos recibido tu solicitud de diagnostico y te contactaremos para preparar la revision.</p>'
    );
  });
}
