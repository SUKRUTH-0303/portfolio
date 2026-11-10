
// =====================================
// NAVIGATION, THEME & ENHANCEMENTS
// =====================================

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const themeToggle = document.getElementById("themeToggle");
const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Mobile navigation
menuToggle?.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
    });
});

// Theme switcher
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
    document.documentElement.dataset.theme = "light";
}

function updateThemeButton() {
    const isLight =
        document.documentElement.dataset.theme === "light";

    if (themeToggle) {
        themeToggle.textContent = isLight ? "☾" : "☼";

        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
    }
}

updateThemeButton();

themeToggle?.addEventListener("click", () => {
    const isLight =
        document.documentElement.dataset.theme !== "light";

    if (isLight) {
        document.documentElement.dataset.theme = "light";
        localStorage.setItem("portfolio-theme", "light");
    } else {
        delete document.documentElement.dataset.theme;
        localStorage.setItem("portfolio-theme", "dark");
    }

    updateThemeButton();
});

// Active navigation section
const navLinks = [
    ...document.querySelectorAll('.nav a[href^="#"]')
];

const observedSections = navLinks
    .map((link) =>
        document.querySelector(link.getAttribute("href"))
    )
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") ===
                    `#${entry.target.id}`
                );
            });
        });
    }, {
        rootMargin: "-35% 0px -55% 0px"
    });

    observedSections.forEach((section) =>
        observer.observe(section)
    );
}

// Reveal sections on scroll
const revealItems =
    document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealItems.forEach((item) =>
        revealObserver.observe(item)
    );
} else {
    revealItems.forEach((item) =>
        item.classList.add("is-visible")
    );
}


// =====================================
// TRUMETRIC / TRUSEARCH TYPEWRITER
// =====================================

(() => {
    const typewriter =
        document.querySelector("[data-typewriter]");

    const answerPanel =
        document.querySelector("[data-ai-answer]");

    const answerText =
        document.querySelector("[data-answer-text]");

    if (!typewriter) return;

    const demos = [
        {
            query: "hospitals with cardiac care in Bengaluru",
            answer: "Trusearch understands the intent behind a query and retrieves relevant hospital information using semantic search, even when exact keywords differ."
        },
        {
            query: "documents about semantic search latency",
            answer: "Semantic search uses vector embeddings to retrieve contextually relevant documents. Search analytics helps identify performance bottlenecks and improve query latency."
        },
        {
            query: "enterprise knowledge base with AI search",
            answer: "An enterprise AI search system combines semantic retrieval, document indexing and retrieval-augmented generation to provide answers grounded in internal knowledge."
        },
        {
            query: "improving vector search performance",
            answer: "Efficient chunking, embedding generation, indexing strategies and query optimisation help improve vector search performance."
        }
    ];

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let started = false;
    let timer = null;

    // Update AI answer
    function updateAnswer() {
        if (!answerPanel || !answerText) return;

        answerText.textContent = demos[phraseIndex].answer;
        answerPanel.classList.add("is-visible");
    }

    // Single typewriter loop
    function typeEffect() {
        const currentQuery = demos[phraseIndex].query;

        if (!deleting) {
            characterIndex++;

            typewriter.textContent =
                currentQuery.substring(0, characterIndex);

            if (characterIndex < currentQuery.length) {
                timer = setTimeout(typeEffect, 55);
            } else {
                // Display answer after typing finishes
                updateAnswer();

                deleting = true;
                timer = setTimeout(typeEffect, 3000);
            }

        } else {
            characterIndex--;

            typewriter.textContent =
                currentQuery.substring(0, characterIndex);

            if (characterIndex > 0) {
                timer = setTimeout(typeEffect, 30);
            } else {
                deleting = false;

                phraseIndex =
                    (phraseIndex + 1) % demos.length;

                timer = setTimeout(typeEffect, 500);
            }
        }
    }

    // Start animation only once
    function startTyping() {
        if (started) return;

        started = true;

        if (reducedMotion) {
            typewriter.textContent = demos[0].query;
            updateAnswer();
            return;
        }

        typeEffect();
    }

    // Wait until showcase becomes visible
    const showcase =
        document.querySelector(".work-showcase");

    if ("IntersectionObserver" in window && showcase) {
        const typingObserver = new IntersectionObserver(
            (entries, observer) => {
                if (entries.some(entry => entry.isIntersecting)) {
                    startTyping();
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        typingObserver.observe(showcase);
    } else {
        startTyping();
    }
})();
