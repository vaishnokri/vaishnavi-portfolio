// Vaishnavi Kumari — Developer Passport
// Small interactive touches: active nav highlight + reveal-on-scroll.

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Active nav link highlight based on scroll position
  const sections = document.querySelectorAll("main .page[id]");
  const navLinks = document.querySelectorAll(".topbar__nav a");

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  // Reveal-on-scroll for entries and stamps
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(".entry, .stamp");
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform += " translateY(12px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = el.style.transform.replace(
                " translateY(12px)",
                ""
              );
            }, i * 60);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // Theme toggle with localStorage persistence and system preference fallback
  const themeToggleBtn = document.getElementById("theme-toggle");

  const getPreferredTheme = () => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {
      // Ignore localStorage access restrictions
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggleBtn) {
      const isDark = theme === "dark";
      const nextTheme = isDark ? "light" : "dark";
      themeToggleBtn.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      themeToggleBtn.setAttribute("title", `Switch to ${nextTheme} theme`);
      themeToggleBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
  };

  // Initialize theme on load
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", nextTheme);
      } catch {
        // Ignore localStorage access restrictions
      }
      applyTheme(nextTheme);
    });
  }

  // Listen for system theme changes when no explicit preference is stored
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      try {
        if (!localStorage.getItem("theme")) {
          applyTheme(e.matches ? "dark" : "light");
        }
      } catch {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
})();
