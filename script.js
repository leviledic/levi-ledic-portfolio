const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const navMenuButton = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const themeToggle = document.querySelector("[data-theme-toggle]");
const contactSection = document.querySelector("#contact");
const currentPage = body.dataset.page || "home";

const projectItems = [
  {
    id: "01",
    title: "Soccer",
    shortDescription: "Timing, movement, teamwork, and quick decisions.",
    detail: "Soccer is one of my personal interests because it involves movement, awareness, timing, teamwork, and quick decisions.",
    tags: ["Soccer", "Movement", "Teamwork"]
  },
  {
    id: "02",
    title: "Design",
    shortDescription: "Clean layouts, simple pages, and things that feel easy to use.",
    detail: "I like design when it feels simple, calm, and easy to understand without needing extra explanation.",
    tags: ["Design", "Layout", "Clarity"]
  },
  {
    id: "03",
    title: "Building",
    shortDescription: "Turning ideas into real projects instead of leaving them as notes.",
    detail: "I like taking ideas and making them real, whether that means a page, a tool, a setup, a prototype, or something physical.",
    tags: ["Building", "Projects", "Prototypes"]
  },
  {
    id: "04",
    title: "Smart Spaces",
    shortDescription: "Making rooms, devices, and controls easier to understand and use.",
    detail: "I'm interested in smart spaces because they connect real rooms, controls, sensors, dashboards, and everyday routines.",
    tags: ["Smart Spaces", "Dashboards", "Sensors"]
  },
  {
    id: "05",
    title: "Robotics",
    shortDescription: "Building, testing, competing, and learning through robotics.",
    detail: "I participated on a VEX robotics team and competed at the state level, where my team won an official VEX award.",
    tags: ["Robotics", "VEX Robotics", "Competition"]
  },
  {
    id: "06",
    title: "Hands-On Projects",
    shortDescription: "3D printing, prototypes, hardware ideas, and physical builds.",
    detail: "I like hands-on projects because they combine physical building with problem-solving, testing, and improving.",
    tags: ["Hands-On Projects", "3D Printing", "Hardware"]
  },
  {
    id: "07",
    title: "Web Ideas",
    shortDescription: "Simple pages, tools, and interactive ideas that can grow over time.",
    detail: "I like web ideas that start simple but can turn into useful tools, dashboards, or interactive experiences.",
    tags: ["Web Ideas", "Tools", "Interactive"]
  },
  {
    id: "08",
    title: "Learning",
    shortDescription: "Trying new things, taking classes, and improving what already exists.",
    detail: "I have participated in multiple educational USM classes and courses, learning a variety of subjects and skills through hands-on and structured learning.",
    tags: ["Learning", "USM Classes", "USM Courses"]
  }
];

const projectItemsById = Object.fromEntries(projectItems.map((item) => [item.id, item]));

const applyTheme = (theme, persist = true) => {
  root.setAttribute("data-theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  if (persist) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Ignore storage errors and keep the current theme active.
    }
  }
};

const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const syncThemeFromSystem = () => {
  let storedTheme = null;

  try {
    storedTheme = localStorage.getItem("theme");
  } catch (error) {
    storedTheme = null;
  }

  if (storedTheme !== "light" && storedTheme !== "dark") {
    applyTheme(systemThemeQuery.matches ? "dark" : "light", false);
  }
};

applyTheme(root.getAttribute("data-theme") || "light", false);
syncThemeFromSystem();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

if (typeof systemThemeQuery.addEventListener === "function") {
  systemThemeQuery.addEventListener("change", syncThemeFromSystem);
}

navMenuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  navMenuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    navMenuButton?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    body.classList.remove("menu-open");
    navMenuButton?.setAttribute("aria-expanded", "false");
  }
});

const setNavState = (activePage) => {
  navLinks.forEach((link) => {
    const linkPage = link.dataset.pageLink;
    const isActive = linkPage === activePage;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

setNavState(currentPage);

if (contactSection) {
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setNavState("contact");
        } else {
          setNavState(currentPage);
        }
      });
    },
    {
      rootMargin: "-40% 0px -45% 0px",
      threshold: 0.1
    }
  );

  contactObserver.observe(contactSection);
}

const brandMark = document.querySelector(".brand-mark");
const brandIcon = document.querySelector(".brand-icon");

if (brandMark && brandIcon && finePointer && !reduceMotion) {
  const resetBrandIcon = () => {
    brandMark.style.setProperty("--logo-rx", "0deg");
    brandMark.style.setProperty("--logo-ry", "0deg");
    brandMark.style.setProperty("--logo-tx", "0px");
    brandMark.style.setProperty("--logo-ty", "0px");
  };

  brandMark.addEventListener("pointermove", (event) => {
    const rect = brandMark.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = Math.max(-12, Math.min(12, x * 24));
    const rotateX = Math.max(-12, Math.min(12, -y * 24));
    const translateX = Math.max(-4, Math.min(4, x * 8));
    const translateY = Math.max(-4, Math.min(4, y * 8));

    brandMark.style.setProperty("--logo-rx", `${rotateX}deg`);
    brandMark.style.setProperty("--logo-ry", `${rotateY}deg`);
    brandMark.style.setProperty("--logo-tx", `${translateX}px`);
    brandMark.style.setProperty("--logo-ty", `${translateY}px`);
  });

  brandMark.addEventListener("pointerleave", resetBrandIcon);
  resetBrandIcon();
}

const hoverCards = [...document.querySelectorAll(".hover-card")];

if (finePointer && !reduceMotion) {
  hoverCards.forEach((card) => {
    const media = card.querySelector(".card-media img, .feature-image img");

    const resetCard = () => {
      card.style.setProperty("--card-rotate-x", "0deg");
      card.style.setProperty("--card-rotate-y", "0deg");
      card.style.setProperty("--card-lift", "0px");
      card.style.setProperty("--card-scale", "1");

      if (media) {
        media.style.transform = "scale(1)";
        media.style.filter = "brightness(0.9) contrast(1)";
      }
    };

    resetCard();

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = Math.max(-4, Math.min(4, x * 8));
      const rotateX = Math.max(-2, Math.min(2, -y * 4));

      card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
      card.style.setProperty("--card-lift", "-4px");
      card.style.setProperty("--card-scale", "1.01");

      if (media) {
        media.style.transform = "scale(1.04)";
        media.style.filter = "brightness(1.04) contrast(1.04)";
      }
    });

    card.addEventListener("pointerleave", resetCard);
  });
}

const getFocusableElements = (element) =>
  [...element.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
    (item) => !item.hasAttribute("hidden")
  );

const detailModal = (() => {
  const container = document.createElement("div");
  container.className = "detail-modal";
  container.hidden = true;
  container.innerHTML = `
    <div class="detail-modal-backdrop" data-modal-backdrop></div>
    <div
      class="detail-modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      aria-describedby="detail-modal-copy"
    >
      <div class="detail-modal-head">
        <div class="detail-modal-heading">
          <span class="detail-modal-index" data-modal-index></span>
          <span class="detail-modal-label" data-modal-label></span>
        </div>
        <button type="button" class="detail-modal-close" data-modal-close aria-label="Close project popup">X</button>
      </div>
      <h2 class="detail-modal-title" id="detail-modal-title" data-modal-title></h2>
      <p class="detail-modal-copy" id="detail-modal-copy" data-modal-copy></p>
      <div class="detail-modal-meta" data-modal-meta></div>
      <div class="detail-modal-tags" data-modal-tags></div>
    </div>
  `;

  document.body.appendChild(container);

  const panel = container.querySelector(".detail-modal-panel");
  const closeButton = container.querySelector("[data-modal-close]");
  const backdrop = container.querySelector("[data-modal-backdrop]");
  const indexNode = container.querySelector("[data-modal-index]");
  const labelNode = container.querySelector("[data-modal-label]");
  const titleNode = container.querySelector("[data-modal-title]");
  const copyNode = container.querySelector("[data-modal-copy]");
  const metaNode = container.querySelector("[data-modal-meta]");
  const tagsNode = container.querySelector("[data-modal-tags]");

  let lastFocusedElement = null;

  const renderMetaItem = (label, value) => `
    <div class="detail-modal-meta-item">
      <span class="detail-modal-meta-label">${label}</span>
      <span class="detail-modal-meta-value">${value}</span>
    </div>
  `;

  const close = () => {
    if (container.hidden) {
      return;
    }

    container.hidden = true;
    body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  const trapFocus = (event) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements(panel);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  panel.addEventListener("keydown", trapFocus);

  container.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      close();
    }
  });

  closeButton.addEventListener("click", close);

  const open = (payload, triggerElement) => {
    lastFocusedElement = triggerElement || document.activeElement;

    indexNode.textContent = payload.indexText || "";
    labelNode.textContent = payload.label || "";
    titleNode.textContent = payload.title || "";
    copyNode.textContent = payload.detail || "";

    metaNode.innerHTML = "";
    tagsNode.innerHTML = "";

    if (payload.date) {
      metaNode.insertAdjacentHTML("beforeend", renderMetaItem("Date", payload.date));
    }

    if (payload.category) {
      metaNode.insertAdjacentHTML("beforeend", renderMetaItem("Category", payload.category));
    }

    if (payload.related && payload.related.length) {
      metaNode.insertAdjacentHTML("beforeend", renderMetaItem("Related", payload.related.join(", ")));
    }

    if (payload.tags && payload.tags.length) {
      payload.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "detail-modal-tag";
        chip.textContent = tag;
        tagsNode.appendChild(chip);
      });
    }

    metaNode.hidden = !metaNode.children.length;
    tagsNode.hidden = !tagsNode.children.length;

    container.hidden = false;
    body.classList.add("modal-open");
    closeButton.focus();
  };

  return { open, close, container };
})();

const buildProjectModalPayload = (projectId) => {
  const project = projectItemsById[projectId];

  if (!project) {
    return null;
  }

  return {
    indexText: project.id,
    label: "Projects",
    title: project.title,
    detail: project.detail,
    tags: project.tags
  };
};

const buildTimelineModalPayload = (button) => ({
  indexText: button.dataset.timelineDate || "",
  date: button.dataset.timelineDate || "",
  label: "Timeline",
  title: button.dataset.timelineTitle || "",
  detail: button.dataset.timelineDescription || "",
  category: button.dataset.timelineCategory || "",
  related: button.dataset.timelineRelated
    ? button.dataset.timelineRelated.split("|").map((item) => item.trim()).filter(Boolean)
    : []
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!detailModal.container.hidden) {
      detailModal.close();
      return;
    }

    body.classList.remove("menu-open");
    navMenuButton?.setAttribute("aria-expanded", "false");
  }
});

const projectCards = [...document.querySelectorAll("[data-project-card]")];

const openProjectModal = (projectId, triggerElement) => {
  const payload = buildProjectModalPayload(projectId);

  if (payload) {
    detailModal.open(payload, triggerElement);
  }
};

const activateOnEnter = (element, handler) => {
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handler();
    }
  });
};

projectCards.forEach((card) => {
  const { projectId } = card.dataset;

  card.addEventListener("click", () => openProjectModal(projectId, card));
  activateOnEnter(card, () => openProjectModal(projectId, card));
});

const heroPreview = document.querySelector("[data-hero-preview]");

if (heroPreview) {
  const previewId = heroPreview.querySelector("[data-preview-id]");
  const previewTitle = heroPreview.querySelector("[data-preview-title]");
  const previewDescription = heroPreview.querySelector("[data-preview-description]");
  let currentPreviewId = "";
  let previewTimer = null;

  const updatePreviewContent = (item) => {
    heroPreview.dataset.projectId = item.id;
    heroPreview.setAttribute("aria-label", `Open project details for ${item.title}`);
    previewId.textContent = item.id;
    previewTitle.textContent = item.title;
    previewDescription.textContent = item.shortDescription;
    currentPreviewId = item.id;
  };

  const getNextProject = () => {
    const availableItems = projectItems.filter((item) => item.id !== currentPreviewId);
    return availableItems[Math.floor(Math.random() * availableItems.length)];
  };

  const schedulePreviewSwap = () => {
    const delay = 7000 + Math.floor(Math.random() * 3001);

    previewTimer = window.setTimeout(() => {
      const nextItem = getNextProject();

      if (!reduceMotion) {
        heroPreview.classList.add("is-transitioning");
        window.setTimeout(() => {
          updatePreviewContent(nextItem);
          heroPreview.classList.remove("is-transitioning");
        }, 220);
      } else {
        updatePreviewContent(nextItem);
      }

      schedulePreviewSwap();
    }, delay);
  };

  updatePreviewContent(projectItems[Math.floor(Math.random() * projectItems.length)]);
  schedulePreviewSwap();

  heroPreview.addEventListener("click", () => openProjectModal(currentPreviewId, heroPreview));
  activateOnEnter(heroPreview, () => openProjectModal(currentPreviewId, heroPreview));

  window.addEventListener("beforeunload", () => {
    if (previewTimer) {
      window.clearTimeout(previewTimer);
    }
  });
}

const timeline = document.querySelector("[data-timeline]");

if (timeline) {
  const items = [...timeline.querySelectorAll("[data-timeline-item]")];
  let activeIndex = 0;

  const openTimelineItem = (index) => {
    items.forEach((item, itemIndex) => {
      const button = item.querySelector(".timeline-dot");
      const isOpen = itemIndex === index;
      item.classList.toggle("is-open", isOpen);
      button?.setAttribute("aria-expanded", String(isOpen));
    });
  };

  const previewTimelineItem = (index) => {
    activeIndex = index;
    openTimelineItem(index);
  };

  openTimelineItem(activeIndex);

  items.forEach((item, index) => {
    const button = item.querySelector(".timeline-dot");

    if (!button) {
      return;
    }

    if (finePointer) {
      item.addEventListener("pointerenter", () => previewTimelineItem(index));
      button.addEventListener("pointermove", () => previewTimelineItem(index));
    }

    button.addEventListener("focus", () => previewTimelineItem(index));
    button.addEventListener("click", () => {
      previewTimelineItem(index);
      detailModal.open(buildTimelineModalPayload(button), button);
    });
  });

  timeline.addEventListener("pointerleave", () => {
    if (window.innerWidth > 860) {
      openTimelineItem(activeIndex);
    }
  });
}

const soccerBall = document.querySelector("[data-soccer-ball]");

if (soccerBall) {
  const core = soccerBall.querySelector(".soccer-ball-core");
  let rotationX = -18;
  let rotationY = 26;
  let velocityX = 0;
  let velocityY = 0;
  let dragging = false;
  let hasInteracted = false;
  let pointerId = null;
  let lastX = 0;
  let lastY = 0;

  const renderBall = () => {
    core.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(10deg)`;
  };

  const animateBall = () => {
    if (!dragging) {
      if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) {
        rotationX += velocityX;
        rotationY += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;
      } else if (!hasInteracted && !reduceMotion) {
        rotationY += 0.08;
      }

      renderBall();
    }

    window.requestAnimationFrame(animateBall);
  };

  const clampRotationX = (value) => Math.max(-45, Math.min(45, value));

  soccerBall.addEventListener("pointerdown", (event) => {
    dragging = true;
    hasInteracted = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    velocityX = 0;
    velocityY = 0;
    soccerBall.setPointerCapture(pointerId);
  });

  soccerBall.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    rotationY += deltaX * 0.45;
    rotationX = clampRotationX(rotationX - deltaY * 0.32);
    velocityY = deltaX * 0.03;
    velocityX = -deltaY * 0.02;
    lastX = event.clientX;
    lastY = event.clientY;

    renderBall();
  });

  const releaseBall = (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    dragging = false;
    soccerBall.releasePointerCapture(pointerId);
    pointerId = null;
  };

  soccerBall.addEventListener("pointerup", releaseBall);
  soccerBall.addEventListener("pointercancel", releaseBall);
  soccerBall.addEventListener("pointerleave", (event) => {
    if (dragging && event.pointerId === pointerId) {
      releaseBall(event);
    }
  });

  renderBall();
  animateBall();
}
