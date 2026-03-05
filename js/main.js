(() => {
  // Year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navPanel = document.getElementById("navPanel");

  function closeNav() {
    if (!navPanel) return;
    navPanel.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  navToggle?.addEventListener("click", () => {
    const open = navPanel.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close menu on link click
  navPanel?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeNav());
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!navPanel || !navToggle) return;
    const target = e.target;
    const clickedInside = navPanel.contains(target) || navToggle.contains(target);
    if (!clickedInside) closeNav();
  });

  // Reveal on scroll
  const els = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));

  // Top progress bar
  const fill = document.getElementById("scrollFill");
  function onScroll(){
    if (!fill) return;
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    fill.style.width = `${pct}%`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Contact form (front-end validation only)
    const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!status) return;

    const fd = new FormData(form);
    const required = ["name","email","business","need","message"];
    const missing = required.filter(k => !String(fd.get(k) || "").trim());

    if (missing.length) {
      status.textContent = "Please complete all fields before sending.";
      status.style.color = "#2B2E2C";
      return;
    }

    const email = String(fd.get("email"));
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = "Please enter a valid email address.";
      status.style.color = "#2B2E2C";
      return;
    }

    status.textContent = "Sending...";
    status.style.color = "#2B2E2C";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: fd,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        status.textContent = "Sent. We’ll respond with next steps shortly.";
        status.style.color = "#1F3A2E";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please email info@oakandpixel.co.za.";
        status.style.color = "#2B2E2C";
      }
    } catch {
      status.textContent = "Network error. Please email info@oakandpixel.co.za.";
      status.style.color = "#2B2E2C";
    }
  });

})();
