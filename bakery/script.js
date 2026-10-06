// ===== Mobile navigation =====
const navToggle = document.getElementById("navToggle");
const navClose = document.getElementById("navClose");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav__link");

function openNav() {
  nav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.contains("is-open");
  if (isOpen) closeNav();
  else openNav();
});
navClose.addEventListener("click", closeNav);
navLinks.forEach((link) => link.addEventListener("click", closeNav));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

// ===== Product / category filter =====
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".product-card");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const category = btn.dataset.filter;

    cards.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !match);
    });
  });
});

// ===== Contact form validation =====
const form = document.getElementById("contactForm");
const success = document.getElementById("formSuccess");

const validators = {
  name: (v) => (v.trim() ? "" : "Please enter your name."),
  email: (v) => {
    const valid = /^\S+@\S+\.\S+$/.test(v.trim());
    return valid ? "" : "Please enter a valid email address.";
  },
  message: (v) => (v.trim() ? "" : "Please add a short message."),
};

function showFieldError(name, message) {
  const input = form.querySelector(`[name="${name}"]`);
  const errorBox = form.querySelector(`.field__error[data-for="${name}"]`);
  if (message) {
    input?.parentElement.classList.add("is-invalid");
    errorBox.textContent = message;
  } else {
    input?.parentElement.classList.remove("is-invalid");
    errorBox.textContent = "";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  Object.entries(validators).forEach(([name, validate]) => {
    const message = validate(form[name].value);
    showFieldError(name, message);
    if (message) isValid = false;
  });

  if (isValid) {
    success.hidden = false;
    form.reset();
  }
});

// Clear the error as the user fixes a field
Object.keys(validators).forEach((name) => {
  form[name]?.addEventListener("input", () => {
    showFieldError(name, "");
  });
});
