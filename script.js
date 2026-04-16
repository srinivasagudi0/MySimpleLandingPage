const root = document.documentElement;
const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

root.classList.add("js-ready");

const updateHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;

    if (isActive) {
      link.setAttribute("aria-current", "true");
      return;
    }

    link.removeAttribute("aria-current");
  });
};

const enableSectionTracking = () => {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const sections = navLinks
    .map((link) => {
      const targetId = link.getAttribute("href");
      return targetId ? document.querySelector(targetId) : null;
    })
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (!visibleEntries.length) {
        return;
      }

      visibleEntries
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .slice(0, 1)
        .forEach((entry) => {
          if (entry.target.id) {
            setActiveNav(entry.target.id);
          }
        });
    },
    {
      threshold: [0.2, 0.35, 0.55],
      rootMargin: "-18% 0px -46% 0px",
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
};

const enableReveal = () => {
  if (!revealItems.length) {
    return;
  }

  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

if (year) {
  year.textContent = new Date().getFullYear();
}

updateHeader();
enableSectionTracking();
enableReveal();

window.addEventListener("scroll", updateHeader, { passive: true });

const handleMotionChange = () => {
  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
};

if (typeof prefersReducedMotion.addEventListener === "function") {
  prefersReducedMotion.addEventListener("change", handleMotionChange);
} else if (typeof prefersReducedMotion.addListener === "function") {
  prefersReducedMotion.addListener(handleMotionChange);
}
