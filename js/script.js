(function () {
  "use strict";

  const root = document.documentElement;

  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = themeBtn.querySelector("i");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (err) {
      return null;
    }
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
    }
  });

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navIcon = navToggle.querySelector("i");

  function setMenu(open) {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navIcon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  navToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("is-open"));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const toTop = document.getElementById("to-top");

  window.addEventListener("scroll", () => {
    toTop.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav__link");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
  const fills = document.querySelectorAll(".bar__fill");

  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.level + "%";
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  fills.forEach((fill) => barObserver.observe(fill));

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (value) => (value.length < 2 ? "Please enter your name (at least 2 characters)." : ""),
    email: (value) => {
      if (!value) return "Please enter your email address.";
      return emailPattern.test(value) ? "" : "That email doesn't look right. Try name@example.com.";
    },
    message: (value) => (value.length < 10 ? "Your message needs at least 10 characters." : "")
  };

  function validateField(input) {
    const field = input.closest(".field");
    const error = field.querySelector(".field__error");
    const message = rules[input.name](input.value.trim());
    error.textContent = message;
    field.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    let allValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      const firstInvalid = form.querySelector(".has-error input, .has-error textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.textContent = "Thanks! Your message is ready to send. I'll reply within two days.";
    form.reset();
  });
})();
