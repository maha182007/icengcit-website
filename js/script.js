/**
 * ICENGCIT 2027 — Main JavaScript
 * ─────────────────────────────────────────────────────────
 * Handles: Navigation, Scroll reveal, Tab switching,
 *          Countdown timer, and all Form submissions via Fetch API.
 *
 * BACKEND: Search for "BACKEND:" comments to find all integration points.
 * API_BASE: Update this constant when deploying with a real backend.
 */

"use strict";

// ─────────────────────────────────────────────────────────
// BACKEND: Update this base URL to your deployed server
// ─────────────────────────────────────────────────────────
const API_BASE = ""; // e.g. "https://api.icengcit.org" or "/api"

// ─────────────────────────────────────────────────────────
// DOM READY
// ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollReveal();
  initCommitteeTabs();
  initCountdown();
  initContactForm();
  initPaperForm();
  initRegistrationForm();
});

// ─────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  // Scroll shadow
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      hamburger.setAttribute("aria-expanded", isOpen);
      hamburger.querySelectorAll("span")[0].style.transform = isOpen ? "rotate(45deg) translateY(7px)" : "";
      hamburger.querySelectorAll("span")[1].style.opacity  = isOpen ? "0" : "1";
      hamburger.querySelectorAll("span")[2].style.transform = isOpen ? "rotate(-45deg) translateY(-7px)" : "";
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
      });
    });
  }

  // Active section highlight
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute("href") === `#${entry.target.id}` ? "var(--accent)" : "";
        });
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px" });

  sections.forEach(s => observer.observe(s));
}

// ─────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children slightly
        setTimeout(() => entry.target.classList.add("visible"), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────
// COMMITTEE TABS
// ─────────────────────────────────────────────────────────
function initCommitteeTabs() {
  const tabs   = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".committee-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add("active");
    });
  });
}

// ─────────────────────────────────────────────────────────
// COUNTDOWN TIMER
// ─────────────────────────────────────────────────────────
function initCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  // BACKEND: Update this date or fetch it from /api/config
  const targetDate = new Date("2027-03-15T09:00:00");

  function update() {
    const now  = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      el.innerHTML = `<span style="color:var(--accent);font-size:1.2rem;font-weight:700">Conference is LIVE 🎉</span>`;
      return;
    }

    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);

    const pad = n => String(n).padStart(2, "0");
    el.innerHTML = `
      <div class="cd-unit"><span class="cd-num">${d}</span><span class="cd-label">Days</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-unit"><span class="cd-num">${pad(h)}</span><span class="cd-label">Hours</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-unit"><span class="cd-num">${pad(m)}</span><span class="cd-label">Mins</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-unit"><span class="cd-num">${pad(s)}</span><span class="cd-label">Secs</span></div>
    `;
  }

  update();
  setInterval(update, 1000);
}

// ─────────────────────────────────────────────────────────
// FORM HELPER UTILITIES
// ─────────────────────────────────────────────────────────
function setLoading(btn, state) {
  btn.classList.toggle("loading", state);
  btn.disabled = state;
}

function showFeedback(el, type, message) {
  el.className = `form-feedback ${type}`;
  el.textContent = message;
  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (type === "success") {
    setTimeout(() => { el.style.display = "none"; }, 6000);
  }
}

function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

// ─────────────────────────────────────────────────────────
// CONTACT FORM
// BACKEND: POST /api/contact
//   Expected body: { name, email, subject, message }
//   Expected response: { success: true, message: "..." }
// ─────────────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn      = form.querySelector(".btn-submit");
    const feedback = document.getElementById("contactFeedback");
    const payload  = getFormData(form);

    if (!payload.email || !payload.name || !payload.message) {
      showFeedback(feedback, "error", "Please fill in all required fields.");
      return;
    }

    setLoading(btn, true);

    try {
      // BACKEND: Replace with real endpoint
      const res  = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // BACKEND: Handle real response parsing here
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      showFeedback(feedback, "success", data.message || "Message sent! We'll get back to you shortly.");
      form.reset();
    } catch (err) {
      // BACKEND: In dev, simulate success. Remove this block in production.
      if (API_BASE === "") {
        showFeedback(feedback, "success", "✓ Message received! (Demo mode — connect backend to enable real submission)");
        form.reset();
      } else {
        showFeedback(feedback, "error", "Failed to send. Please try again or email us directly.");
      }
    } finally {
      setLoading(btn, false);
    }
  });
}

// ─────────────────────────────────────────────────────────
// PAPER SUBMISSION FORM
// BACKEND: POST /api/submit-paper
//   Expected body: { title, authors, abstract, track, file (base64 or multipart) }
//   Expected response: { success: true, paperId: "ICENG-XXXX", message: "..." }
//   NOTE: For file uploads, switch Content-Type to multipart/form-data
//         Remove JSON.stringify, pass FormData directly as body
// ─────────────────────────────────────────────────────────
function initPaperForm() {
  const form = document.getElementById("paperForm");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn      = form.querySelector(".btn-submit");
    const feedback = document.getElementById("paperFeedback");

    // BACKEND: For file upload, use FormData directly (see note above)
    const payload = getFormData(form);

    setLoading(btn, true);

    try {
      // BACKEND: Replace with real endpoint
      const res  = await fetch(`${API_BASE}/api/submit-paper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      showFeedback(feedback, "success",
        `✓ Paper submitted! Your ID: ${data.paperId || "ICENG-XXXX"}. Confirmation sent to ${payload.email}.`);
      form.reset();
    } catch (err) {
      // BACKEND: Dev simulation
      if (API_BASE === "") {
        showFeedback(feedback, "success",
          "✓ Paper received! (Demo mode) — Your paper ID: ICENG-2027-DEMO. Connect backend to enable real tracking.");
        form.reset();
      } else {
        showFeedback(feedback, "error", "Submission failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(btn, false);
    }
  });
}

// ─────────────────────────────────────────────────────────
// REGISTRATION FORM
// BACKEND: POST /api/register
//   Expected body: { name, email, phone, institution, category, dietary }
//   Expected response: { success: true, regId: "REG-XXXX", paymentUrl: "..." }
//   NOTE: After successful registration, redirect to paymentUrl for payment
// ─────────────────────────────────────────────────────────
function initRegistrationForm() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn      = form.querySelector(".btn-submit");
    const feedback = document.getElementById("registrationFeedback");
    const payload  = getFormData(form);

    setLoading(btn, true);

    try {
      // BACKEND: Replace with real endpoint
      const res  = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      // BACKEND: Uncomment to redirect to payment page
      // if (data.paymentUrl) window.location.href = data.paymentUrl;

      showFeedback(feedback, "success",
        `✓ Registration received! ID: ${data.regId || "REG-XXXX"}. Check your email for next steps.`);
      form.reset();
    } catch (err) {
      // BACKEND: Dev simulation
      if (API_BASE === "") {
        showFeedback(feedback, "success",
          "✓ Registration recorded! (Demo mode) — ID: REG-2027-DEMO. Connect backend to enable payments.");
        form.reset();
      } else {
        showFeedback(feedback, "error", "Registration failed. Please try again or contact us.");
      }
    } finally {
      setLoading(btn, false);
    }
  });
}
