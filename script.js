// Main page hooks. It is all plain JS on purpose.
const root = document.documentElement;
const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const commandForm = document.querySelector("[data-command-form]");
const commandInput = document.querySelector("[data-command-input]");
const consoleLog = document.querySelector("[data-console-log]");
const commandChips = [...document.querySelectorAll("[data-command-chip]")];
const projectOpeners = [...document.querySelectorAll("[data-project-open]")];
const drawerShell = document.querySelector("[data-project-drawer-shell]");
const drawer = document.querySelector("[data-project-drawer]");
const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");
const drawerCloseButton = document.querySelector("[data-drawer-close]");
const drawerStatus = document.querySelector("[data-drawer-status]");
const drawerTitle = document.querySelector("[data-drawer-title]");
const drawerSummary = document.querySelector("[data-drawer-summary]");
const drawerWhy = document.querySelector("[data-drawer-why]");
const drawerTags = document.querySelector("[data-drawer-tags]");
const drawerLink = document.querySelector("[data-drawer-link]");
const activityState = document.querySelector("[data-activity-state]");
const activityList = document.querySelector("[data-activity-list]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const MAX_CONSOLE_LINES = 8;

// Start the console with something simple instead of sounding like a fake terminal.
const DEFAULT_CONSOLE_LINES = [
  { type: "system", text: "Hey, this box actually works." },
  { type: "hint", text: "Type help if you want the list. Projects also works." },
];

// If GitHub is slow or rate-limited, these keep the panel from looking dead.
const FALLBACK_ACTIVITY = [
  "updated Jarvis_HUD",
  "pushed changes to Daily-Song-Journal",
  "updated InfinityAI",
  "updated Echo",
  "updated StudyFocus",
];

// One project list powers both the buttons on the page and the console commands.
const PROJECTS = {
  jarvis_hud: {
    title: "Jarvis_HUD",
    status: "Main Project",
    summary:
      "A Stark-inspired dashboard project built to feel clean, futuristic, and detailed instead of basic.",
    why:
      "This is where my Marvel influence turns into real interface choices and a stronger product style.",
    tags: ["Python", "HUD UI", "System Design"],
    repo: "https://github.com/srinivasagudi0/Jarvis_HUD",
  },
  infinityai: {
    title: "InfinityAI",
    status: "Featured Project",
    summary:
      "A bigger assistant system that combines input, planning, browsing, file work, project generation, and self-fixing.",
    why:
      "It shows I like building connected systems, not just one-off features.",
    tags: ["Python", "AI Assistant", "Automation"],
    repo: "https://github.com/srinivasagudi0/InfinityAI",
  },
  echo: {
    title: "Echo",
    status: "Featured Project",
    summary:
      "A music-focused app that analyzes lyrics, compares songs, remixes tone, and turns songs into explanations or stories.",
    why:
      "It mixes creativity and software in a way that feels personal to me.",
    tags: ["Python", "Streamlit", "Music"],
    repo: "https://github.com/srinivasagudi0/Echo",
  },
  studyfocus: {
    title: "StudyFocus",
    status: "Featured Project",
    summary:
      "A study tracking tool that helps students see how they learn over time while keeping the experience practical.",
    why:
      "It is built around a real student problem instead of just demo energy.",
    tags: ["Python", "Flask", "Student Tools"],
    repo: "https://github.com/srinivasagudi0/StudyFocus",
  },
  daily_song_journal: {
    title: "Daily-Song-Journal",
    status: "Side Project",
    summary:
      "A small app for logging one song per day in a way that feels personal and easy to grow later.",
    why:
      "It takes a simple idea and turns it into something meaningful instead of overcomplicating it.",
    tags: ["Python", "Music", "Journal"],
    repo: "https://github.com/srinivasagudi0/Daily-Song-Journal",
  },
  luck_arcade: {
    title: "Luck-Arcade",
    status: "Side Project",
    summary:
      "A small arcade setup with CLI and Flask play modes, built around lightweight games and quick interaction.",
    why:
      "It shows I like playful software too, not only serious tools.",
    tags: ["Python", "CLI", "Flask"],
    repo: "https://github.com/srinivasagudi0/Luck-Arcade",
  },
  spotify_playlist_generator: {
    title: "Spotify-Playlist-Generator",
    status: "Side Project",
    summary:
      "A mood-to-music project that turns feelings into playlist recommendations with a simple flow.",
    why:
      "It connects music taste with product thinking in a fast, useful format.",
    tags: ["Python", "Spotify", "Recommendations"],
    repo: "https://github.com/srinivasagudi0/Spotify-Playlist-Generator",
  },
};

const COMMANDS = {
  help: () => {
    appendConsoleLine(
      "info",
      "Try: help, about, projects, wins, timeline, contact, goal, github, jarvis_hud, infinityai, echo, studyfocus, clear.",
    );
  },
  about: () => {
    scrollToSection("about");
    appendConsoleLine("success", "Went to About.");
  },
  projects: () => {
    scrollToSection("projects");
    appendConsoleLine("success", "Went to Projects.");
  },
  wins: () => {
    scrollToSection("wins");
    appendConsoleLine("success", "Went to Wins.");
  },
  timeline: () => {
    scrollToSection("timeline");
    appendConsoleLine("success", "Went to Timeline.");
  },
  contact: () => {
    scrollToSection("contact");
    appendConsoleLine("success", "Went to Contact.");
  },
  goal: () => {
    appendConsoleLine("info", "Big goal: become an OpenAI full-stack engineer one day.");
  },
  github: (_, triggerElement) => {
    window.open("https://github.com/srinivasagudi0", "_blank", "noopener,noreferrer");
    appendConsoleLine("success", "Opened GitHub.");
    if (triggerElement instanceof HTMLElement) {
      triggerElement.blur();
    }
  },
  jarvis_hud: (_, triggerElement) => {
    openProjectDrawer("jarvis_hud", triggerElement);
    appendConsoleLine("success", "Opened Jarvis_HUD details.");
  },
  infinityai: (_, triggerElement) => {
    openProjectDrawer("infinityai", triggerElement);
    appendConsoleLine("success", "Opened InfinityAI details.");
  },
  echo: (_, triggerElement) => {
    openProjectDrawer("echo", triggerElement);
    appendConsoleLine("success", "Opened Echo details.");
  },
  studyfocus: (_, triggerElement) => {
    openProjectDrawer("studyfocus", triggerElement);
    appendConsoleLine("success", "Opened StudyFocus details.");
  },
  clear: () => {
    resetConsole();
  },
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lastDrawerTrigger = null;
let hideDrawerTimer = null;

root.classList.add("js-ready");

// Header just picks up a light background once you scroll a bit.
const updateHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

// Nav highlighting follows whatever section is most in view.
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

// Console lines stay capped so the panel does not get too tall.
const appendConsoleLine = (type, text) => {
  if (!consoleLog) {
    return;
  }

  const item = document.createElement("li");
  item.className = `console-line console-line--${type}`;
  item.textContent = text;
  consoleLog.append(item);

  while (consoleLog.children.length > MAX_CONSOLE_LINES) {
    consoleLog.firstElementChild?.remove();
  }

  consoleLog.scrollTop = consoleLog.scrollHeight;
};

const resetConsole = () => {
  if (!consoleLog) {
    return;
  }

  consoleLog.textContent = "";
  DEFAULT_CONSOLE_LINES.forEach((entry) => appendConsoleLine(entry.type, entry.text));
};

const normalizeCommand = (input) =>
  input.trim().toLowerCase().replace(/[\s-]+/g, "_");

// Keep section jumps in one place so commands and nav feel consistent.
const scrollToSection = (id) => {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  setActiveNav(id);
  target.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start",
  });
};

// The tag list is built each time because the drawer is shared across all projects.
const renderDrawerTags = (tags) => {
  if (!drawerTags) {
    return;
  }

  drawerTags.textContent = "";

  tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.textContent = tag;
    drawerTags.append(chip);
  });
};

// The drawer always gives focus back to whatever opened it so keyboard flow stays sane.
const openProjectDrawer = (projectId, triggerElement) => {
  const project = PROJECTS[projectId];

  if (!project || !drawerShell || !drawer) {
    return;
  }

  if (hideDrawerTimer) {
    window.clearTimeout(hideDrawerTimer);
    hideDrawerTimer = null;
  }

  if (triggerElement instanceof HTMLElement) {
    lastDrawerTrigger = triggerElement;
  }

  if (drawerStatus) {
    drawerStatus.textContent = project.status ?? "";
    drawerStatus.hidden = !project.status;
  }

  if (drawerTitle) {
    drawerTitle.textContent = project.title;
  }

  if (drawerSummary) {
    drawerSummary.textContent = project.summary;
  }

  if (drawerWhy) {
    drawerWhy.textContent = project.why;
  }

  if (drawerLink) {
    drawerLink.href = project.repo;
  }

  renderDrawerTags(project.tags);

  drawerShell.hidden = false;
  document.body.classList.add("drawer-open");

  window.requestAnimationFrame(() => {
    drawerShell.classList.add("is-open");
    drawer.focus();
  });
};

// Close has a tiny delay only so the slide-out can finish first.
const closeProjectDrawer = () => {
  if (!drawerShell || drawerShell.hidden) {
    return;
  }

  drawerShell.classList.remove("is-open");
  document.body.classList.remove("drawer-open");

  const finishClose = () => {
    drawerShell.hidden = true;
    lastDrawerTrigger?.focus();
  };

  if (prefersReducedMotion.matches) {
    finishClose();
    return;
  }

  hideDrawerTimer = window.setTimeout(finishClose, 220);
};

// Basic focus trap. Keeps keyboard users inside the drawer until it closes.
const trapDrawerFocus = (event) => {
  if (!drawer || drawerShell?.hidden) {
    return;
  }

  const focusableElements = [...drawer.querySelectorAll(FOCUSABLE_SELECTOR)];

  if (!focusableElements.length) {
    event.preventDefault();
    drawer.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (document.activeElement === drawer) {
    event.preventDefault();
    (event.shiftKey ? lastElement : firstElement).focus();
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

// Same handler for typed commands and quick chips keeps the behavior easy to follow.
const runCommand = (command, source, triggerElement) => {
  const normalized = normalizeCommand(command);

  if (!normalized) {
    return;
  }

  const action = COMMANDS[normalized];

  if (!action) {
    appendConsoleLine("error", "That one does not work here. Try help.");
    return;
  }

  action(source, triggerElement);
};

// GitHub sends a lot of event types. We boil them down to short lines here.
const mapActivityEvent = (event) => {
  if (!event?.repo?.name) {
    return null;
  }

  const repoName = event.repo.name.split("/").pop();

  if (event.type === "PushEvent") {
    return `pushed changes to ${repoName}`;
  }

  if (event.type === "CreateEvent" && event.payload?.ref_type === "repository") {
    return `created ${repoName}`;
  }

  if (event.type === "WatchEvent") {
    return `starred ${repoName}`;
  }

  return `updated ${repoName}`;
};

// One renderer handles loading, success, and fallback.
const renderActivity = (items, mode) => {
  if (!activityState || !activityList) {
    return;
  }

  activityList.textContent = "";

  if (mode === "loading") {
    activityState.textContent = "Checking GitHub...";
    return;
  }

  activityState.textContent =
    mode === "fallback" ? "GitHub missed. Showing saved activity." : "Live from GitHub.";

  items.forEach((item) => {
    const row = document.createElement("li");
    row.textContent = item;
    activityList.append(row);
  });
};

// GitHub is just an enhancement here. If it fails, fall back fast and keep the panel useful.
const loadRecentActivity = async () => {
  renderActivity([], "loading");

  let timeoutId = null;
  let controller = null;

  try {
    if (typeof AbortController === "function") {
      controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 4000);
    }

    const response = await fetch(
      "https://api.github.com/users/srinivasagudi0/events/public?per_page=5",
      controller ? { signal: controller.signal } : undefined,
    );

    if (!response.ok) {
      throw new Error(`GitHub activity request failed: ${response.status}`);
    }

    const events = await response.json();
    const items = events.map(mapActivityEvent).filter(Boolean).slice(0, 5);

    if (!items.length) {
      throw new Error("No usable activity items");
    }

    renderActivity(items, "success");
  } catch {
    renderActivity(FALLBACK_ACTIVITY, "fallback");
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
};

// This watches sections and keeps the nav state from feeling stuck.
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

// Small reveal effect, but only if motion is allowed.
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

// Startup is kept in a plain order so it is easy to trace.
resetConsole();
updateHeader();
enableSectionTracking();
enableReveal();
loadRecentActivity();

// Typed commands.
commandForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!commandInput) {
    return;
  }

  const rawCommand = commandInput.value;
  commandInput.value = "";
  runCommand(rawCommand, "input", commandInput);
});

// Quick command chips use the same command runner as the input.
commandChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    runCommand(chip.dataset.commandChip ?? "", "chip", chip);
  });
});

// Project buttons and command-based opens both feed into the same drawer.
projectOpeners.forEach((button) => {
  button.addEventListener("click", () => {
    openProjectDrawer(button.dataset.projectOpen ?? "", button);
  });
});

// Close controls stay boring and reliable.
drawerCloseButton?.addEventListener("click", closeProjectDrawer);
drawerBackdrop?.addEventListener("click", closeProjectDrawer);

// Drawer keyboard handling.
document.addEventListener("keydown", (event) => {
  if (drawerShell?.hidden) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeProjectDrawer();
    return;
  }

  if (event.key === "Tab") {
    trapDrawerFocus(event);
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });

// If reduced motion gets turned on while the page is open, reveal everything.
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
