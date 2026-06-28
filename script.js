const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const progress = document.getElementById("pageProgress");
const backToTop = document.getElementById("backToTop");
const copyEmail = document.getElementById("copyEmail");
const copyNote = document.getElementById("copyNote");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const email = "info.addincse@gmail.com";

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    });
  });
}

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progress) progress.style.width = `${percent}%`;
  if (backToTop) backToTop.classList.toggle("visible", scrollTop > 600);
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progressValue < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.45 });

document.querySelectorAll(".metric-number").forEach((el) => counterObserver.observe(el));

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

const navItems = document.querySelectorAll(".nav-links a[href^='#']");
const sections = Array.from(navItems)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    navItems.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => activeObserver.observe(section));


if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);

    formStatus.textContent = "Sending your message...";
    formStatus.classList.remove("success", "error");
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = "Message sent successfully. I will get back to you soon.";
        formStatus.classList.add("success");
      } else {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data?.errors?.[0]?.message || "Something went wrong. Please email me directly.";
        formStatus.textContent = errorMessage;
        formStatus.classList.add("error");
      }
    } catch (error) {
      formStatus.textContent = "Network error. Please email me directly at info.addincse@gmail.com.";
      formStatus.classList.add("error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

if (copyEmail && copyNote) {
  copyEmail.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyNote.textContent = "Email copied to clipboard.";
    } catch (error) {
      copyNote.textContent = email;
    }
  });
}

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});
