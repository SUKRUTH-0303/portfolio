// Navigation, theme switcher and small progressive enhancements.
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const themeToggle = document.getElementById("themeToggle");
const currentYear = document.getElementById("currentYear");

if (currentYear) currentYear.textContent = new Date().getFullYear();

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Respect the visitor's saved theme choice; default to the dark design.
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.documentElement.dataset.theme = "light";

function updateThemeButton() {
  const isLight = document.documentElement.dataset.theme === "light";
  if (themeToggle) {
    themeToggle.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  }
}
updateThemeButton();

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.dataset.theme !== "light";
  if (isLight) {
    document.documentElement.dataset.theme = "light";
    localStorage.setItem("portfolio-theme", "light");
  } else {
    delete document.documentElement.dataset.theme;
    localStorage.setItem("portfolio-theme", "dark");
  }
  updateThemeButton();
});

// Highlight the current section in the desktop navigation.
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  observedSections.forEach((section) => observer.observe(section));
}


// Reveal the Trumetric work showcase as it enters the viewport.
const revealItems = document.querySelectorAll(".reveal-on-scroll");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else { revealItems.forEach((item) => item.classList.add("is-visible")); }

/* =====================================
   TRUMETRIC SEARCH TYPEWRITER EFFECT
===================================== */

const typewriter = document.querySelector("[data-typewriter]");

if (typewriter) {

    const phrases = [
        "cancer care in Bengaluru",
        "hospitals with cardiac care in Bengaluru",
        "oncology specialists in Bengaluru",
        "best hospitals for cancer treatment in Bengaluru",
        "top cardiac care centers in Bengaluru"
    ];

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {

        typewriter.textContent = phrases[0];

    } else {

        let phraseIndex = 0;
        let characterIndex = 0;
        let deleting = false;
        let started = false;

        function typeEffect() {

            const currentPhrase = phrases[phraseIndex];

            // Display the current text
            typewriter.textContent =
                currentPhrase.substring(0, characterIndex);

            if (!deleting && characterIndex < currentPhrase.length) {

                // Type one character
                characterIndex++;

                setTimeout(typeEffect, 50);

            } else if (!deleting && characterIndex === currentPhrase.length) {

                // Wait after completing the phrase
                deleting = true;

                setTimeout(typeEffect, 1600);

            } else if (deleting && characterIndex > 0) {

                // Delete one character
                characterIndex--;

                setTimeout(typeEffect, 25);

            } else {

                // Move to the next phrase
                deleting = false;

                phraseIndex =
                    (phraseIndex + 1) % phrases.length;

                setTimeout(typeEffect, 350);
            }
        }

        // Start only when the showcase enters the viewport
        function startTyping() {

            if (started) return;

            started = true;
            typeEffect();
        }

        const showcase = document.querySelector(".work-showcase");

        if ("IntersectionObserver" in window && showcase) {

            const typingObserver = new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            startTyping();

                            observer.disconnect();
                        }
                    });

                },
                { threshold: 0.2 }
            );

            typingObserver.observe(showcase);

        } else {

            startTyping();
        }
    }
}