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
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
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
})();
